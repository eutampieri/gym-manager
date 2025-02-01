<script setup lang="ts">
import MobileListView from './MobileListView.vue';
import DesktopListView from './DesktopListView.vue';
import { ListData, RowData } from '@/utils/lists';

defineProps<{ data: ListData, mobileHeader: (d: RowData) => string }>();
</script>
<template>
    <MobileListView :data="data" v-if="$matches.sm.max" :accordion-header="mobileHeader"></MobileListView>
    <DesktopListView :data="data" v-else></DesktopListView>
</template>