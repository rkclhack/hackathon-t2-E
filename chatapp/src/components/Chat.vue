<script setup>
import { inject, ref, reactive, onMounted, nextTick } from "vue";
import socketManager from "../socketManager.js";

// state
const teacherName = inject("teacherName");
const activeStudent = inject("activeStudent");
const activeSubject = ref(activeStudent.subject[0]);
const chatContent = ref("");
const chatList = reactive([]);

// client socket
const socket = socketManager.getInstance();

// チャットリスト更新時にスクロールする
const scrollRegionRef = ref(null);
const scrollToBottom = () => {
  nextTick(() => {
    const el = scrollRegionRef.value;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    }
  });
};

// lifecycle
onMounted(() => {
  const registerSocketEvent = () => {
    socket.on("updateChatEvent", (data) => {
      if (!data) return;
      chatList.splice(0, chatList.length, ...(Array.isArray(data) ? data : []));
      scrollToBottom();
    });
  };

  registerSocketEvent();
  handleEnterRoom();
});

// methods
const handleSendChat = () => {
  if (!chatContent.value.trim()) return;
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
      <div class="header-content">
        <h1 class="header-title">{{ activeStudent.name }} さん</h1>

        <router-link to="/student_list" class="link">
          <button type="button" class="back-button" @click="handleExitRoom">
            生徒一覧へ戻る
          </button>
        </router-link>
      </div>
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
      <div class="scroll-region" ref="scrollRegionRef">
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
button {
  padding: 8px 16px;
  border: 1px solid #aaa;
  border-radius: 8px;
  background-color: #eee;
  color: black;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100dvh;
}

.header {
  border-bottom: 1px solid #ccc;
  padding: 16px;
}

.header-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.header-title {
  font-size: 2rem;
  font-weight: bold;
  flex: 1;
  white-space: nowrap;
  text-align: center;
}

.subject-select {
  display: flex;
  gap: 8px;
}

.chat-container {
  display: block;
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
  overflow-y: scroll;
  white-space: pre-wrap;
  padding: 16px 32px;
}

.chat-name {
  font-weight: bold;
}

.chat-content {
  background-color: #eee;
  padding: 16px;
  border-radius: 8px;
  width: fit-content;
  max-width: 70%;
  word-break: break-word;
}

.input-area {
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;
  border-top: 1px solid #ccc;
  padding: 16px;
}

.text-input {
  flex: 1;
  display: block;
  width: 100%;
  border: 1px solid #aaa;
  border-radius: 8px;
  padding: 8px;
}

.active-subject {
  background-color: orange;
  color: white;
}
</style>
