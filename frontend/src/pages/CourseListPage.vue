<script setup lang="ts">
import CourseAvailabilityWatcher, { CourseAvailabilityUpdate } from '@/components/CourseAvailabilityWatcher.vue';
import ListView from '@/components/ListView.vue';
import router from '@/routes/router';
import { useModalsStore } from '@/store/modals';
import { useNotificationsStore } from '@/store/notifications';
import { useUserStore } from '@/store/user';
import { ListData, RowData } from '@/utils/lists';
import { Course, Trainer, User } from '@gym-manager/models';
import { computed, ref } from 'vue';

function displayableCourseFormatter(c: Course): RowData {
    return {
        id: c.id,
        name: c.name,
        description: c.description,
        trainer: c.trainer,
        schedule: c.schedule.map(x => `${x.dayOfWeek} ${x.startTime} (available slots: ${x.availableSpots}/${c.capacity})`),
    };
}

const client = useUserStore().client;
const confirm = useModalsStore().confirm;
const notification = useNotificationsStore();
const courses = ref<Array<Course>>([]);
const displayableCourses = computed(() => courses.value.map(displayableCourseFormatter));

client.listCourses()
    .then(courses => Promise.all(courses.map(c =>
        client.getTrainerById(c.trainer)
            .then(t => ({ ...c, trainer: `${t!.firstName} ${t!.lastName}` }))
    ))
    ).then(x => courses.value = x);


const data = computed<ListData>((): ListData => {
    return {
        actions: [
            { action: edit, colour: "primary", label: "Edit" },
            { action: del, colour: "danger", label: "Delete" },
        ],
        data: displayableCourses.value,
        headers: [
            { key: "name", name: "Name" },
            { key: "description", name: "Description" },
            { key: "trainer", name: "Trainer" },
            { key: "schedule", name: "Schedule" },
        ]
    };
});
const edit = (d: Course | RowData) => router.push({ path: '/admin/updateCourse/' + d.id })
const del = async (d: Course | RowData) => {
    if (await confirm(`Are you sure you want to delete the course "${d.name}"?`)) {
        client.deleteCourse(d.id as string).then(r => {
            if (r) {
                courses.value = courses.value.filter(c => c.id != d.id)
                notification.fire({
                    title: 'Success',
                    body: 'Course deleted successfully!',
                    background: 'success',
                    when: new Date(),
                });
            } else {
                notification.fire({
                    title: 'Error',
                    body: 'Error while deleting the course',
                    background: 'danger',
                    when: new Date(),
                });
            }
        });
    }
}

const mobileHeader = (d: Course | RowData) =>
    `${d.name} (${d.trainer})`;

const filter = (d: Course | RowData, s: string) =>
    (d as Course).name.toLocaleLowerCase().indexOf(s.toLowerCase()) >= 0 ||
    (d as Course).description.toLocaleLowerCase().indexOf(s.toLowerCase()) >= 0 ||
    (d as Course).trainer.toLocaleLowerCase().indexOf(s.toLowerCase()) >= 0;

function handlePush(update: CourseAvailabilityUpdate) {
    const courseIndex = courses.value.findIndex((x) => x.id === update.course);
    if (courseIndex !== -1) {
        const scheduleIndex = courses.value[courseIndex].schedule.findIndex(x => x.dayOfWeek == update.dayOfWeek && x.startTime == update.startTime);
        if (scheduleIndex !== -1) {
            courses.value[courseIndex].schedule[scheduleIndex].availableSpots += update.availability;
        }
    }
}

</script>
<template>
    <h2>All courses</h2>
    <ListView :data="data" :mobile-header="mobileHeader" :filter-function="filter"></ListView>
    <CourseAvailabilityWatcher @update="handlePush"></CourseAvailabilityWatcher>
</template>