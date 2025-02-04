<script setup lang="ts">
import { computed } from 'vue';


export interface SelectInputValue { id: string, label: string };

// Props: etichetta, ID e opzioni della select
const props = defineProps<{
    id: string;
    options: SelectInputValue[] | string[]; // Lista delle opzioni per il select
}>();

const fixedOptions = computed(() => props.options.map((x): SelectInputValue => {
    if ((x as SelectInputValue).id === undefined) {
        let value = x as string;
        return { id: value, label: value };
    } else {
        return (x as SelectInputValue);
    }
}));

// Modello reattivo collegato a `v-model`
const model = defineModel<string>();
</script>

<template>
    <div class="mb-3">
        <label class="form-label" :for="id">
            <slot></slot> <!-- Testo della label -->
        </label>

        <select class="form-select" :id="id" v-model="model">
            <option value="" disabled>Select...</option> <!-- Opzione vuota iniziale -->
            <option v-for="option in fixedOptions" :key="option.id" :value="option.id">
                {{ option.label }}
            </option>
        </select>
    </div>
</template>
