<script setup>
import { inject, ref, reactive, onMounted } from "vue";
import socketManager from "../socketManager.js";

// state
const teacherName = inject("teacherName");
const activeStudent = inject("activeStudent");
const activeSubject = ref(activeStudent.subject[0]);
const chatContent = ref("");
const chatList = reactive([]);

// client socket
const socket = socketManager.getInstance();

// lifecycle
onMounted(() => {
  const registerSocketEvent = () => {
    socket.on("updateChatEvent", (data) => {
      if (!data) return;
      chatList.splice(0, chatList.length, ...(Array.isArray(data) ? data : []));
    });
  };

  registerSocketEvent();
  handleEnterRoom();
});

// methods
const handleSendChat = () => {
  socket.emit("sendChatEvent", {
    userName: teacherName.value,
    studentName: activeStudent.name,
    subject: activeSubject.value,
    content: chatContent.value,
  });
  chatContent.value = "";
};

const handleEnterRoom = () => {
  socket.emit("enterRoomEvent", {
    studentName: activeStudent.name,
    subject: activeSubject.value,
  });
};

const handleExitRoom = () => {
  socket.emit("exitRoomEvent", {
    studentName: activeStudent.name,
    subject: activeSubject.value,
  });
};

const handleChangeSubject = (newSubject) => {
  handleExitRoom();
  activeSubject.value = newSubject;
  handleEnterRoom();
};
</script>

<template>
  <div class="container">
    <!-- header -->
    <div class="header">
      <h1 class="text-h3 font-weight-medium">{{ activeStudent.name }} さん</h1>

      <router-link to="/student_list" class="link">
        <button type="button" class="back-list" @click="handleExitRoom">
          生徒一覧へ戻る
        </button>
      </router-link>

      <!-- 科目選択 -->
      <div class="subject-select">
        <button
          v-for="subject in activeStudent.subject"
          :key="subject"
          @click="handleChangeSubject(subject)"
          :class="{ 'active-subject': activeSubject === subject }"
        >
          {{ subject }}
        </button>
      </div>
    </div>

    <!-- チャットログ -->
    <div class="chat-container">
      <div class="scroll-region">
        <div
          v-for="(chat, i) in chatList"
          :key="i"
          class="chat-item"
          :class="chat.name === teacherName ? 'mine' : 'other'"
        >
          <div class="chat-name">{{ chat.name }}</div>
          <div class="chat-content">{{ chat.content }}</div>
        </div>
      </div>
    </div>

    <!-- 入力エリア -->
    <div class="input-area">
      <textarea
        v-model="chatContent"
        placeholder="記録・引き継ぎ内容を入力してください"
        rows="2"
        class="text-input"
      ></textarea>
      <button class="send-button" @click="handleSendChat">投稿</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100dvh;
  padding: 16px;
}

.header {
}

.chat-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.scroll-region {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid red;
}

.chat-item {
  border: 1px solid blue;
  padding: 8px;
  margin-left: 24px;
  margin-right: 24px;
  border-radius: 12px;
}

.chat-name {
  font-weight: bold;
}

.chat-content {
  border: 1px solid black;
  border-radius: 8px;
  padding: 4px 8px;
}

.input-area {
  width: 100%;
  display: flex;
  align-items: center;
}

.text-input {
  flex: 1;
  display: block;
  width: 100%;
  border: 1px solid black;
}

.send-button {
  display: block;
  padding: 8px 16px;
  border: 1px solid black;
}

.link {
  color: blue;
  text-decoration: underline;
}

.text-h3 {
  font-size: 1.1rem;
  font-weight: bold;
}

.active-subject {
  padding: 8px 16px;
  margin-right: 24px;
}

.scroll-region {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid red;
  overflow-y: scroll;
  white-space: pre-wrap; /* テキストの折り返しを有効にする */
}
</style>
