<script setup lang="ts">
import { Action } from '@/utils/lists';

defineProps<{ action: Action, data?: any }>();
</script>
<template>
    <button type="button" :class="`btn btn-${action.colour} m-2`" @click="() => action.action(data)">{{ action.label
        }}</button>
</template>