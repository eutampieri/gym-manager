<script setup lang="ts">
import { Action, Headers, RowData } from '@/utils/lists';
import ActionButton from './ActionButton.vue';

const props = defineProps<{
    class?: string,
    data: RowData,
    headers: Headers,
    showHeaders: boolean,
    actions: Action[]
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
            <ActionButton v-for="(action, index) in actions" :key="index" :action="action" , :data="data">
            </ActionButton>
        </div>
    </div>
</template>