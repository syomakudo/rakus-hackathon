<script setup>
import { provide, ref } from "vue"

// #region reactive state
const userName = ref("")
const isPublishedTime = ref(false);
const isReverseChat = ref(false);
const isChangeFontsize = ref(false);
const isCancelMessage = ref(false);
// #endregion

// #region global variable
provide("userName", userName)
provide("isPublishedTime", isPublishedTime)
provide("isReverseChat", isReverseChat)
provide("isChangeFontsize", isChangeFontsize)
provide("isCancelMessage", isCancelMessage)
// #endregion
</script>

<template>
  <router-view />
</template>

<style scoped>
</style>
