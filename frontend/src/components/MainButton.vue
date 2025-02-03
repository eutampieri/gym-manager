<script lang="ts" setup>

const props = defineProps<{
    path: string
}>();

</script>

<template>
    <RouterLink :to="{ path: path }" class="nav-link">
        <button type="button" class="btn-primary btn m-2 p-3 main-container mx-auto d-block">
            <slot></slot>
        </button>
    </RouterLink>
</template>

<style>
.main-container {
    max-width: 500px;
    width: 100%;
}
</style>