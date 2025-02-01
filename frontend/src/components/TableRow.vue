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
            <template v-if="!Array.isArray(data[h.key])">
                {{ data[h.key] }}
            </template>
            <ul v-else>
                <li v-for="i in data[h.key]">
                    {{ i }}
                </li>
            </ul>
        </div>
        <div class="col">
            <button v-for="(action, index) in actions" :key="index" type="button"
                :class="`btn btn-${action.colour} m-2`" @click="() => action.action(data)">{{ action.label }}</button>
        </div>
    </div>
</template>