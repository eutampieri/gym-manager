<script lang="ts" setup>
import UiNavigationButton from '@/components/UiNavigationButton.vue';

const buttons = [
    { text: "Create Trainer", route: "/admin/createTrainer", },
    { text: "View Trainers", route: "/admin/listTrainers", },
    { text: "Create Client", route: "/admin/createClient", },
    { text: "View Customers", route: "/admin/listCustomers", },
    { text: "Create Course", route: "/admin/createCourse", },
    { text: "View Courses", route: "/admin/listCourses", },
    { text: "Create Admin", route: "/admin/createAdmin"},
    { text: "View Admins", route: "/admin/listAdmins"},
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

