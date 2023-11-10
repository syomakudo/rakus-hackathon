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
    text: chatContent.value,
    timestamp: publishedTime,
  };
  socket.emit("publishEvent", message);

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
  const memoMessage = {
    id: messageId++, // メッセージIDを追跡するための変数をインクリメント
    userName: userName.value, // ここでユーザー名を追加
    text: `${userName.value}さんのメモ：${chatContent.value}`, // メモの内容
  };
  // メモの内容を表示
  chatList.unshift(memoMessage); // chatListの先頭に追加
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
  <v-app>
    <v-app-bar color="#FF8200" flat>
      
      <template v-slot:prepend>
        <router-link to="/" class="link">
          <v-btn @click="onExit">
            <v-icon size="32" color="white">mdi-chevron-left</v-icon>
          </v-btn>
        </router-link>
      </template>

      <v-app-bar-title class="appbar">
        Chatルーム
      </v-app-bar-title>

      <template v-slot:append>
        <v-btn>
          <v-icon size="32">mdi-cog-outline</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <div class="background">
      <div class="mt-5">
        <div class="mt-5" v-if="chatList.length !== 0">
          <ul>
            <li class="item mt-4" v-for="(chat, i) in chatList" :key="chat.id">
              <div v-if="chat.userName==userName" class="mycards">
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
      <button class="button-normal" @click="reverseChat">順番を変える</button>
      <button class="button-normal" @click="changeFontsize">文字サイズ</button>
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
        <v-btn block class="buttons" size="70%" color="#FFD600" flat @click="onMemo">
          メモ
        </v-btn>
      </v-col>
      <v-col cols="2" class="buttonLayout">
        <v-btn block class="buttons" size="70%" color="#FFD600" flat @click="onPublish">
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

.appbar {
  color: #FFFFFF;
  text-align:center;
  font-size: 22px;
  font-weight: bold;
}

.message {
  background-color: #FF8200;
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
  color: #9E9E9E;
}

.background {
  background-color: #FFFFF5;
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
