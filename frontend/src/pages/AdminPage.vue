<script lang="ts" setup>
import { ref } from 'vue';
import UiNavigationButton from '@/components/UiNavigationButton.vue';
import ListView from '@/components/ListView.vue';
import { ListData, RowData } from '@/utils/lists';

const buttons = [
    { text: "Create Trainer", route: "/admin/createTrainer", },
    { text: "Delete Trainer", route: "/admin", },
    { text: "Update Trainer", route: "/admin", },
    { text: "Create Client", route: "/admin/createClient", },
    { text: "Delete Client", route: "/admin", },
    { text: "Update Client", route: "/admin", },
    { text: "Create Course", route: "/admin/createCourse", },
    { text: "Delete Course", route: "/admin", },
    { text: "Update Course", route: "/admin", },
];

const data: ListData = {
    headers: [
        {
            key: 'name',
            name: 'Name'
        },
        {
            key: 'description',
            name: 'Description'
        }
    ],
    actions: [],
    data: [
        {
            name: "Zumba",
            description: "A bad course description :("
        },
        {
            name: "Zumba1",
            description: "A bad course description :("
        }
    ]
};
function mobileHeader(d: RowData): string {
    return d.name
}
const filter = (d: RowData, s: string) =>
    d.name.toLowerCase().indexOf(s.toLowerCase()) >= 0;

</script>
<template>
    <h1>Admin Page</h1>
    <div class="d-flex justify-content-center">
        <div class="mt-5 d-flex flex-wrap justify-content-evenly col-md-8">
            <UiNavigationButton :path="b.route" v-for="b in buttons">
                {{ b.text }}
            </UiNavigationButton>
        </div>
    </div>
    <ListView :filter-function="filter" :data="data" :mobile-header="mobileHeader"></ListView>
</template>
