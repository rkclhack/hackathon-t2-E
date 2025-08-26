<script setup>
import { inject, ref, reactive, onMounted } from "vue"
import socketManager from '../socketManager.js'

// #region global state
const userName = inject("userName")
const stuName = ref("山田太郎")
const subject = ref("数学")
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

// 選択した教科に切り替える
const onChangeSubject = (selectSubject) =>{
  subject.value = selectSubject;
  printedKeys.clear()
  chatList.splice(0)
  socket.emit("publishEvent_send", {stuName: stuName.value, subject: subject.value});
}
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
  chatList.unshift(`${userName.value} さんのメモ: ${chatContent.value}`);
  // 入力欄を初期化
  chatContent.value = "";
}
// #endregion

// #region socket event handler

// サーバから受信した退室メッセージを受け取り画面上に表示する
const onReceiveExit = (data) => {
  chatList.unshift(`${data.name} さんが退室しました`)
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
    
    chatList.unshift(`${name} さん : ${content}`)
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
    <h1 class="text-h3 font-weight-medium">Vue.js Chat チャットルーム</h1>
    <div class="mt-10">
      <p>ログインユーザ：{{ userName }}さん</p>
      <textarea v-model="chatContent" variant="outlined" placeholder="投稿文を入力してください" rows="4" class="area"></textarea>
      <div class="mt-5">
        <button class="button-normal mr-2" :class="{ 'action': subject === '数学' }" @click="onChangeSubject('数学')">数学</button>
        <button class="button-normal" :class="{ 'action': subject === '国語' }" @click="onChangeSubject('国語')">国語</button>
      </div>
      <div class="mt-5">
        <button class="button-normal" @click="onPublish">投稿</button>
        <button class="button-normal util-ml-8px" @click="onMemo">メモ</button>
      </div>
      <div class="mt-5" v-if="chatList.length !== 0">
        <ul>
          <li class="item mt-4" v-for="(chat, i) in chatList" :key="i">{{ chat }}</li>
        </ul>
      </div>
    </div>
    <router-link to="/" class="link">
      <button type="button" class="button-normal button-exit" @click="onExit">退室する</button>
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