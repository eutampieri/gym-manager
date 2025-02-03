<script lang="ts" setup>
import MainButton from '@/components/MainButton.vue';
import { useUserStore } from '@/store/user'; 

const store = useUserStore();
const admin = store.client.getUserDetails;
const buttons = [
    { text: "Create Trainer", route: "/admin/createTrainer", },
    { text: "View Trainers", route: "/admin/listTrainers", },
    { text: "Create Client", route: "/admin/createClient", },
    { text: "View Customers", route: "/admin/listCustomers", },
    { text: "Create Course", route: "/admin/createCourse", },
    { text: "View Courses", route: "/admin/listCourses", },
    { text: "Create Admin", route: "/admin/createAdmin"},
    { text: "View Admins", route: "/admin/listAdmins"},
    { text: "TEST User Page", route: "/user"},
];
</script>

<template>
    <div class="d-flex flex-column">
        <h1 class="mx-auto mb-5">Hello {{ admin?.username }}!</h1>
    </div>
    <MainButton :path="'/user'">TEST user home page</MainButton>
    <section class="d-flex flex-column mt-4">
        <h2 class="mx-auto">Courses</h2>
        <MainButton :path="'/admin/createCourse'">Create course</MainButton>
        <MainButton :path="'/admin/listCourses'">View courses</MainButton>
    </section>
    <section class="d-flex flex-column mt-4">
        <h2 class="mx-auto">Users</h2>
        <MainButton :path="'/admin/createClient'">Create user</MainButton>
        <MainButton :path="'/admin/listCustomers'">View users</MainButton>
    </section>
    <section class="d-flex flex-column mt-4">
        <h2 class="mx-auto">Trainers</h2>
        <MainButton :path="'/admin/createTrainer'">Create trainer</MainButton>
        <MainButton :path="'/admin/listTrainers'">View trainers</MainButton>
    </section>
    <section class="d-flex flex-column mt-4">
        <h2 class="mx-auto">Admins</h2>
        <MainButton :path="'/admin/createAdmin'">Create admin</MainButton>
        <MainButton :path="'/admin/listAdmins'">View admins</MainButton>
    </section>
</template>