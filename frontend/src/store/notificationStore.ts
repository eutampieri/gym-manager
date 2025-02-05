import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface INotification {
    id: number;
    title: string;
    body: string;
    background: string;
    when: Date;
}

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref<Array<INotification>>([]);

    const addNotification = (title: string, body: string, background: string = 'info') => {
        notifications.value.push({
            id: Date.now(), // Un ID univoco
            title,
            body,
            background,
            when: new Date(),
        });

        // Rimuove automaticamente la notifica dopo 5 secondi
        setTimeout(() => {
            notifications.value.shift();
        }, 5000);
    };

    return {
        notifications,
        addNotification,
    };
});
