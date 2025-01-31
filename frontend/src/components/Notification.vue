<script lang="ts" setup>
import * as bootstrap from 'bootstrap';
import { onMounted } from 'vue';
import { Notification as INotification } from '@/utils/notifications';
defineProps<INotification>();

const id = new Date().getTime().toString();
onMounted(() => { bootstrap.Toast.getOrCreateInstance(document.getElementById(id)!).show(); });
</script>
<template>
    <div :id="id" class="toast" :class="'text-bg-' + background" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <strong class="me-auto">{{ title }}</strong>
            <small v-if="when" class="text-body-secondary">{{ when.toLocaleTimeString() }}</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            {{ body }}
        </div>
    </div>
</template>