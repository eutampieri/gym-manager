<script setup lang="ts">
import Header from '@/components/Header.vue';
import NotificationArea from '@/components/NotificationArea.vue';
import { useNotificationsStore } from './store/notifications';
import ModalArea from './components/ModalArea.vue';
import { useModalsStore } from './store/modals';

const notifications = useNotificationsStore().notifications;
const modals = useModalsStore().modals;
</script>

<template>
    <Header></Header>
    <RouterView />
    <NotificationArea :notifications="notifications"></NotificationArea>
    <ModalArea :confirms="modals"></ModalArea>
</template>
