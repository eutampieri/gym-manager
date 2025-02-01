<script lang="ts" setup>
import UiNavigationButton from '@/components/UiNavigationButton.vue';

const buttons = [
    { text: "Create Trainer", route: "/admin/createTrainer", },
    { text: "List Trainers", route: "/admin/listTrainers", },
    { text: "Update Trainer", route: "/admin", },
    { text: "Create Client", route: "/admin/createClient", },
    { text: "List Customers", route: "/admin/listCustomers", },
    { text: "Update Client", route: "/admin", },
    { text: "Create Course", route: "/admin/createCourse", },
    { text: "List Courses", route: "/admin/listCourses", },
];
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
</template>
