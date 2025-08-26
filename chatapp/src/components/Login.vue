<script setup>
import { inject, ref } from "vue";
import { useRouter } from "vue-router";

// #region global state
const teacherName = inject("teacherName");
// #endregion

// #region local variable
const router = useRouter();
// #endregion

// #region reactive variable
const inputUserName = ref("");
const errorMessage = ref("");
// #endregion

// #region browser event handler
// 入室メッセージをクライアントに送信する
const onEnter = () => {
  // ユーザー名が入力されているかチェック
  if (!inputUserName.value.trim()) {
    errorMessage.value = 'ユーザー名を入力してください'
    return;
  }
  errorMessage.value = ''

  teacherName.value = inputUserName.value;
  // 生徒一覧画面へ遷移
  router.push({ name: "student_list" });
};
// #endregion
</script>

<template>
  <div class="chat-container">
    <div class="content-wrapper">
<h1 class="main-title">塾 L<span :style="{ color: 'orange' }">!</span>nk</h1>
      <div class="input-group">
        <p class="label">ユーザー名</p>
        <input type="text" class="input-text" v-model="inputUserName" placeholder="名前を入力してください" />
        <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
      </div>
      <button type="button" @click="onEnter" class="enter-button">入室する</button>
    </div>
  </div>
</template>

<style scoped>
/* オレンジのカラースキームを定義 */
:root {
  --orange-primary: #FF7043; /* メインのオレンジ */
  --orange-dark: #E64A19;    /* 暗いオレンジ */
  --white: #fff;             /* 白 */
  --text-dark: #333;         /* 暗いテキスト */
  --shadow-light: rgba(0, 0, 0, 0.1);
  --shadow-dark: rgba(0, 0, 0, 0.25);
}

/* 全体的なスタイル設定 */
.chat-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* デバイスの表示領域に高さを合わせる */
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

.content-wrapper {
  width: 100%;
  max-width: 400px;
  background-color: var(--white);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px var(--shadow-dark);
  text-align: center;
}

/* タイトルとテキストのスタイル */
.main-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--orange-dark);
  margin-bottom: 30px;
  text-shadow: 1px 1px 2px var(--shadow-light);
}

.label {
  font-weight: 600;
  color: var(--text-dark);
  text-align: left;
  margin-bottom: 8px;
}

/* 入力フィールドのスタイル */
.input-group {
  margin-bottom: 25px;
}

.input-text {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  color: var(--text-dark);
}

.input-text::placeholder {
  color: #aaa;
}

.input-text:focus {
  outline: none;
  border-color: var(--orange-primary);
  box-shadow: 0 0 0 4px rgb(255, 226, 173);
}

/* ボタンのスタイル */
.enter-button {
  width: 100%;
  padding: 15px;
  background-color: var(--orange-primary);
  color: var(--white);
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 6px 15px var(--shadow-dark);
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border: 1.5px solid rgb(255, 182, 46);
}

.enter-button:hover, .enter-button:active {
  background-color: var(--orange-dark);
  transform: translateY(-2px);
  box-shadow: 5px solid black;
}

.error-message {
  color: #e74c3c;
  font-size: 17px;
  margin-top: 10px;
  margin-bottom: 5px;
}
</style>
