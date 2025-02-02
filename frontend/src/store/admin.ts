import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { Admin } from '../utils/admin';

export const useAdminStore = defineStore('admin', () => {
    const jwt = ref(null);
    const isAuthenticated = computed(() => jwt.value !== null);
    const admin = new Admin();

    return {
        jwt,
        isAuthenticated,
        admin,
    };
});