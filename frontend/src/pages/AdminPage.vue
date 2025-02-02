<script lang="ts" setup>
import UiNavigationButton from '@/components/UiNavigationButton.vue';

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

</script>


<template>
    <h1>Admin Page</h1>
    <div class="d-flex justify-content-center">
        <div class="mt-5 d-flex flex-wrap justify-content-evenly col-md-8">
            <UiNavigationButton :path="b.route" v-for="b in buttons">
                {{b.text}}
            </UiNavigationButton>
        </div>
    </div>

</template>

