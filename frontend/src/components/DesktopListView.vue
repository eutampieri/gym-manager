<script setup lang="ts">
import { ListData } from '@/utils/lists';
import TableRow from './TableRow.vue';

defineProps<{ data: ListData }>();

const breakpoints = `col-md col-sm-12 p-1`;
</script>
<template>
    <section class="text-break">
        <div class="row">
            <div v-for="h in data.headers" :class="breakpoints + ' fw-bold'">{{ h.name }}</div>
            <div :class="breakpoints + ' fw-bold'"></div>
        </div>
        <section class="body">
            <TableRow v-for="row in data.data" :data="row" :headers="data.headers" :show-headers="false"
                :class="breakpoints" :actions="data.actions"></TableRow>
        </section>
    </section>
</template>
<style>
section.body>div {
    border-top: 1px solid #aaa;
}

section.body>div:nth-of-type(odd) {
    background: var(--bs-secondary-bg);
}

section.body>div:nth-of-type(even) {
    background: var(--bs-body-bg);
}
</style>