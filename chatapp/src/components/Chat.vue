<script setup>
import { inject, ref, reactive, onMounted } from "vue";
import socketManager from "../socketManager.js";

// state
const userName = inject("userName") || "userName";
const studentName = ref("山田太郎");
const subject = ref("数学");
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
    userName: userName.value,
    studentName: studentName.value,
    subject: subject.value,
    content: chatContent.value,
  });
  chatContent.value = "";
};

const handleEnterRoom = () => {
  socket.emit("enterRoomEvent", {
    studentName: studentName.value,
    subject: subject.value,
  });
};

const handleExitRoom = () => {
  socket.emit("exitRoomEvent", {
    studentName: studentName.value,
    subject: subject.value,
  });
};

const handleChangeSubject = (newSubject) => {
  handleExitRoom();
  subject.value = newSubject;
  handleEnterRoom();
};
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">Vue.js Chat チャットルーム</h1>
    <div class="mt-10">
      <p>ログインユーザ：{{ userName }}さん</p>
      <textarea
        v-model="chatContent"
        variant="outlined"
        placeholder="投稿文を入力してください"
        rows="4"
        class="area"
      ></textarea>
      <div class="mt-5">
        <button
          class="button-normal mr-2"
          :class="{ action: subject === '数学' }"
          @click="handleChangeSubject('数学')"
        >
          数学
        </button>
        <button
          class="button-normal"
          :class="{ action: subject === '国語' }"
          @click="handleChangeSubject('国語')"
        >
          国語
        </button>
      </div>
      <div class="mt-5">
        <button class="button-normal" @click="handleSendChat">投稿</button>
      </div>
      <div class="mt-5" v-if="chatList.length !== 0">
        <ul>
          <li class="item mt-4" v-for="(chat, i) in chatList" :key="i">
            {{ `${chat.name}: ${chat.content}` }}
          </li>
        </ul>
      </div>
    </div>
    <router-link to="/" class="link">
      <button
        type="button"
        class="button-normal button-exit"
        @click="handleExitRoom"
      >
        退室する
      </button>
    </router-link>
  </div>
</template>

<style scoped>
.link {
  text-decoration: none;
}

.area {
  width: 500px;
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

.action {
  border: 2px solid blue;
}
</style>
