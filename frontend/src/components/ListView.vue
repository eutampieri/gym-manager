<script setup lang="ts">
import MobileListView from './MobileListView.vue';
import DesktopListView from './DesktopListView.vue';
import { ListData, RowData } from '@/utils/lists';
import SearchBar from './SearchBar.vue';
import { computed, ref } from 'vue';

const props = defineProps<{
    data: ListData,
    mobileHeader: (d: RowData) => string,
    filterFunction: (d: RowData, s: string) => boolean
}>();

const searchQuery = ref("");

const filteredData = computed((): ListData => {
    return {
        actions: props.data.actions,
        data: props.data.data.filter((v, _) => props.filterFunction(v, searchQuery.value)),
        headers: props.data.headers,
    }
});
</script>
<template>
    <SearchBar v-model="searchQuery"></SearchBar>
    <MobileListView v-if="$matches.sm.max" :data="filteredData" :accordion-header="mobileHeader"></MobileListView>
    <DesktopListView v-else :data="filteredData"></DesktopListView>
</template>