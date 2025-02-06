<script lang="ts" setup>
import * as bootstrap from 'bootstrap';
import { onMounted, useTemplateRef } from 'vue';
import { Notification as INotification } from '@/utils/notifications';
import ActionButton from './ActionButton.vue';
import { Action } from '@/utils/lists';
defineProps<INotification>();
let toast = useTemplateRef("toast");

function dismiss() {
    bootstrap.Toast.getOrCreateInstance(toast.value!).hide();
}

function wrappedAction(a: Action): Action {
    return { ...a, action: (x) => { dismiss(); a.action(x) } };
}
onMounted(() => {
    bootstrap.Toast.getOrCreateInstance(toast.value!).show();
});
</script>
<template>
    <div ref="toast" class="toast" :class="'text-bg-' + background" role="alert" aria-live="assertive"
        aria-atomic="true">
        <div :class="(title) ? 'toast-header' : 'd-flex'">
            <strong v-if="title" class="me-auto">{{ title }}</strong>
            <small v-if="when && title" class="text-body-secondary">{{ when.toLocaleTimeString() }}</small>
            <div v-if="!title" class="toast-body">
                {{ body }}
            </div>
            <button type="button" :class="'btn-close' + ((!title) ? ' btn-close-white me-2 m-auto' : '')"
                data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div v-if="title" class="toast-body">
            {{ body }}
        </div>
        <div v-if="actions" class="mt-2 pt-2 border-top">
            <ActionButton v-for="action, index in actions" :key="index" :action="wrappedAction(action)" :small="true">
            </ActionButton>
        </div>
    </div>
</template>