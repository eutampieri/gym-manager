<script lang="ts" setup>

const props = defineProps<{
    header: Array<string>,
    idPrefix: string,
    index: Number,
    dropdownId: string
    modelValue?: string;
}>();
const itemId = props.idPrefix + props.index;
const emit = defineEmits(["update:modelValue"]); // Permette di emettere eventi
function selectTrainer() {
    emit("update:modelValue", props.idPrefix); // Aggiorna il valore di v-model
}
</script>

<template>
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                :data-bs-target="'#' + itemId" aria-expanded="false" :aria-controls="itemId"  @click="selectTrainer">
                <div class="d-flex d-row justify-content-between w-75">
                    <span v-for="h in header">{{ h }}</span>
                </div>
            </button>
        </h2>
        <div :id="itemId" class="accordion-collapse collapse" :data-bs-parent="'#' + dropdownId">
            <div class="accordion-body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>