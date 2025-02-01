<script lang="ts" setup>
import GenericInput from '@/components/GenericInput.vue';
import router from '@/routes/router';
import { useUserStore } from '@/store/user';
import { ref } from 'vue';

const store = useUserStore();
const username = ref<string>();
const password = ref<string>();
async function login() {
    let authResult = await store.client.login(username.value || "", password.value || "");
    if (authResult) {
        router.push({ "path": "/admin" })
    }
}
</script>
<template>
    <h1>Login</h1>
    <form>
        <GenericInput v-model="username" type="text" id="username">Username</GenericInput>
        <GenericInput v-model="password" type="password" id="password">Password</GenericInput>
    </form>
    <button class="btn btn-primary" type="button" @click="login()">Login</button>
</template>