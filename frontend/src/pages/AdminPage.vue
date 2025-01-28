<script lang="ts" setup>
import { ref } from 'vue';

const buttons = [
    {text: "Create Trainer", route: "/admin/trainer/add",},
    {text: "Delete Trainer", route: "/admin",},
    {text: "Update Trainer", route: "/admin",},
    {text: "Create Client", route: "/admin",},
    {text: "Delete Client", route: "/admin",},
    {text: "Update Client", route: "/admin",},
    {text: "Create Course", route: "/admin",},
    {text: "Delete Course", route: "/admin",},
    {text: "Update Course", route: "/admin",},
];
const name = ref("");
const description = ref("");
const dayOfWeek = ref("");
const startTime = ref("");
const endTime = ref("");
const capacity = ref("");
const id = ref("");
const trainer = ref("");

async function pizza() {
    await fetch("/api/course", {method: "POST", body: JSON.stringify({name: name})})
}
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
    <form id="courseForm">
<h2>Creazione di {{ name === "" ? "un nuovo corso" : name }}</h2>
<div class="mb-3">
<label class="form-label"for="name">Name:</label>
<input class="form-control"type="text" id="name" v-model="name">
</div>

<div class="mb-3">
<label class="form-label"for="description">Description:</label>
<input class="form-control"type="text" id="description" v-model="description">
</div>

<div class="mb-3">
<label class="form-label"for="dayOfWeek">Day of Week:</label>
<input class="form-control"type="text" id="dayOfWeek" v-model="dayOfWeek">
</div>

<div class="mb-3">
<label class="form-label"for="startTime">Start Time:</label>
<input class="form-control"type="time" id="startTime" v-model="startTime">
</div>

<div class="mb-3">
<label class="form-label"for="endTime">End Time:</label>
<input class="form-control"type="time" id="endTime" v-model="endTime">
</div>

<div class="mb-3">
<label class="form-label"for="capacity">Capacity:</label>
<input class="form-control"type="number" id="capacity" v-model="capacity">
</div>

<div class="mb-3">
<label class="form-label"for="id">ID:</label>
<input class="form-control"type="number" id="id" v-model="id">
</div>

<div class="mb-3">
<label class="form-label"for="trainer">Username del trainer:</label>
<input class="form-control"type="text" id="trainer" v-model="trainer">
</div>

<button class="btn btn-primary">Create Course {{name }}</button>

</form>

</template>
