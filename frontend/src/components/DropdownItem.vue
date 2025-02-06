<script lang="ts" setup>
import { onMounted, useTemplateRef } from 'vue';


const props = defineProps<{
    header: Array<string>,
    idPrefix: string,
    index: Number,
    dropdownId: string
}>();
const itemId = props.idPrefix + props.index;

const emit = defineEmits<{ shown: [] }>();
const collapsible = useTemplateRef('collapsible');
onMounted(() => {
    collapsible.value!.addEventListener('shown.bs.collapse', () => emit('shown'));
})
</script>

<template>
    <div class="accordion-item">
        <div class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                :data-bs-target="'#' + itemId" aria-expanded="false" :aria-controls="itemId">
                <div class="d-flex d-row justify-content-between w-75">
                    <h3 v-for="h in header" class="fs-6 m-0">{{ h }}</h3>
                </div>
            </button>
        </div>
        <div ref="collapsible" :id="itemId" class="accordion-collapse collapse" :data-bs-parent="'#' + dropdownId">
            <div class="accordion-body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>