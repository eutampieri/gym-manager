<script setup lang="ts">
import { ListData } from '@/utils/lists';
import TableRow from './TableRow.vue';

const props = defineProps<{ data: ListData }>();

const colWidth = Math.max(1, Math.floor(12 / (props.data.headers.length + 1)));
const breakpoints = `col-md-${colWidth} col-sm-12 p-1`;
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
    background: #e0e0e0;
}

section.body>div:nth-of-type(even) {
    background: #FFFFFF;
}
</style>