<script setup lang="ts">
import { useRouter } from 'vue-router';
defineProps<{ buttonText?: string }>(); // Permette di personalizzare il testo

const router = useRouter();
const goBack = () => {
    router.back(); // Torna alla pagina precedente
};
</script>

<style scoped>
.back-button {
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 5px;
}
</style>
<template>
    <button class="btn btn-outline-primary back-button" @click="goBack">
        <i class="bi bi-arrow-left"></i> {{ buttonText }}
    </button>
</template>

