<script setup lang="ts">
import Header from '@/components/Header.vue';
</script>

<template>
    <Header></Header>
    <div class="container-md bg-white p-3 rounded" id="app">
        <RouterView />
    </div>
</template>
