<script lang="ts" setup>

const props = defineProps<{
    action: () => void
}>();

</script>

<template>
    <button type="button" class="btn-primary btn m-2 p-3 main-container mx-auto d-block" @click="action">
        <slot></slot>
    </button>
</template>

<style>
.main-container {
    max-width: 500px;
    width: 100%;
}
</style>