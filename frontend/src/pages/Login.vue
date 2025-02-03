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
    <br>
       <div class="form-group">
       <label for="exampleInputEmail1">Email address</label>
       <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
       </div>
       <br>
       <div class="form-group">
       <label for="exampleInputPassword1">Password</label>
       <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
       </div>
       <br>
       <!-- Bottone Login -->
       <button class="btn btn-primary w-100" @click="login">
        <span class="spinner-border spinner-border-sm me-2"></span>
        Accedi
       </button>
</template>