import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { Trainer } from '../utils/trainer';

export const useTrainerStore = defineStore('trainer', () => {
    const jwt = ref(null);
    const isAuthenticated = computed(() => jwt.value !== null);
    const trainer = new Trainer();

    return {
        jwt,
        isAuthenticated,
        trainer,
    };
});