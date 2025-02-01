<script setup lang="ts">
import MobileListView from './MobileListView.vue';
import DesktopListView from './DesktopListView.vue';
import { ListData, RowData } from '@/utils/lists';
import SerarchBar from './SerarchBar.vue';
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
    <SerarchBar v-model="searchQuery"></SerarchBar>
    <MobileListView :data="filteredData" v-if="$matches.sm.max" :accordion-header="mobileHeader"></MobileListView>
    <DesktopListView :data="filteredData" v-else></DesktopListView>
</template>