<script setup>
import { inject, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import socketManager from "../socketManager.js";

// #region global state
const userName = inject("userName");
// #endregion

// #region local variable
const router = useRouter();
const socket = socketManager.getInstance();
// #endregion

const message = reactive({
  entryMessage: "",
});

// #region reactive variable
const inputUserName = ref("");
// #endregion

// #region browser event handler
// 入室メッセージをクライアントに送信する
const onEnter = () => {
  // ユーザー名が入力されているかチェック
  if (inputUserName.value == "") {
    alert("ユーザー名を入力してください。");
    return;
  }

  // 入室メッセージを送信
  message.entryMessage = inputUserName.value + "さんが入室しました。";
  socket.emit("enterEvent", message.entryMessage);

  // 全体で使用するnameに入力されたユーザー名を格納
  userName.value = inputUserName.value;

  // チャット画面へ遷移
  router.push({ name: "chat" });
};
// #endregion
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="title">Family Chat</h1>
    <div class="mt-10">
      <p class="nametext">お名前</p>
      <input type="text" class="user-name-text" placeholder="お名前を入力してください" v-model="inputUserName" />
    </div>
    <button type="button" @click="onEnter" class="button-normal">
      入室する
    </button>
    <svg xmlns="http://www.w3.org/2000/svg" width="459" height="575" viewBox="0 0 459 575" fill="none">
    <path d="M443.1 282.986C488.1 428.5 443.1 574.5 229.1 574.5C-0.399704 574.5 -22.8997 441.5 14.6003 282.986C-26.8997 118 53.6003 0 229.1 0C418.6 4.76837e-06 480.6 136.5 443.1 282.986Z" fill="#FF8200" fill-opacity="0.09"/>
    </svg>
  </div>
</template>

<style scoped>
.title {
  color: #FF8200;
  text-align: center;
  font-family: Inter;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 22px; /* 61.111% */
  letter-spacing: -0.408px;
}

.nametext {
  color: #000;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 157.143% */
  letter-spacing: -0.408px;
}
.user-name-text {
  border-radius: 10px;
  border: 1px solid #000;
  background: #FFFFF5;
}
</style>
