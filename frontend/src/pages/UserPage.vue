<script lang="ts" setup>
import Dropdown from '@/components/Dropdown.vue';
import DropdownItem from '@/components/DropdownItem.vue';

const test = [['ff', 'sfasf'],['s'],['asf','asf','fsdh']];

</script>

<template>
    <Dropdown>
        <DropdownItem v-for="(item, i) in test" :key="i" :header="item" :id-prefix="'testdrop'" :index="i">
            <h2>CIAOOOO</h2>
            <button>TYEM E</button>
            <span>{{ item }}</span>
        </DropdownItem>
    </Dropdown>
</template>