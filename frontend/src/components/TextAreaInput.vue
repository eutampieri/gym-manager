<script setup lang="ts">

const props = defineProps<{
    id: string,
    label: string
}>();

const model = defineModel<string>();

</script>
<template>
    <div class="mb-3">
        <label class="form-label" :for="id">
            {{ label }}
        </label>
        <textarea :id="id" v-model="model" class="form-control" :aria-label="label"></textarea>
    </div>
</template>