<script setup lang="ts">
import Header from '@/components/Header.vue';
import NotificationArea from '@/components/NotificationArea.vue';
import { useNotificationsStore } from './store/notifications';

const notifications = useNotificationsStore().notifications;
</script>

<template>
    <Header></Header>
    <RouterView />
    <NotificationArea :notifications="notifications"></NotificationArea>
</template>
