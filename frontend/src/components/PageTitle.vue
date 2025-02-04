<script setup lang="ts">
defineProps<{ title: string }>(); // Riceve il titolo come prop
</script>

<style scoped>
.title {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    color: black;
}
</style>
<template>
    <h1 class="title flex-grow-1">{{ title }}</h1>
</template>
