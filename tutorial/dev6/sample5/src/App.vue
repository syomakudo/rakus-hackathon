<script setup>
import { ref, reactive } from "vue";

const title = "Rakus";
const message = ref("");
const list = reactive([]);

const addItem = () => {
    list.push(message.value);
    message.value = "";
};
</script>

<template>
    <div>
        <h1>{{ title }}</h1>
        <input type="text" v-model="message" />
        <p>Hello World!</p>

        <button type="button" @click="addItem">追加</button>
        <ul>
            <li v-for="(item, index) in list" :key="index">{{ item }}</li>
        </ul>
    </div>
</template>
