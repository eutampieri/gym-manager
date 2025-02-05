<script setup lang="ts">
defineProps<{ title: string }>(); // Riceve il titolo come prop
</script>

<template>
    <h1 class="text-center flex-grow-1">{{ title }}</h1>
</template>
