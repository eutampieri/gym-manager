<script setup lang="ts">
import { Action } from '@/utils/lists';

defineProps<{ action: Action, data?: any, small?: boolean }>();
</script>
<template>
    <button type="button" :class="`btn ${small ? 'btn-sm' : ''} btn-${action.colour} m-2`"
        @click="() => action.action(data)">{{ action.label
        }}</button>
</template>