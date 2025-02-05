<script setup lang="ts">
import Header from '@/components/Header.vue';
import NotificationArea from '@/components/NotificationArea.vue';
import { useNotificationsStore } from './store/notifications';
import ModalArea from './components/ModalArea.vue';
import { useModalsStore } from './store/modals';

const notifications = useNotificationsStore().notifications;
const confirmModals = useModalsStore().confirmModals;
</script>

<template>
    <Header></Header>
    <div class="container-md bg-white p-3 rounded" id="app">
        <RouterView />
    </div>
    <NotificationArea :notifications="notifications"></NotificationArea>
    <ModalArea :confirms="confirmModals"></ModalArea>
</template>
