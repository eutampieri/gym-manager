<script setup lang="ts">

// Definizione delle props
const props = defineProps<{
  id: string;
  modelValue: boolean;
}>();

// Definizione degli eventi
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
}>();

// Funzione per aggiornare il valore della checkbox
const toggleCheck = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
};
</script>

<template>
  <div class="form-check">
    <input class="form-check-input" type="checkbox" :id="id" :checked="modelValue" @change="toggleCheck" />
    <label class="form-check-label" :for="id">
      <slot></slot>
    </label>
  </div>
</template>

<style scoped>
.form-check {
  margin-bottom: 10px;
}
</style>
