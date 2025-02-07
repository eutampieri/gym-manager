<script setup lang="ts">
import SelectInput from '@/components/SelectInput.vue';
import { useNotificationsStore } from '@/store/notifications';
import { useUserStore } from '@/store/user';
import { computed, ref } from 'vue';
import { TrainerAvailabilities } from '@gym-manager/models/trainer';

const { trainerId, availabilities } = defineProps<{ trainerId: string, availabilities: TrainerAvailabilities | null }>();

const notificationStore = useNotificationsStore();
const client = useUserStore().client;
const daysOfWeek = ref(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);

const selectedDay = ref("");
const selectedTime = ref("");
const availableTimeSlots = computed(() => (availabilities === null || selectedDay.value === '') ? [] : Object.entries(availabilities[selectedDay.value])
    .filter(x => x[1])
    .map(x => x[0]));

async function bookSession() {

    if (!trainerId || !selectedDay.value || !selectedTime.value) {
        notificationStore.fire({
            body: "Select a trainer, a day and a time slot to book the one-on-one session.",
            background: "danger",
        });
        return;
    }

    const success = await client.createSession(
        {
            participant: client.userDetails!.id,
            trainer: trainerId,
            dayOfWeek: selectedDay.value,
            startTime: selectedTime.value,
        }
    );

    if (success) {
        notificationStore.fire({
            body: "Session booked successfuly!",
            background: "success",
        });
    } else {
        notificationStore.fire({
            body: "An error occoured during the booking operation.",
            background: "danger",
        });
    }
}

</script>
<template>
    <dl>
        <dt>Select Day</dt>
        <dd>
            <SelectInput :id="'dayOfWeek' + trainerId" v-model="selectedDay" :options="daysOfWeek">
                Day of Week
            </SelectInput>
        </dd>

        <dt>Select Time</dt>
        <dd>
            <SelectInput :id="'startTime' + trainerId" v-model="selectedTime" :options="availableTimeSlots">
                Start Time
            </SelectInput>
        </dd>

    </dl>
    <button class="btn btn-primary mt-2" @click="bookSession">
        Book Session
    </button>

</template>