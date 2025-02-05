import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Notification as INotification } from '@/utils/notifications';

const NOTIFICATION_DURATION = 10_000;

export const useNotificationsStore = defineStore('notifications', () => {
    const notifications = ref<Array<INotification>>([]);

    return {
        notifications,
        fire: (n: INotification) => {
            notifications.value.push(n) - 1;
            setTimeout(() => notifications.value.splice(0, 1), NOTIFICATION_DURATION);
        },
    };
});
