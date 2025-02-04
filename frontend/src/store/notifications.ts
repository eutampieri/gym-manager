import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Notification as INotification } from '@/utils/notifications';

export const useNotificationsStore = defineStore('notifications', () => {
    const notifications = ref<Array<INotification>>([]);

    return {
        notifications,
        fire: (n: INotification) => notifications.value.push(n),
    };
});
