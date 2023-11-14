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
  <v-app class="background">
  <div class="mx-auto">
    <div class="figure"></div>
    <div class="posi">
      <div class="title">Family Chat</div>
      <div class="mt-10">
        <p class="nametext">お名前</p>
        <input type="text" class="user-name-text" placeholder="お名前を入力してください" v-model="inputUserName" />
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
    <v-dialog
      v-model="dialog"
    >
      <div class="Dialog">
        <div class="dialogtext">
            お名前を入力してください。
        </div>
          <v-btn rounded flat height="48" width="242" 
            class="buttonDialog"
            @click="dialog = false">閉じる</v-btn>
      </div>
    </v-dialog>
  </div>
  </v-app>
</template>

<style scoped>
@import url(http://fonts.googleapis.com/earlyaccess/notosansjp.css);
.background {
  background-color: #FFFFF5;
  width: 100vw;
  height: 100vh;
}
@media (min-width: 600px) {
  .figure {
    width: 600px;
    height: 600px;
    flex-shrink: 0;
    border-radius: 600px;
    background: rgba(255, 130, 0, 0.09);
    margin-top: 38px;
    position: relative;
  }
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
  color: #FF8200;
  text-align: center;
  font-family: 'Noto Sans JP';
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
  font-family: 'Noto Sans JP';
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
  background: #FFFFF5;
  width: 242px;
  height: 48px;
  padding: 8px 9px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  font-family: 'Noto Sans JP';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 157.143% */
  letter-spacing: -0.408px;
  margin-bottom: 62px;
}

.buttonLogin {
  color: #FFF;
  text-align: center;
  font-family: 'Noto Sans JP';
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
}

/*ダイアログの箱の設定と内部の共通の設定*/
.Dialog {
  height: 240px;
  width: 324px;
  border-radius: 20px;
  background: #FFF;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.25);
  font-family: 'Noto Sans JP';
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
  border: 1px solid #FF8200;
  color: #FF8200;
  padding: 3px 16px 2px 17px;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  line-height: 22px; /* 157.143% */
  letter-spacing: -0.408px;
}
</style>
