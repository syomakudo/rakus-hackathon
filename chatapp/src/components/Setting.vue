<script setup>
import { inject, ref, reactive, onMounted } from "vue";

// #region global state
const userName = inject("userName");
const isPublishedTime = inject("isPublishedTime");
const isReverseChat = inject("isReverseChat");
const isChangeFontsize = inject("isChangeFontsize");
const isCancelMessage = inject("isCancelMessage");
// #endregion

</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">Vue.js Chat チャットルーム</h1>
    <v-switch
              v-model="isChangeFontsize"
              label="orange"
              color="orange"
              value="orange"
              hide-details
            ></v-switch>
    <router-link to="/chat" class="link">
      <button type="button" class="button-normal button-exit">
        ×
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
