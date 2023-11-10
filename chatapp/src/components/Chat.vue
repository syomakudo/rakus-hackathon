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

// #region function
//3.投稿時刻を取得(YY/MM/DD hour:minute:second)
function getCurrentTimestamp() {
  const dateobj = new Date();
  return (
    dateobj.getFullYear() +
    "/" +
    (dateobj.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    dateobj.getDate().toString().padStart(2, "0") +
    " " +
    dateobj.getHours().toString().padStart(2, "0") +
    ":" +
    dateobj.getMinutes().toString().padStart(2, "0") +
    ":" +
    dateobj.getSeconds().toString().padStart(2, "0")
  );
}
// #endregion

// #region browser event handler
// 投稿メッセージをサーバに送信する
const onPublish = () => {
  const message = {
    id: messageId++,
    userName: userName.value,
    text: chatContent.value,
    timestamp: getCurrentTimestamp(),
  };
  socket.emit("publishEvent", message);

  if (chatContent.value.replace(/\s+/g, "") == "") {
    alert("投稿文を入力してください");
  }
  // 入力欄を初期化
  chatContent.value = "";
};

// 退室メッセージをサーバに送信する
const onExit = () => {
  const exitMessage = {
    userName: userName.value,
    text: `${userName.value}さんが退出しました。`,
    timestamp: getCurrentTimestamp(),
  };
  socket.emit("exitEvent", exitMessage);
};

// メモを画面上に表示する
const onMemo = () => {
  if (chatContent.value.replace(/\s+/g, "") !== "") {
    const memoMessage = {
      id: messageId++, // メッセージIDを追跡するための変数をインクリメント
      userName: userName.value, // ここでユーザー名を追加
      text: `${userName.value}さんのメモ：${chatContent.value}`, // メモの内容
    };
    // メモの内容を表示
    chatList.unshift(memoMessage); // chatListの先頭に追加
  }

  if (chatContent.value.replace(/\s+/g, "") == "");
  {
    alert("メモ文を入力してください");
  }

  if (chatContent.value.replace(/\s+/g, "") !== "") {
    chatList.unshift(`${userName.value}さんのメモ：${chatContent.value}`);
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
  const classNameUl = document.querySelector("ul"); //タイムスタンプ
  const classNameText = document.querySelectorAll(".v-card-text"); //投稿内容
  classNameUl.classList.toggle("itemLarge"); //itemLargeクラスを付与
  classNameText.forEach((item) => {
    item.classList.toggle("itemLarge");
  });
};
</script>

<template>
  <v-app>
    <v-app-bar color="#FF8200" flat>
      <template v-slot:prepend>
        <router-link to="/" class="link">
          <v-btn @click="onExit">
            <v-icon size="32" color="white">mdi-chevron-left</v-icon>
          </v-btn>
        </router-link>
      </template>

      <v-app-bar-title class="appbar"> Chatルーム </v-app-bar-title>

      <template v-slot:append>
        <v-btn>
          <v-icon size="32">mdi-cog-outline</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <div class="background">
      <div>
        <div class="mt-5" v-if="chatList.length !== 0">
          <ul>
            <li class="item mt-4" v-for="(chat, i) in chatList" :key="chat.id">
              <div v-if="chat.userName == userName" class="mycards">
                <v-card color="#F8CC9E" variant="flat">
                  <v-card-text>{{ chat.text }}</v-card-text>
                </v-card>
                <div class="timestamp" id="mytimestamp">
                  {{ chat.timestamp }}
                </div>
              </div>
              <div v-else class="othercards">
                {{ chat.userName }}
                <v-card color="#EAEAE6" variant="flat">
                  <v-card-text>{{ chat.text }}</v-card-text>
                </v-card>
                <div class="timestamp">
                  {{ chat.timestamp }}
                </div>
              </div>
            </li>
          </ul>
        </div>
        <button class="button-normal" @click="changeFontsize">
          文字サイズ
        </button>
      </div>
    </div>

    <v-container fluid class="message">
      <v-row>
        <v-col cols="8">
          <v-text-field
            v-model="chatContent"
            clearable
            placeholder="メッセージを入力"
            persistant-clear
            variant="solo"
            flat
          >
          </v-text-field>
        </v-col>
        <v-col cols="2" class="buttonLayout">
          <v-btn
            block
            class="buttons"
            size="70%"
            color="#FFD600"
            flat
            @click="onMemo"
          >
            メモ
          </v-btn>
        </v-col>
        <v-col cols="2" class="buttonLayout">
          <v-btn
            block
            class="buttons"
            size="70%"
            color="#FFD600"
            flat
            @click="onPublish"
          >
            送信
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style scoped>
.link {
  text-decoration: none;
}

.item {
  display: block;
}

.itemLarge {
  font-size: 20px;
}

.util-ml-8px {
  margin-left: 8px;
}

.appbar {
  color: #ffffff;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
}

.message {
  background-color: #ff8200;
  position: fixed;
  bottom: 0em;
  left: 0em;
}

.mycards {
  width: 70%;
  margin: 0 1em 0 auto;
}

.othercards {
  width: 70%;
  margin: 0 0 0 1em;
}

.timestamp {
  color: #9e9e9e;
}

.background {
  margin-top: 5em;
  margin-bottom: 8em;
  background-color: #fffff5 !important;
  width: 100%;
  height: 100%;
}

.buttons {
  color: #363636;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.buttonLayout {
  padding-left: 0em;
}

#mytimestamp {
  text-align: right;
}
</style>
