<script setup lang="ts">
import { io } from 'socket.io-client';
import Chat from './Chat.vue';
import { EventType } from '@gym-manager/models';
import { useUserStore } from '@/store/user';
import { onMounted } from 'vue';
import { useNotificationsStore } from '@/store/notifications';

const notifications = useNotificationsStore();
const socket = io({
    path: "/api/socketio",
});

onMounted(() => {
    console.log("authenticationEvent")
    socket.emit(EventType.Authenticate.toString(), useUserStore().client.authToken!);
});

socket.on(
    EventType.Error.toString(),
    (m) => notifications.fire({ body: m, title: "Chat error", background: "danger" })
);
</script>
<template>

</template>