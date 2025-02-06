import { ConfirmModal } from '@/components/ConfirmModal.vue';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalsStore = defineStore('modals', () => {
    const confirmModals = ref<[ConfirmModal, () => void][]>([]);

    return {
        confirmModals: confirmModals,
        confirm: (text: string) => {
            const p = new Promise<boolean>((res, rej) => {
                confirmModals.value.push([
                    { body: text, resolve: res },
                    () => { confirmModals.value.splice(0, 1) }
                ]);
            });
            return p;
        },
    };
});
