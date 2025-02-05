<script setup lang="ts">
import Modal from '@/components/Modal.vue';
import { Action } from '@/utils/lists';

export interface ConfirmModal {
    resolve: (r: boolean) => void,
    body: string
}

const props = defineProps<ConfirmModal>();
const emit = defineEmits(["disposed"]);

const actions: Action[] = [
    {
        action: function (_: any): void {
            props.resolve(true);
        },
        label: 'Yes',
        colour: 'danger'
    }, {
        action: function (_: any): void {
            props.resolve(false);
        },
        label: 'No',
        colour: 'secondary'
    }
];
</script>
<template>
    <Modal :actions="actions" @disposed="() => { props.resolve(false); emit('disposed'); }">
        <template #title>Warning</template>
        <template #body> {{ body }}</template>
    </Modal>
</template>