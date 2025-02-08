<script lang="ts" setup>
import { CourseScheduleEntry } from '@gym-manager/models';
import { useUserStore } from '@/store/user';
import { useNotificationsStore } from '@/store/notifications';
import { computed, ref } from 'vue';

const client = useUserStore().client;
const notifications = useNotificationsStore();

const props = defineProps<{ courseId: string, schedule: CourseScheduleEntry, booked: boolean }>();
const isBooked = ref(props.booked);
const availableSpots = computed(() => props.schedule.availableSpots);

async function bookCourse(courseId: string, dayOfWeek: string, startTime: string) {
    const response = await client.bookCourse(courseId, {
        dayOfWeek: dayOfWeek,
        startTime: startTime,
        clientId: client.userDetails?._id
    });
    if (response) {
        isBooked.value = true;
        notifications.fire({
            title: 'Success',
            body: 'Course successfully booked!',
            background: 'success',
            when: new Date(),
        });
    } else {
        notifications.fire({
            title: 'Error',
            body: 'This course could not be found',
            background: 'danger'
        })
    }

}

</script>

<template>
    <div class="d-flex flex-row justify-content-between my-3 mx-auto">
        <div class="w-50 container">
            <p class="m-0">{{ schedule.dayOfWeek + ' ' + schedule.startTime }}</p>
            <p class="text-muted m-0">Available spots: {{ availableSpots }}</p>
        </div>
        <div class="w-50 d-flex justify-content-center align-items-center">
            <button type="button" class="btn btn-primary py-2 px-5" :disabled="isBooked || availableSpots! <= 0"
                @click="() => bookCourse(courseId, schedule.dayOfWeek, schedule.startTime)">{{ isBooked ? 'Booked' :
                    'Book' }}</button>
        </div>
    </div>
</template>