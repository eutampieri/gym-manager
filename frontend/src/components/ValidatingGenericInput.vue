<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
    validationFunction: (value: string) => boolean,
    errorMessage: string,
    type: string,
    id: string,
    dontAutocapitalize?: boolean,
}>();
// le props vengono passata dal padre al figlio :nomeProp e nel figlio vengono usate direttamente:  nomeProp
const model = defineModel<string>(); // defineModel per valori modificabili con v-model che possono essere modificati dal figlio
const validationModel = defineModel<boolean>("valid"); // valid è il modificatore

const fieldValid = computed(() => {
    const status = props.validationFunction(model.value || "");
    validationModel.value = status;
    return status;
});

</script>
<template>
    <div class="mb-3">
        <label class="form-label" :for="id">
            <slot></slot>
        </label>
        <input ref="input" :aria-invalid="!fieldValid" required aria-required="true"
            :class="`form-control ${((model?.length || 0 > 0) && errorMessage.length > 0) ? (fieldValid ? 'is-valid' : 'is-invalid') : ''}`"
            :type="type" :id="id" v-model="model" :autocapitalize="dontAutocapitalize ? 'none' : 'yes'">
        <div class="invalid-feedback">{{ props.errorMessage }}</div>
    </div>
</template>