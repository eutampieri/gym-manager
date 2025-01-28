<script lang="ts" setup>
import router from '@/routes/router';
import { useUserStore } from '@/store/user';

const store = useUserStore();
function login() {
    store.jwt = "jklònmklò";
    router.push({"path": "/admin"})
}
</script>
<template>
    <h1>Login</h1>
    <button @click="login()">Login</button>
</template>