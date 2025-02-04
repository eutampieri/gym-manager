<script setup lang="ts">
import Header from '@/components/Header.vue';
import NotificationArea from '@/components/NotificationArea.vue';
import { useNotificationsStore } from './store/notifications';
import UserPage from './pages/UserPage.vue';

const notifications = useNotificationsStore().notifications;
</script>

<template>
    <Header></Header>
    <RouterView />
    <UserPage/>
    <NotificationArea :notifications="notifications"></NotificationArea>
</template>
