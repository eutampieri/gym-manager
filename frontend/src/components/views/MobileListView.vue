<script setup lang="ts">
import { ListData, RowData } from '@/utils/lists';
import TableRow from './TableRow.vue';

defineProps<{ data: ListData, accordionHeader: (d: RowData) => string }>();
</script>
<template>
    <div class="accordion">
        <div v-for="(row, index) in data.data" :key='index' class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    :data-bs-target="'#collapse' + index" aria-expanded="false" :aria-controls="'collapse' + index">
                    {{ accordionHeader(row) }}
                </button>
            </h2>
            <div :id="'collapse' + index" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <TableRow :actions="data.actions" :data="row" :headers="data.headers" :show-headers="true"
                        class="col-sm-12"></TableRow>
                </div>
            </div>
        </div>
    </div>
</template>