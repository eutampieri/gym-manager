<script setup lang="ts">
import { Action, Headers, RowData } from '@/utils/lists';
import ActionButton from './ActionButton.vue';
import { computed } from 'vue';

const { headers } = defineProps<{
    data: RowData,
    headers: Headers,
    actions: Action[]
}>();

const rowHeader = headers[0];
const otherHeaders = headers.slice(1);
</script>
<template>
    <tr>
        <th :id="(data[rowHeader.key] as string)">
            <RouterLink v-if="rowHeader.link" :to="rowHeader.link(data)">{{ data[rowHeader.key] }}</RouterLink>
            <template v-else>{{ data[rowHeader.key] }}</template>
        </th>
        <td v-for="h in otherHeaders">
            <template v-if="!Array.isArray(data[h.key])">
                <RouterLink v-if="h.link" :to="h.link(data)">{{ data[h.key] }}</RouterLink>
                <template v-else>{{ data[h.key] }}</template>
            </template>
            <ul v-else>
                <li v-for="i in data[h.key]">
                    {{ i }}
                </li>
            </ul>
        </td>
        <td>
            <ActionButton :small="true" v-for="(action, index) in actions" :key="index" :action="action" :data="data">
            </ActionButton>
        </td>
    </tr>
</template>