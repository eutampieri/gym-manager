<script setup lang="ts">
import { computed } from 'vue';
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
console.log(props.errorMessage.length);
</script>
<template>
    <div class="mb-3">
        <label class="form-label" :for="id">
            <slot></slot>
        </label>
        <input ref="input" :aria-invalid="!fieldValid"
            :class="`form-control ${((model?.length || 0 > 0) && errorMessage.length > 0) ? (fieldValid ? 'is-valid' : 'is-invalid') : ''}`"
            :type="type" :id="id" v-model="model">
        <div class="invalid-feedback">{{ props.errorMessage }}</div>
    </div>
</template>