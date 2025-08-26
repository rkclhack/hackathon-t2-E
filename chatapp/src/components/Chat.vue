<script setup>
import { ref, reactive, onMounted, inject } from "vue"
import { useRoute } from "vue-router"
import socketManager from '../socketManager.js'

// login.vue で設定したログインユーザ名を inject で取得
const loginUser = inject("userName") || ref("名無し")

// student_list で選択した名前
const route = useRoute()
const userName = ref(route.query.name || "名無し")

// socket とチャット関連
const socket = socketManager.getInstance()
const chatContent = ref("")
const chatList = reactive([])

onMounted(() => {
  registerSocketEvent()
})

// 投稿
const onPublish = () => {
  if (!chatContent.value) return
  socket.emit("publishEvent", { name: loginUser.value, content: chatContent.value })
  chatContent.value = ""
}

// 退室
const onExit = () => {
  socket.emit("exitEvent", { name: loginUser.value })
}

// メモ
const onMemo = () => {
  if (!chatContent.value) return
  chatList.push(`${loginUser.value} さんのメモ: ${chatContent.value}`)
  chatContent.value = ""
}

// サーバから受信したイベント
const onReceiveEnter   = (data) => { chatList.push(`${data.name} さんが入室しました`) }
const onReceiveExit    = (data) => { chatList.push(`${data.name} さんが退室しました`) }
const onReceivePublish = (data) => { chatList.push(`${data.name} さん : ${data.content}`) }

const registerSocketEvent = () => {
  socket.on("enterEvent", onReceiveEnter)
  socket.on("exitEvent", onReceiveExit)
  socket.on("publishEvent", onReceivePublish)
}
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">{{ userName }} さんのチャット</h1>
    <div class="mt-2">
      <p>ログインユーザ：{{ loginUser }}さん</p>

      <!-- ▼ チャットログを上に配置 ▼ -->
      <div class="chat-container mt-3" v-if="chatList.length">
        <div class="scroll-region">
          <ul>
            <li class="item mt-2" v-for="(chat, i) in chatList" :key="i">{{ chat }}</li>
          </ul>
        </div>
      </div>

      <!-- ▼ 入力欄と操作ボタン ▼ -->
      <textarea v-model="chatContent" placeholder="投稿文を入力してください" rows="4" class="area"></textarea>
      <div class="mt-2">
        <button class="button-normal" @click="onPublish">投稿</button>
        <button class="button-normal util-ml-8px" @click="onMemo">メモ</button>
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
  max-height: 300px;  /* ログの高さを制限 */
  overflow-y: auto;   /* 縦スクロール有効 */
  padding: 0.5rem;
}
</style>