<script lang="ts" setup>
import UiNavigationButton from '@/components/UiNavigationButton.vue';
import ListView from '@/components/ListView.vue';
import { ListData, RowData } from '@/utils/lists';

const buttons = [
    { text: "Create Trainer", route: "/admin/createTrainer"},
    { text: "View Trainers", route: "/admin"},
    { text: "Create User", route: "/admin/createClient"},
    { text: "View Users", route: "/admin"},
    { text: "Create Course", route: "/admin/createCourse"},
    { text: "View Courses", route: "/admin"},
    { text: "Create Admin", route: "/admin/createAdmin"},
    { text: "View Administrators", route: "/admin"},
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
    <ListView :data="data" :mobile-header="mobileHeader"></ListView>
</template>

