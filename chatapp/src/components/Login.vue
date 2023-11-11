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

// #region reactive variable
const inputUserName = ref("");
// #endregion

const dialog = ref(false);
// #region browser event handler
// 入室メッセージをクライアントに送信する
const onEnter = () => {
  // ユーザー名が入力されているかチェック
  if (inputUserName.value == "") {
    dialog.value = true;
    return;
  }

  // 入室メッセージを送信
  const dateobj = new Date();
  const enterTime =
    dateobj.getFullYear() +
    "/" +
    (dateobj.getMonth() + 1) +
    "/" +
    dateobj.getDate() +
    " " +
    dateobj.getHours() +
    ":" +
    dateobj.getMinutes() +
    ":" +
    dateobj.getSeconds();

  const enterMessage = {
    userName: inputUserName.value,
    text: `${inputUserName.value}さんが入室しました。`,
    timestamp: enterTime,
  };

  socket.emit("enterEvent", enterMessage);

  // 全体で使用するnameに入力されたユーザー名を格納
  userName.value = inputUserName.value;

  // チャット画面へ遷移
  router.push({ name: "chat" });
};
// #endregion
</script>

<template>
  <v-app class="background">
    <div class="mx-auto my-5 px-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="figure"
        viewBox="0 0 459 575"
        fill="none"
      >
        <path
          d="M443.1 282.986C488.1 428.5 443.1 574.5 229.1 574.5C-0.399704 574.5 -22.8997 441.5 14.6003 282.986C-26.8997 118 53.6003 0 229.1 0C418.6 4.76837e-06 480.6 136.5 443.1 282.986Z"
          fill="#FF8200"
          fill-opacity="0.09"
        />
      </svg>
      <div class="posi">
        <h1 class="title">Family Chat</h1>
        <div class="mt-10">
          <p class="nametext">お名前</p>
          <input
            type="text"
            class="user-name-text"
            placeholder="お名前を入力してください"
            v-model="inputUserName"
          />
        </div>
        <v-btn
          rounded
          flat
          height="48"
          width="242"
          color="#FF8200"
          class="buttonLogin"
          @click="onEnter"
        >
          入室する
        </v-btn>
      </div>
      <v-dialog v-model="dialog">
        <div class="Dialog">
          <div class="dialogtext">お名前を入力してください。</div>
          <v-btn
            rounded
            flat
            height="48"
            width="242"
            color="#FF8200"
            class="buttonLogin"
            @click="onEnter"
          >
            入室する
          </v-btn>
        </div>
      </v-dialog>
    </div>
  </v-app>
</template>

<style scoped>
@import url(http://fonts.googleapis.com/earlyaccess/notosansjp.css);
.background {
  background-color: #fffff5;
  width: 100vw;
  height: 100vh;
}
.figure {
  width: 459px;
  height: 575px;
  position: relative;
}
/*ディスプレイに合わせてcss（背景図形）を変化*/
@media (max-width: 600px) {
  .figure {
    width: 100vw;
    height: 600px;
    flex-shrink: 0;
    background-color: rgba(255, 130, 0, 0.09);
    margin-top: 38px;
    position: relative;
    clip-path: circle(300px);
  }
}

.posi {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
}
.title {
  color: #ff8200;
  text-align: center;
  font-family: "Noto Sans JP";
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 22px; /* 61.111% */
  letter-spacing: -0.408px;
  display: inline-flex;
  padding: 17px 2px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-left: 14px;
}

.nametext {
  color: #000;
  font-family: "Noto Sans JP";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 157.143% */
  letter-spacing: -0.408px;
  margin-top: 143px;
  margin-bottom: 6px;
}
.user-name-text {
  border-radius: 10px;
  border: 1px solid #000;
  background: #fffff5;
  width: 242px;
  height: 48px;
  padding: 8px 9px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  font-family: "Noto Sans JP";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 157.143% */
  letter-spacing: -0.408px;
  margin-bottom: 62px;
}

.buttonLogin {
  color: #fff;
  text-align: center;
  font-family: "Noto Sans JP";
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
}

/*ダイアログの箱の設定と内部の共通の設定*/
.Dialog {
  height: 240px;
  width: 324px;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.25);
  font-family: "Noto Sans JP";
  font-style: normal;
  font-size: 14px;
  text-align: center;
  margin: 0 auto;
}
/*ダイアログ内のテキストの設定 */
.dialogtext {
  color: #000;
  font-weight: 400;
  line-height: 22px; /* 157.143% */
  letter-spacing: -0.408px;
  margin-top: 65px;
  margin-bottom: 71px;
}
/*ダイアログ内のボタンの設定 */
.buttonDialog {
  border: 1px solid #ff8200;
  color: #ff8200;
  padding: 3px 16px 2px 17px;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  line-height: 22px; /* 157.143% */
  letter-spacing: -0.408px;
}
</style>
