<script setup lang="ts">
import { computed, ref } from 'vue';
const props = defineProps<{
    validationFunction: (value: string) => boolean,
    errorMessage: string,
    type: string,
    id: string,
}>();

const model = defineModel<string>();
const validationModel = defineModel<boolean>("valid");

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