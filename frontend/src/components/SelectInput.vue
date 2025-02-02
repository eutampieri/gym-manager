<script setup lang="ts">

// Props: etichetta, ID e opzioni della select
const props = defineProps<{
    id: string;
    options: string[]; // Lista delle opzioni per il select
}>();

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
            <option v-for="option in props.options" :key="option" :value="option">
                {{ option }}
            </option>
        </select>
    </div>
</template>
