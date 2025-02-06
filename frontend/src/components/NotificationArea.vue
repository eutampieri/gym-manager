<script setup lang="ts">
import Notification from '@/components/Notification.vue';
import { Notification as INotification } from '@/utils/notifications';

defineProps<{ notifications: Array<INotification> }>();

</script>
<template>
    <div class="toast-container position-absolute bottom-0 end-0 p-3">
        <Notification v-for="n in notifications" :body="n.body" :title="n.title" :background="n.background"
            :when="n.when" :actions="n.actions">
        </Notification>
    </div>
</template>