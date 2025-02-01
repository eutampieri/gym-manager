<script setup lang="ts">
import { ListData } from '@/utils/lists';

const props = defineProps<{ data: ListData }>();

const colWidth = Math.max(1, Math.floor(12 / props.data.getHeaders().length));
const breakpoints = `col-md-${colWidth} col-sm-12`;
</script>
<template>
    <section>
    </section>
</template>