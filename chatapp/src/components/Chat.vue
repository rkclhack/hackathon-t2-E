<script setup>
import { inject, ref, reactive, onMounted } from "vue"
import socketManager from '../socketManager.js'

// #region global state
const userName = inject("userName")
const stuName = "山田太郎"
const subject = "数学"
// #endregion

// #region local variable
const socket = socketManager.getInstance()
const printedKeys = new Set()
// #endregion

// #region reactive variable
const chatContent = ref("")
const chatList = reactive([])
// #endregion

// #region lifecycle
onMounted(() => {
  registerSocketEvent()
})
// #endregion

// #region browser event handler
// 投稿メッセージをサーバに送信する
const onPublish = () => {
  socket.emit("publishEvent_save", {name: userName.value, stuName: stuName.value, subject: subject.value, content: chatContent.value});
  socket.emit("publishEvent_send", {stuName: stuName.value, subject: subject.value});
  // 入力欄を初期化
  chatContent.value = "";
}

// 退室メッセージをサーバに送信する
const onExit = () => {
  socket.emit("exitEvent", { name: userName.value });
}

// メモを画面上に表示する
const onMemo = () => {
  // メモの内容を表示
  chatList.push(`${userName.value} さんのメモ: ${chatContent.value}`);
  // 入力欄を初期化
  chatContent.value = "";
}
// #endregion

// #region socket event handler
// サーバから受信した入室メッセージ画面上に表示する
const onReceiveEnter = (data) => {
  chatList.push(`${data.name} さんが入室しました`)
}

// サーバから受信した退室メッセージを受け取り画面上に表示する
const onReceiveExit = (data) => {
  chatList.push(`${data.name} さんが退室しました`)
}

// サーバから受信した投稿メッセージを画面上に表示する
const onReceivePublish = (data) => {
  const messages = Array.isArray(data) ? data : [data];
  
  messages.sort((a, b) => (a?.time ?? 0) - (b?.time ?? 0));
  
  for (const message of messages) {
    const name = message?.name ?? "";
    const content = message?.content ?? "";
    const time = message?.time ?? 0;
    
    const k = `${time}|${name}|${content}`;
    if (printedKeys.has(k)) continue;
    
    chatList.push(`${name} さん : ${content}`)
    printedKeys.add(k);
  }
}
// #endregion

// #region local methods
// イベント登録をまとめる
const registerSocketEvent = () => {
  // 入室イベントを受け取ったら実行
  socket.on("enterEvent", (data) => {
    if (!data) return;
    onReceiveEnter(data);
    socket.emit("publishEvent_send", {stuName: stuName.value, subject: subject.value});
  })

  // 退室イベントを受け取ったら実行
  socket.on("exitEvent", (data) => {
    if (!data) return;
    onReceiveExit(data);
  })

  // 投稿イベントを受け取ったら実行
  socket.on("publishEvent_send", (data) => {
  if (!data) return;
  onReceivePublish(data);
  })
}
// #endregion
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">{{ stuName }}</h1>
    <router-link to="/student_list" class="link">
      <button type="button" class="button-normal button-exit" @click="onExit">生徒一覧へ</button>
    </router-link>
    <div class="mt-10">
      <p>ログインユーザ：{{ userName }}さん</p>
      <div class="mt-5 chat-container">
        <v-virtual-scroll
          v-if="chatList.length !== 0"
          :items="chatList"
          item-height="50"
          class="scroll-region"
  >
          <template v-slot:default="{ item, index }">
            <li class="item mt-4" :key="index">{{ item }}</li>
          </template>
        </v-virtual-scroll>
      </div>

      <textarea v-model="chatContent" variant="outlined" placeholder="投稿文を入力してください" rows="4" class="area"></textarea>
      <div class="mt-5">
        <button class="button-normal" @click="onPublish">投稿</button>
        <button class="button-normal util-ml-8px" @click="onMemo">メモ</button>
      </div>
    </div>
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

.chat-container {
  min-height: 300px; /* 空でも枠を確保 */
}

.scroll-region {
  max-height: 300px; /* スクロール制限 */
  overflow-y: auto;
  padding: 1rem;
}


</style>