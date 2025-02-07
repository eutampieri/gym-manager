<script setup lang="ts">
import ValidatingGenericInput from './ValidatingGenericInput.vue';
const props = defineProps<{
    type: string,
    id: string,
    dontAutocapitalize?: boolean,
}>();

const model = defineModel<string>();

</script>
<template>
    <ValidatingGenericInput :dont-autocapitalize="dontAutocapitalize" :id="id" :type="type" error-message=""
        :validation-function="(_) => true" v-model="model">
        <slot></slot>
    </ValidatingGenericInput>
</template>