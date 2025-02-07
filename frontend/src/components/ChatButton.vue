<script lang="ts" setup>
import { useChatStore } from '@/store/chat';
import { computed } from 'vue';

const { useVariant = false } = defineProps<{ useVariant?: boolean}>();

const btnStyle = computed(() => "btn m-2 btn-lg main-container mx-auto d-block " +
    (useVariant ? 'btn-secondary' : 'btn-primary'));

const chatHandler = useChatStore().requestChat;
</script>

<template>
    <button role="button" :class="btnStyle" @click="chatHandler">
        <slot></slot>
    </button>
</template>

<style>
.main-container {
    max-width: 500px;
    width: 100%;
}
</style>