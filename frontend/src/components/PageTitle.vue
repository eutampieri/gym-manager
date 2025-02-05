<script setup lang="ts">
defineProps<{ title: string }>(); // Riceve il titolo come prop
</script>

<template>
    <h2 class="text-center flex-grow-1">{{ title }}</h2>
</template>
