<script setup lang="ts">
const props = defineProps({
    path: { type: string, required: true },
})

</script>
<template>
    <RouterLink :to="{ path: path }" class="nav-link">
        <button type="button" class="btn btn-primary m-2">
            <slot></slot>
        </button>
    </RouterLink>
</template>