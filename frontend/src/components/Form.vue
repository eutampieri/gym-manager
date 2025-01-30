<script setup lang="ts">
import { FormField, ValidatingFormField } from '@/utils/form';
import ValidatingGenericInput from './ValidatingGenericInput.vue';
import GenericInput from './GenericInput.vue';
import { onMounted } from 'vue';

const props = defineProps<{
    fields: ValidatingFormField[]
}>();
</script>
<template>
    <template v-for="field in props.fields">
        <ValidatingGenericInput type="text" :id="field.id" :error-message="field.errorMessage"
            :validation-function="field.validatingFunction" v-model="field.binding.value"
            v-model:valid="field.statusBinding.value">
            {{ field.label }}
        </ValidatingGenericInput>
    </template>

</template>