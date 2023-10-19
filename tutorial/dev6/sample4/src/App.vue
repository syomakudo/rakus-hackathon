<script setup>
const handleClick = () => {
    alert("ボタンがクリックされました");
};
const handleMouseOver = () => {
    alert("ボタンがマウスオーバーされました");
};
</script>

<template>
    <div>
        <h1>Sample4</h1>
        <button @click="handleClick">Click</button>
        <button @mouseover="handleMouseOver">MouseOver</button>
    </div>
</template>
