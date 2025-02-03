<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


const model = defineModel<string>();
</script>
<template>
    <div class="input-group mb-3">
        <input v-model="model" type="text" class="form-control" aria-label="Search">
        <span class="input-group-text">
            <FontAwesomeIcon :icon="faMagnifyingGlass"></FontAwesomeIcon>
        </span>
    </div>
</template>