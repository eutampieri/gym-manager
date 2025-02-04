<script setup lang="ts">
import ConfirmModal, { ConfirmModal as IConfirmModal } from '@/components/ConfirmModal.vue';

defineProps<{ confirms: [IConfirmModal, () => void][] }>();

</script>
<template>
    <div>
        <ConfirmModal @disposed="m[1]" v-for="m, i in confirms" :key="i" :body="m[0].body" :resolve="m[0].resolve">
        </ConfirmModal>
    </div>
</template>