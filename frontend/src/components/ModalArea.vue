<script setup lang="ts">
import ConfirmModal, { ConfirmModal as IConfirmModal } from '@/components/ConfirmModal.vue';
import { Notification as INotification } from '@/utils/notifications';

defineProps<{ confirms: IConfirmModal[] }>();

</script>
<template>
    <div>
        <ConfirmModal v-for="m, i in confirms" :key="i" :body="m.body" :resolve="m.resolve"></ConfirmModal>
    </div>
</template>