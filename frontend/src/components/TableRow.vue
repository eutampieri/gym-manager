<script setup lang="ts">
import { Headers, RowData } from '@/utils/lists';

const props = defineProps<{ class?: string, data: RowData, headers?: Array<Headers> }>();
</script>
<template>
    <div class="row">
        <div :class="props.class || ''">Test</div>
        <div :class="props.class || ''">Test1</div>
        <div :class="props.class || ''">Test2</div>
    </div>
</template>