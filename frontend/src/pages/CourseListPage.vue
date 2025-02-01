<script setup lang="ts">
import ListView from '@/components/ListView.vue';
import { useUserStore } from '@/store/user';
import { ListData, RowData } from '@/utils/lists';
import { Course, User } from '@gym-manager/models';
import { computed, ref } from 'vue';

function displayableCourseFormatter(c: Course): RowData {
    return {
        name: c.name,
        description: c.description,
        dateTime: [`${c.dayOfWeek} ${c.startTime}-${c.endTime}`, `${c.dayOfWeek} ${c.startTime}-${c.endTime}`, `${c.dayOfWeek} ${c.startTime}-${c.endTime}`],
        trainer: c.trainer,
        capacityStatus: `${c.capacity - c.participants.length}/${c.capacity}`,
    };
}

const client = useUserStore().client;
const courses = ref<Array<Course>>([]);
const displayableCourses = computed(() => courses.value.map(displayableCourseFormatter));

client.listCourses().then(x => courses.value = x);


const data = computed<ListData>((): ListData => {
    return {
        actions: [
            { action: (d) => alert("Edit"), colour: "primary", label: "Edit" },
            { action: (d) => alert("Delete"), colour: "danger", label: "Delete" },
        ],
        data: displayableCourses.value,
        headers: [
            { key: "name", name: "Name" },
            { key: "description", name: "Description" },
            { key: "dateTime", name: "Date and time" },
            { key: "trainer", name: "Trainer" },
            { key: "capacityStatus", name: "Enrolled/Capacity" },
        ]
    };
});

const mobileHeader = (d: Course | RowData) =>
    `${d.name} (${d.trainer})`;

const filter = (d: Course | RowData, s: string) =>
    (d as Course).name.toLocaleLowerCase().indexOf(s.toLowerCase()) >= 0 ||
    (d as Course).description.toLocaleLowerCase().indexOf(s.toLowerCase()) >= 0 ||
    (d as Course).trainer.toLocaleLowerCase().indexOf(s.toLowerCase()) >= 0;

</script>
<template>
    <h2>All courses</h2>
    <ListView :data="data" :mobile-header="mobileHeader" :filter-function="filter"></ListView>
</template>