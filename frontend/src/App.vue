<script setup lang="ts">
import Header from '@/components/Header.vue';
import NotificationArea from '@/components/NotificationArea.vue';
import { useNotificationsStore } from './store/notifications';
import ModalArea from './components/ModalArea.vue';
import { useModalsStore } from './store/modals';
import { io } from 'socket.io-client';
import ChatWrapper from './components/ChatWrapper.vue';
import { useUserStore } from './store/user';
import { computed } from 'vue';

const notifications = useNotificationsStore().notifications;
const confirmModals = useModalsStore().confirmModals;
const isLoggedIn = computed(() => useUserStore().client.isLoggedIn);
</script>

<template>
    <Header></Header>
    <div class="container-md bg-body p-3 rounded" id="app">
        <RouterView />
    </div>
    <NotificationArea :notifications="notifications"></NotificationArea>
    <ModalArea :confirms="confirmModals"></ModalArea>
    <ChatWrapper v-if="isLoggedIn"></ChatWrapper>
</template>
