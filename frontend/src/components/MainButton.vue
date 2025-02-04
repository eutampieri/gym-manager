<script lang="ts" setup>
import { computed } from 'vue';

const { useVariant = false } = defineProps<{ useVariant?: boolean, path: string }>();

const btnStyle = computed(() => "btn m-2 btn-lg main-container mx-auto d-block " +
    (useVariant ? 'btn-secondary' : 'btn-primary'));
</script>

<template>
    <RouterLink role="button" :to="{ path: path }" :class="btnStyle">
        <slot></slot>
    </RouterLink>
</template>

<style>
.main-container {
    max-width: 500px;
    width: 100%;
}
</style>