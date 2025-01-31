import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { Client } from '../utils/client';

export const useUserStore = defineStore('user', () => {
    const jwt = ref(null);
    const isAuthenticated = computed(() => jwt.value !== null);
    const client = new Client();

    return {
        jwt,
        isAuthenticated,
        client,
    };
});
