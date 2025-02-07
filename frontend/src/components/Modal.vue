<script setup lang="ts">
import { Action } from '@/utils/lists';
import ActionButton from './ActionButton.vue';
import { onMounted, useTemplateRef } from 'vue';
import * as bootstrap from 'bootstrap';

defineProps<{
    dismissable?: boolean,
    actions: Action[],
}>();
const emit = defineEmits(["disposed"]);

const modal = useTemplateRef("modal");

let m: bootstrap.Modal;

onMounted(() => {
    m = bootstrap.Modal.getOrCreateInstance(modal.value!, {});
    m.show();
    modal.value?.addEventListener("hidden.bs.modal", event => {
        m.dispose();
        emit('disposed');
    });
});
const id = (Math.random() * 10).toFixed(0);
</script>
<template>
    <div ref="modal" class="modal fade modal-sm" aria-hidden="true" :aria-labelledby="`modalLabel${id}`" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" :id="`modalLabel${id}`">
                        <slot name="title"></slot>
                    </h1>
                    <button v-if="dismissable" type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <slot name="body"></slot>
                </div>
                <div class="modal-footer">
                    <ActionButton v-for="(a, index) in actions" :key="index"
                        :action="{ ...a, action: (x) => { m.hide(); a.action(x) } }"></ActionButton>
                </div>
            </div>
        </div>
    </div>
</template>