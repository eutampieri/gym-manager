<script setup lang="ts">
import { computed, ref } from 'vue';
const props = defineProps<{ // props per valori non modificabili dal figlio
    validationFunction: (value: string) => boolean,
    errorMessage: string,
    type: string,
    id: string,
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
        <input :aria-invalid="!fieldValid" class="form-control" :type="type" :id="id" v-model="model">
        <div v-if="!fieldValid && !(model?.length == 0)" class="form-text text-danger">{{ props.errorMessage }}</div>
    </div>
</template>