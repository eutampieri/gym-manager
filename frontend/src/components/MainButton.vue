<script lang="ts" setup>

const {useVariant = false} = defineProps<{ useVariant?: boolean, path: string }>();

function btnStyle(): string {
    return useVariant ? 'btn-secondary' : 'btn-primary';
}
</script>

<template>
    <RouterLink :to="{ path: path }" class="nav-link">
        <button type="button" :class="btnStyle() + ' btn m-2 p-3 main-container mx-auto d-block'">
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