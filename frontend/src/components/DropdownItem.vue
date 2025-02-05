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
        <div class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                :data-bs-target="'#' + itemId" aria-expanded="false" :aria-controls="itemId"  @click="selectTrainer">
                <div class="d-flex d-row justify-content-between w-75">
                    <h3 v-for="h in header" class="fs-6 m-0">{{ h }}</h3>
                </div>
            </button>
        </div>
        <div :id="itemId" class="accordion-collapse collapse" :data-bs-parent="'#' + dropdownId">
            <div class="accordion-body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>