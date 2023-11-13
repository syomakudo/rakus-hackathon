<script setup>
import { provide, ref } from "vue";

// #region reactive state
const userName = ref("");
const isPublishedTime = ref(false);
const isReverseChat = ref(false);
const isChangeFontsize = ref(false);
const isCancelMessage = ref(false);
const isAddMemo = ref(false);
const dialog = ref(false);
// #endregion

// #region global variable
provide("userName", userName);
provide("isPublishedTime", isPublishedTime);
provide("isReverseChat", isReverseChat);
provide("isChangeFontsize", isChangeFontsize);
provide("isCancelMessage", isCancelMessage);
provide("isAddMemo", isAddMemo);
provide("dialog", dialog);
// #endregion
</script>

<template>
  <router-view />
</template>

<style scoped></style>
