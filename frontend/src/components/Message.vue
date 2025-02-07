<script setup lang="ts">
import { Message } from '@/utils/chat';

defineProps<Message>();
</script>
<template>
    <p :class="'rounded p-2 text-bg-' + (sentByCurrentUser ? 'primary ms-auto' : 'tertiary')">{{ message }}</p>
</template>
<style lang="css" scoped>
.text-bg-tertiary {
    background-color: var(--bs-tertiary-bg);
}

p {
    max-width: min(calc(100% - 4em), 500px); /* Mantiene una larghezza massima */
    min-width: 200px;
    white-space: normal; /* Permette al testo di andare a capo senza spezzare parole */
    overflow-wrap: normal; /* Evita di spezzare parole */
    word-break: normal; /* Mantiene intere le parole lunghe */
}

</style>