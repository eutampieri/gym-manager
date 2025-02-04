import { ConfirmModal } from '@/components/ConfirmModal.vue';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalsStore = defineStore('nodals', () => {
    const modals = ref<[ConfirmModal, () => void][]>([]);

    return {
        modals,
        confirm: (text: string) => {
            const p = new Promise<boolean>((res, rej) => {
                modals.value.push([
                    { body: text, resolve: res },
                    () => { modals.value.splice(0, 1) }
                ]);
            });
            return p;
        },
    };
});
