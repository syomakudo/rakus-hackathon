<script setup>
import { inject, ref, reactive, onMounted } from "vue";

// #region global state
const isReverseChat = inject("isReverseChat");
const isChangeFontsize = inject("isChangeFontsize");
const isCancelMessage = inject("isCancelMessage");
const isAddMemo = inject("isAddMemo");
const dialog = inject("dialog");
// #endregion

const onClose = () => {
  dialog.value = false;
};
</script>

<template>
  <div class="background_setting">
    <v-row>
      <v-col cols="7" offset="1" class="align-self-center label">
        <div>チャットの並びを反転</div>
      </v-col>
      <v-col cols="3" offset="1" class="align-self-center">
        <v-switch
          v-model="isReverseChat"
          color="orange"
          hide-details
        ></v-switch>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="7" offset="1" class="align-self-center label">
        <div>送信取り消し機能オン</div>
      </v-col>
      <v-col cols="3" offset="1" class="align-self-center">
        <v-switch
          v-model="isCancelMessage"
          color="orange"
          hide-details
        ></v-switch>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="7" offset="1" class="align-self-center label">
        <div>文字を大きくする</div>
      </v-col>
      <v-col cols="3" offset="1" class="align-self-center">
        <v-switch
          v-model="isChangeFontsize"
          color="orange"
          hide-details
        ></v-switch>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="7" offset="1" class="align-self-center label">
        <div>メモ機能を追加</div>
      </v-col>
      <v-col cols="3" offset="1" class="align-self-center">
        <v-switch v-model="isAddMemo" color="orange" hide-details></v-switch>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-btn
          rounded
          flat
          height="48"
          width="242"
          color="#FF8200"
          class="buttonLogin"
          @click="onClose"
        >
          閉じる
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.background_setting {
  background-color: #fffff5 !important;
  width: 100%;
  height: 100%;
}

.label {
  font-size: 16px;
}

.buttonLogin {
  color: #fff;
  text-align: center;
  font-family: "Noto Sans JP";
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  margin-top: 100px;
}
</style>
