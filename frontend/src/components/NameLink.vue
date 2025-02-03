<script lang="ts" setup>

const props = defineProps<{
    path: string
}>();

</script>

<template>
    <RouterLink :to="{ path: path }">
        <a href="#"><slot></slot></a>
    </RouterLink>
</template>