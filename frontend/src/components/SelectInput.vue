<script setup lang="ts">
import { computed, ref, watch } from 'vue';


export interface SelectInputValue { id: string, label: string, selected?: boolean };

// Props: etichetta, ID e opzioni della select
const props = defineProps<{
    id: string;
    options: SelectInputValue[] | string[]; // Lista delle opzioni per il select
}>();

// Modello reattivo collegato a `v-model`
const model = defineModel<string>();
// Forza Vue a tracciare i cambiamenti
const fixedOptions = ref<SelectInputValue[]>([]);
const selectedItem = computed(() => props.options.find(o => (o as SelectInputValue).selected))

watch(() => props.options, (newOptions) => {
    fixedOptions.value = newOptions.map((x): SelectInputValue => {
        if (typeof x === "string") {
            return { id: x, label: x, selected: false };
        } else {
            return x;
        }
    });
}, { immediate: true });
</script>

<template>
    <div class="mb-3">
        <label class="form-label" :for="id">
            <slot></slot> <!-- Testo della label -->
        </label>

        <select class="form-select" :id="id" v-model="model">
            <option v-if="!selectedItem" value="" disabled>Select...</option> <!-- Opzione vuota iniziale -->
            <option v-for="option in fixedOptions" :key="option.id" :value="option.id" :selected="option.selected">
                {{ option.label }}
            </option>
        </select>
    </div>
</template>
