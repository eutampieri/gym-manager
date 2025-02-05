<script setup lang="ts">
import { ListData, RowData } from '@/utils/lists';
import TableRow from './TableRow.vue';
import Dropdown from './Dropdown.vue';
import DropdownItem from './DropdownItem.vue';

defineProps<{ data: ListData, accordionHeader: (d: RowData) => string }>();
</script>
<template>
    <Dropdown id="mobile-list">
        <DropdownItem v-for="(row, index) in data.data" :key='index' :header="[accordionHeader(row)]" :dropdown-id="'mobile-list'" :id-prefix="'mlist-item'" :index="index">
            <TableRow :actions="data.actions" :data="row" :headers="data.headers" :show-headers="true"
                        class="col-sm-12"></TableRow>
        </DropdownItem>
    </Dropdown>
</template>