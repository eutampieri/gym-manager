<script lang="ts" setup>
import GenericInput from '@/components/GenericInput.vue';
import NotificationArea from '@/components/NotificationArea.vue';
import { Notification as INotification } from '@/utils/notifications';
import router from '@/routes/router';
import { useUserStore } from '@/store/user';
import { ref } from 'vue';
import { Role } from '@gym-manager/models';

const store = useUserStore();
const username = ref<string>();
const password = ref<string>();
const loginInProgress = ref(false);
async function login() {
    loginInProgress.value = true;
    let authResult = await store.client.login(username.value || "", password.value || "");
    loginInProgress.value = false;
    if (authResult) {
        switch (store.client.getRole) {
            case Role.Admin:
                router.push({ "path": "/admin" })
                break;
            case Role.Trainer:
                router.push({ "path": "/trainer" })
                break;
            case Role.User:
                router.push({ "path": "/user" })
                break;
        }
    } else {
        notifications.value.push({
            title: 'Authentication error',
            body: 'The credentials you provided were invalid.',
            background: "danger"
        });
    }
}
const notifications = ref<Array<INotification>>([]);
</script>
<template>
    <h1>Login</h1>
    <form>
        <GenericInput v-model="username" type="text" id="username">Username</GenericInput>
        <GenericInput v-model="password" type="password" id="password">Password</GenericInput>
        <button class="btn btn-primary" type="button" @click="login()">Login</button>
    </form>
    <NotificationArea :notifications="notifications"></NotificationArea>
</template>