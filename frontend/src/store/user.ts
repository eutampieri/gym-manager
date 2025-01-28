import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
    const jwt = ref(null);
    const isAuthenticated = computed(() => jwt.value !== null);

    return {
        jwt,
        isAuthenticated,
    };
});
