<script lang="ts" setup>
import { CourseScheduleEntry } from '@gym-manager/models';
import { useUserStore } from '@/store/user';

const store = useUserStore();

const props = defineProps<{ courseId: string, schedule: CourseScheduleEntry, booked: boolean }>();

async function bookCourse(courseId: string, dayOfWeek: string, startTime: string) {
    // TODO
}

</script>

<template>
    <div class="d-flex flex-row justify-content-between my-3 main-container mx-auto">
        <div class="w-50 container">
            <p class="m-0">{{ schedule.dayOfWeek + ' ' + schedule.startTime }}</p>
            <p class="text-muted m-0">Available spots: {{ schedule.availableSpots }}</p>
        </div>
        <div class="w-50 d-flex justify-content-center align-items-center">
            <button type="button" class="btn btn-primary py-2 px-5" @click="() => bookCourse(courseId, schedule.dayOfWeek, schedule.startTime)">Book</button>
        </div>
    </div>
</template>

<style>
.main-container {
    max-width: 500px;
    width: 100%;
}
</style>