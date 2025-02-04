<script lang="ts" setup>
import { CourseScheduleEntry } from '@gym-manager/models';
import { useUserStore } from '@/store/user';
import { ref } from 'vue';

const store = useUserStore();

const props = defineProps<{ courseId: string, schedule: CourseScheduleEntry, booked: boolean }>();
const isBooked = ref(props.booked);
const availableSpots = ref(props.schedule.availableSpots);

async function bookCourse(courseId: string, dayOfWeek: string, startTime: string) {
    isBooked.value = await store.client.bookCourse(courseId, dayOfWeek, startTime);
    availableSpots.value--;
}

</script>

<template>
    <div class="d-flex flex-row justify-content-between my-3 main-container mx-auto">
        <div class="w-50 container">
            <p class="m-0">{{ schedule.dayOfWeek + ' ' + schedule.startTime }}</p>
            <p class="text-muted m-0">Available spots: {{ availableSpots }}</p>
        </div>
        <div class="w-50 d-flex justify-content-center align-items-center">
            <button type="button" class="btn btn-primary py-2 px-5" :disabled="isBooked || availableSpots <= 0"
                @click="() => bookCourse(courseId, schedule.dayOfWeek, schedule.startTime)">{{ isBooked ? 'Booked' : 'Book' }}</button>
        </div>
    </div>
</template>

<style>
.main-container {
    max-width: 500px;
    width: 100%;
}
</style>