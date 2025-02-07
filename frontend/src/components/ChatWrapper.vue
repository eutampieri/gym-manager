<script setup lang="ts">
import { io } from 'socket.io-client';
import Chat from './Chat.vue';
import { BasicIdentifiable, BasicInfo, EventType, parseRole, Role } from '@gym-manager/models';
import { useUserStore } from '@/store/user';
import { onMounted, Ref, ref } from 'vue';
import { useNotificationsStore } from '@/store/notifications';
import { useChatStore } from '@/store/chat';
import { Message } from '@/utils/chat';

const notifications = useNotificationsStore();
const client = useUserStore().client;
const socket = io({
    path: "/api/socketio",
});

const DUMMY_OTHER_PARTY: [BasicIdentifiable, Role] = [{
    username: "admin",
    firstName: "Gym",
    lastName: "Support",
    id: "1"

}, Role.Admin];

const active = ref(false);
const minimised = ref(false);
const messages = ref<Message[]>([]);
const otherParty: Ref<[BasicIdentifiable, Role]> = ref(DUMMY_OTHER_PARTY);

const myId = client.userDetails!.id;

onMounted(() => {
    socket.emit(EventType.Authenticate.toString(), client.authToken!);
    useChatStore().registerHandler(() => {
        socket.emit(EventType.ChatRequest.toString());
        notifications.fire({
            body: "A support chat has been requested. When an admin accepts your request, a chat will be shown.",
            background: "info",
            when: new Date(),
        })
    });
});

socket.on(
    EventType.Error.toString(),
    (m) => notifications.fire({ body: m, title: "Chat error", background: "danger" })
);

if (client.getRole === Role.Admin) {
    socket.on(EventType.ChatRequest.toString(), (req) => notifications.fire({
        title: "Incoming chat request",
        body: `${req.user.firstName} ${req.user.lastName} (${req.kind}) would like to start a chat.`,
        background: "info",
        when: new Date(),
        actions: [{
            action: () => {
                socket.emit(EventType.AcceptChatRequest.toString(), req.room);
                otherParty.value[0] = req.user;
                otherParty.value[1] = parseRole(req.kind)!;
            },
            label: 'Start chat',
            colour: 'primary',
        }],
    }));
}

socket.on(
    EventType.ChatEstablished.toString(),
    () => {
        active.value = true;
        messages.value = [];
    }
);

socket.on(
    EventType.MessageDelivery.toString(),
    ({ message, sender }) => {
        const sentByCurrentUser = sender === myId;
        messages.value.push({ message: message, sentByCurrentUser });
        if (minimised.value && !sentByCurrentUser) {
            notifications.fire({
                title: "New message",
                body: message,
                background: "info",
                when: new Date(),
                actions: [{
                    action: () => minimised.value = false,
                    label: 'Open chat',
                    colour: 'primary',
                }],
            })
        }
    }
);

socket.on(
    EventType.CloseChat.toString(),
    (sender) => {
        const sentByCurrentUser = sender === myId;
        notifications.fire({
            title: "New message",
            body: (sentByCurrentUser ? "You" : `${otherParty.value[0].firstName} ${otherParty.value[0].lastName}`)
                + " closed the chat",
            background: "info",
            when: new Date(),
        })
        socket.emit(EventType.LeaveRoom.toString());
        active.value = false;
        minimised.value = false;
        otherParty.value = DUMMY_OTHER_PARTY;
    }
);

function send(msg: string) {
    socket.emit(EventType.Message.toString(), { message: msg });
}

function close() {
    socket.emit(EventType.CloseChat.toString());
}


</script>
<template>
    <Chat v-model="minimised" :is-active="active" :messages="messages" :other-party="otherParty" @send="send"
        @close="close"></Chat>
</template>