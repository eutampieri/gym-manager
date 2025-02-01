<script setup lang="ts">
import MobileListView from './MobileListView.vue';
import DesktopListView from './DesktopListView.vue';
import { ListData } from '@/utils/lists';

defineProps<{ data: ListData }>();
</script>
<template>
    <MobileListView :data="data" v-if="$matches.sm.max"></MobileListView>
    <DesktopListView :data="data" v-else></DesktopListView>
</template>