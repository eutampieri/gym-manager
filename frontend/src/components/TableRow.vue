<script setup lang="ts">
import { Action, Headers, RowData } from '@/utils/lists';

const props = defineProps<{
    class?: string,
    data: RowData,
    headers: Headers,
    showHeaders: boolean,
    actions: Array<Action>
}>();
</script>
<template>
    <div class="row">
        <div v-for="h in headers" :class="props.class || ''">
            <span class="fw-bold" v-if="showHeaders">{{ h.name }}: </span>
            {{ data[h.key] }}
        </div>
        <div :class="props.class">
            <button v-for="(action, index) in actions" :key="index" type="button" :class="`btn btn-${action.colour}`"
                @click="() => action.action(data)">{{ action.label }}</button>
        </div>
    </div>
</template>