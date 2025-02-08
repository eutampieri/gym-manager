<script setup lang="ts">
import SelectInput from '@/components/SelectInput.vue';
import { useNotificationsStore } from '@/store/notifications';
import { useUserStore } from '@/store/user';
import { computed, ref } from 'vue';
import { TrainerAvailabilities } from '@gym-manager/models/trainer';
import router from '@/routes/router';

const { trainerId, trainerAvailabilities, customerAvailabilities } = defineProps<{ 
    trainerId: string, 
    trainerAvailabilities: TrainerAvailabilities | null, 
    customerAvailabilities: TrainerAvailabilities | undefined
}>();

const notificationStore = useNotificationsStore();
const client = useUserStore().client;
const daysOfWeek = ref(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);

const selectedDay = ref("");
const selectedTime = ref("");

const isCustomerAvailable = (day: string, time: string) => {
    if (customerAvailabilities) {
        return customerAvailabilities[day][time];
    } else {
        return true;
    }
}

const availableTimeSlots = computed(() => (trainerAvailabilities === null || selectedDay.value === '') ? [] : Object.entries(trainerAvailabilities[selectedDay.value])
    .filter(x => x[1] && isCustomerAvailable(selectedDay.value, x[0]))
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
            participant: client.userDetails!._id,
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
        router.back();
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