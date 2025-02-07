<script setup lang="ts">
import { Action, Headers, RowData } from '@/utils/lists';
import ActionButton from './ActionButton.vue';

const props = defineProps<{
    data: RowData,
    headers: Headers,
    actions: Action[]
}>();
</script>
<template>
    <dl>
        <template v-for="h in headers">
            <dt>{{ h.name }}: </dt>
            <dd>
                <template v-if="!Array.isArray(data[h.key])">
                    <RouterLink v-if="h.link" :to="h.link(data)">{{ data[h.key] }}</RouterLink>
                    <template v-else>{{ data[h.key] }}</template>
                </template>
                <ul v-else>
                    <li v-for="i in data[h.key]">
                        {{ i }}
                    </li>
                </ul>
            </dd>
        </template>
        <div class="col">
            <ActionButton v-for="(action, index) in actions" :key="index" :action="action" :data="data">
            </ActionButton>
        </div>
    </dl>
</template>