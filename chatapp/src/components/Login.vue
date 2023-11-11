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
  <v-app>
  <div class="background mx-auto my-5 px-4">
    <h1 class="title">Family Chat</h1>
    <div class="mt-10">
      <p class="nametext">お名前</p>
      <input type="text" class="user-name-text" placeholder="お名前を入力してください" v-model="inputUserName" />
    </div>
    <v-btn
      rounded 
      height="48" 
      width="242" 
      color="#FF8200" 
      class="buttonLogin" 
      @click="onEnter"
     >
      入室する
    </v-btn>
  </div>
  </v-app>
</template>

<style scoped>
.background {
  background-color: #FFFFF5;
  width: 100%;
  height: 100%;
}
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
  width: 242px;
  height: 48px;
  padding: 8px 9px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 157.143% */
  letter-spacing: -0.408px;
}

.buttonLogin {
  color: #FFF;
  text-align: center;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
}
</style>
