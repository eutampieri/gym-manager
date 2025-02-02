<script lang="ts" setup>

const props = defineProps<{
    action: () => void
}>();

</script>

<template>
    <a href="#" @click="action"><slot></slot></a>
</template>