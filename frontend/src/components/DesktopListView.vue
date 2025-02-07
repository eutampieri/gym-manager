<script setup lang="ts">
import { ListData } from '@/utils/lists';
import DesktopListRow from './DesktopListRow.vue';

defineProps<{ data: ListData }>();

</script>
<template>
    <div class="table-responsive">
        <table class="table table-striped align-middle">
            <thead>
                <tr>
                    <th v-for="h in data.headers" scope="col" :id="h.key">{{ h.name }}</th>
                    <th scope="col" id="actions" aria-label="Actions"></th>
                </tr>
            </thead>
            <tbody>
                <DesktopListRow v-for="(row, index) in data.data" :key='index' :actions="data.actions" :data="row"
                    :headers="data.headers">
                </DesktopListRow>
            </tbody>
        </table> 
    </div>
</template>
