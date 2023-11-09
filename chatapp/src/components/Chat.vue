<script setup>
import { inject, ref, reactive, onMounted } from "vue";
import socketManager from "../socketManager.js";

// #region global state
const userName = inject("userName");
// #endregion

// #region local variable
const socket = socketManager.getInstance();
// #endregion

// #region reactive variable
const chatContent = ref("");
const chatList = reactive([]);
let messageId = 0; // メッセージIDを追跡するための変数
// #endregion

// #region lifecycle
onMounted(() => {
  registerSocketEvent();
  console.log("onMounted");
});
// #endregion

// #region browser event handler
// 投稿メッセージをサーバに送信する
const onPublish = () => {
  if (chatContent !== "") {
  //3.投稿時刻を取得(YY/MM/DD hour:minute:second)
    const dateobj = new Date();
    const publishedTime =
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
    console.log(publishedTime);

    const message = {
      id: messageId++,
      userName: userName.value,
      text: `${userName.value}さん：${chatContent.value}`,
      timestamp: publishedTime,
    };
    socket.emit("publishEvent", message);
  }

  if (chatContent.value == "") {
    alert("投稿文を入力してください");
  }
  // 入力欄を初期化
  chatContent.value = "";
  console.log(chatList);
};

// 退室メッセージをサーバに送信する
const onExit = () => {
  socket.emit("exitEvent", `${userName.value}さんが退出しました。`);
};

// メモを画面上に表示する
const onMemo = () => {
  if (chatContent.value == ""); {
    alert("メモ文を入力してください");
  }

  if (chatContent.value !== "") {
    const memoMessage = {
      id: messageId++, // メッセージIDを追跡するための変数をインクリメント
      userName: userName.value, // ここでユーザー名を追加
      text: `${userName.value}さんのメモ：${chatContent.value}`, // メモの内容
    };
    // メモの内容を表示
    chatList.unshift(memoMessage); // chatListの先頭に追加
  }

  if (chatContent.value == ""); {
    alert("メモ文を入力してください");
  }

  if (chatContent.value !== "") {
    chatList.unshift(`${userName.value}さんのメモ：${chatContent.value}`)
  }

  // 入力欄を初期化
  chatContent.value = "";
};
// #endregion

// #region socket event handler
// サーバから受信した入室メッセージ画面上に表示する
const onReceiveEnter = (data) => {
  chatList.unshift(data);
};

// サーバから受信した退室メッセージを受け取り画面上に表示する
const onReceiveExit = (data) => {
  chatList.unshift(data);
};

// サーバから受信した投稿メッセージを画面上に表示する
const onReceivePublish = (data) => {
  chatList.unshift(data);
};

// メッセージ取り消し機能
const onCancelMessage = (messageId) => {
  // メッセージの投稿者が現在のユーザーかどうかを確認
  const message = chatList.find((message) => message.id === messageId);
  if (message && message.userName === userName.value) {
    socket.emit("cancelMessageEvent", messageId);
  } else {
    console.log("You can only delete your own messages.");
  }
};

// サーバから受信したメッセージ取り消しイベントを処理
const onReceiveCancelMessage = (messageId) => {
  const messageIndex = chatList.findIndex(
    (message) => message.id === messageId
  );
  if (messageIndex !== -1) {
    chatList.splice(messageIndex, 1);
  }
};
// #endregion

// #region local methods
// イベント登録をまとめる
const registerSocketEvent = () => {
  // 入室イベントを受け取ったら実行
  console.log("registerSocketEvent");
  socket.on("enterEvent", (data) => {
    onReceiveEnter(data);
  });

  // 退室イベントを受け取ったら実行
  socket.on("exitEvent", (data) => {
    onReceiveExit(data);
  });

  // 投稿イベントを受け取ったら実行
  socket.on("publishEvent", (data) => {
    onReceivePublish(data);
  });

  // メッセージ取り消しイベントを受け取ったら実行
  socket.on("cancelMessageEvent", (messageId) => {
    onReceiveCancelMessage(messageId);
  });
};
// #endregion

//8.チャット逆順
const reverseChat = () => {
  chatList.reverse();
};

//.文字サイズ変更
const changeFontsize = () => {
  const classNameUl = document.querySelector("ul");
  classNameUl.classList.toggle("itemLarge");
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
        <button class="button-normal" @click="onPublish">投稿</button>
        <button class="button-normal util-ml-8px" @click="onMemo">メモ</button>
      </div>
      <div class="mt-5" v-if="chatList.length !== 0">
        <ul>
          <li class="item mt-4" v-for="(chat, i) in chatList" :key="chat.id">
            {{ chat.text }}
            <button
              v-if="chat.userName === userName"
              @click="onCancelMessage(chat.id)"
            >
              取り消し
            </button>
          </li>
        </ul>
      </div>
      <button class="button-normal" @click="reverseChat">順番を変える</button>
      <button class="button-normal" @click="changeFontsize">文字サイズ</button>
    </div>
    <router-link to="/" class="link">
      <button type="button" class="button-normal button-exit" @click="onExit">
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

.itemLarge {
  font-size: 25px;
}

.util-ml-8px {
  margin-left: 8px;
}

.button-exit {
  color: #000;
  margin-top: 8px;
}
</style>
