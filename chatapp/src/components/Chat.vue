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
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">
      {{ activeStudent.name }} さんのチャット
    </h1>
    <div class="mt-2">
      <p>ログインユーザ：{{ teacherName }}さん</p>

      <div
        v-for="subject in activeStudent.subject"
        :key="subject"
        class="util-ml-8px"
      >
        <button
          @click="handleChangeSubject(subject)"
          :class="{ 'active-subject': activeSubject === subject }"
        >
          {{ subject }}
        </button>
      </div>

      <!-- ▼ チャットログを上に配置 ▼ -->
      <div class="chat-container mt-3" v-if="chatList.length">
        <div class="scroll-region">
          <ul>
            <li class="item mt-2" v-for="(chat, i) in chatList" :key="i">
              {{ `${chat.name}: ${chat.content}` }}
            </li>
          </ul>
        </div>
      </div>

      <!-- ▼ 入力欄と操作ボタン ▼ -->
      <textarea
        v-model="chatContent"
        placeholder="投稿文を入力してください"
        rows="4"
        class="area"
      ></textarea>
      <div class="mt-2">
        <button class="button-normal" @click="handleSendChat">投稿</button>
      </div>
    </div>

    <router-link to="/student_list" class="link">
      <button
        type="button"
        class="button-normal button-exit"
        @click="handleExitRoom"
      >
        生徒一覧へ戻る
      </button>
    </router-link>
  </div>
</template>

<style scoped>
.link {
  text-decoration: none;
}

.area {
  width: 80vw;
  border: 1px solid #000;
  margin-top: 8px;
}

.item {
  display: block;
}

.util-ml-8px {
  margin-left: 8px;
}

.button-exit {
  color: #000;
  margin-top: 8px;
}

/* ▼ チャットログ領域を固定してスクロール可能にする ▼ */
.chat-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 200px;
}

.scroll-region {
  max-height: 300px; /* ログの高さを制限 */
  overflow-y: auto; /* 縦スクロール有効 */
  padding: 0.5rem;
}

.active-subject {
  background-color: #d0d7e2;
}
</style>
