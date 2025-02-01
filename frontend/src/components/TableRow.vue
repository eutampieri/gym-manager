<script setup lang="ts">
import { Headers, RowData } from '@/utils/lists';

const props = defineProps<{ class?: string, data: RowData, headers: Headers, showHeaders: boolean }>();
</script>
<template>
    <div class="row">
        <div v-for="h in headers" :class="props.class || ''"><span class="fw-bold" v-if="showHeaders">{{ h.name }}:
            </span>{{
                data[h.key] }}</div>
    </div>
</template>