<script setup lang="ts">
import Header from '@/components/Header.vue';
import NotificationArea from '@/components/NotificationArea.vue';
import { useNotificationsStore } from './store/notifications';
import BookCoursePage from './pages/BookCoursePage.vue';

const notifications = useNotificationsStore().notifications;
</script>

<template>
    <Header></Header>
    <RouterView />
    <BookCoursePage/>
    <NotificationArea :notifications="notifications"></NotificationArea>
</template>
