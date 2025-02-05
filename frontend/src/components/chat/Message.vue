<script setup lang="ts">
import { Message } from '@/utils/chat';

defineProps<Message>();
</script>
<template>
    <p :class="'rounded p-2 text-bg-' + (sentByCurrentUser ? 'primary ms-auto' : 'tertiary')">{{ message }}</p>
</template>
<style lang="css" scoped>
.text-bg-tertiary {
    background-color: var(--bs-gray-400);
}

p {
    max-width: min(calc(100% - 4em), 500px);
    min-width: 200px;
}
</style>