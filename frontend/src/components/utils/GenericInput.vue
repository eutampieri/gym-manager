<script setup lang="ts">
import ValidatingGenericInput from './ValidatingGenericInput.vue';
const props = defineProps<{
    type: string,
    id: string,
}>();

const model = defineModel<string>();

</script>
<template>
    <ValidatingGenericInput :id="id" :type="type" error-message="" :validation-function="(_) => true" v-model="model">
        <slot></slot>
    </ValidatingGenericInput>
</template>