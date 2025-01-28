<script lang="ts" setup>
import { ref } from 'vue';

const buttons = [
    {text: "Create Trainer", route: "/createTrainer",},
    {text: "Delete Trainer", route: "/admin",},
    {text: "Update Trainer", route: "/admin",},
    {text: "Create Client", route: "/admin",},
    {text: "Delete Client", route: "/admin",},
    {text: "Update Client", route: "/admin",},
    {text: "Create Course", route: "/createCourse",},
    {text: "Delete Course", route: "/admin",},
    {text: "Update Course", route: "/admin",},
];

</script>
<template>
    <h1>Admin Page</h1>
    <div class="d-flex justify-content-center">
    <div class="mt-5 d-flex flex-wrap justify-content-evenly col-md-8">
        <RouterLink v-for="b in buttons"
      :to="{ path: b.route }"
      class="nav-link">
    <button type="button" class="btn btn-primary m-2">{{ b.text }}</button></RouterLink>
    </div>
    </div>
   
</template>
