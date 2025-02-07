<script setup lang="ts">
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRouter } from 'vue-router';
defineProps<{ buttonText?: string }>(); // Permette di personalizzare il testo

const router = useRouter();
const goBack = () => {
    router.back(); // Torna alla pagina precedente
};
</script>

<template>
    <button class="btn" @click="goBack" aria-label="Go back">
        <FontAwesomeIcon :icon="faChevronLeft"></FontAwesomeIcon>
    </button>
</template>
