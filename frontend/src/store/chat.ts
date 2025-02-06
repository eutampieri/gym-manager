import { ConfirmModal } from '@/components/ConfirmModal.vue';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatStore = defineStore('chat', () => {
    let startChat: (() => void) | undefined = undefined;

    return {
        requestChat: () => { if (startChat !== undefined) { startChat() } },
        registerHandler: (h: () => void) => startChat = h,
    };
});
