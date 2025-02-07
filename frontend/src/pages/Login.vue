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
    if (loginInProgress.value) return;
    loginInProgress.value = true;
    try {
        let authResult = await store.client.login(username.value || "", password.value || "");
        console.log("authResult: "+authResult);
        if (authResult) {
            router.push({ path: "/" });
        } else {
            sadPath();
        }
    } catch (error) {
        sadPath();  
    } finally {
        loginInProgress.value = false;
    }
}
</script>

<template>
    <h2>Login</h2>
    <form @submit.prevent="login">
        <GenericInput v-model="username" type="text" id="username">Username</GenericInput>
        <GenericInput v-model="password" type="password" id="password">Password</GenericInput>
        <button :disabled="loginInProgress" class="btn btn-primary" type="submit">
            <div v-if="loginInProgress" class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
            </div> Login
        </button>
    </form>
</template>
