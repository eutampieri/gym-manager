<script lang="ts" setup>
import GenericInput from '@/components/GenericInput.vue';

import router from '@/routes/router';
import { useUserStore } from '@/store/user';
import { ref } from 'vue';
import { Role } from '@gym-manager/models';
import { useNotificationsStore } from '@/store/notifications';

const store = useUserStore();
const username = ref<string>();
const password = ref<string>();
const loginInProgress = ref(false);

const notifications = useNotificationsStore();
const sadPath = () => notifications.fire({
    title: 'Authentication error',
    body: 'The credentials you provided were invalid.',
    background: "danger"
});

async function login() {
    loginInProgress.value = true;
    let authResult = await store.client.login(username.value || "", password.value || "").catch(sadPath);
    loginInProgress.value = false;
    if (authResult) {
        try {
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
        } catch {
            sadPath();
        }
    } else {
        sadPath();
    }
}
</script>
<template>
    <h2>Login</h2>
    <form>
        <GenericInput v-model="username" type="text" id="username">Username</GenericInput>
        <GenericInput v-model="password" type="password" id="password">Password</GenericInput>
        <button :disabled="loginInProgress" class="btn btn-primary" type="button" @click="login()">
            <div v-if="loginInProgress" class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
            </div> Login
        </button>
    </form>
</template>