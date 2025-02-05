<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useUserStore } from '@/store/user';
import { useNotificationsStore } from '@/store/notifications';
import SelectInput, { SelectInputValue } from '@/components/SelectInput.vue';
import Dropdown from '@/components/Dropdown.vue';
import DropdownItem from '@/components/DropdownItem.vue';

const store = useUserStore();
const notificationStore = useNotificationsStore();

const trainersList = ref<SelectInputValue[]>([]);
const selectedTrainer = ref<string>("");
const selectedDay = ref<string>("");
const selectedTime = ref<string>("");

const unavailableTimes = ref<Record<string, Record<string, string[]>>>({});
const availableTimeSlots = ref<Record<string, Record<string, string[]>>>({}); // **Ora dipende anche dal giorno della settimana**

// Giorni della settimana
const daysOfWeek = ref(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);

// **Computed: Restituisce gli orari disponibili per il trainer e giorno selezionato**
const availableTimeSlotsComputed = computed(() => {
    if (!selectedTrainer.value || !selectedDay.value) {
        return [];
    }
    return availableTimeSlots.value[selectedTrainer.value]?.[selectedDay.value] || [];
});

// **Caricamento lista trainer**
store.client.listTrainers()
    .then(trainers => {
        trainersList.value = trainers.map(trainer => ({
            id: trainer._id,
            label: `${trainer.firstName} ${trainer.lastName}`
        }));
    });

// **Caricare gli orari occupati e disponibili per un trainer**
async function loadUnavailableTimes(trainerId: string) {
    const occupiedTimes: Record<string, string[]> = {}; // Ogni giorno avrà una lista di orari occupati

    // **Carica i corsi**
    const courses = await store.client.getTrainerCourses(trainerId);
    courses.forEach(course => {
        if (!occupiedTimes[course.dayOfWeek]) {
            occupiedTimes[course.dayOfWeek] = [];
        }
        if (!occupiedTimes[course.dayOfWeek].includes(course.startTime)) {
            occupiedTimes[course.dayOfWeek].push(course.startTime);
        }
    });

    // **Carica le sessioni**
    const sessions = await store.client.getTrainerSessions(trainerId);
    sessions.forEach(session => {
        if (!occupiedTimes[session.info.dayOfWeek]) {
            occupiedTimes[session.info.dayOfWeek] = [];
        }
        if (!occupiedTimes[session.info.dayOfWeek].includes(session.info.startTime)) {
            occupiedTimes[session.info.dayOfWeek].push(session.info.startTime);
        }
    });

    // **Salva gli orari occupati**
    unavailableTimes.value = { ...unavailableTimes.value, [trainerId]: occupiedTimes };

    // **Calcola gli orari disponibili per ogni giorno**
    const availableTimesForTrainer: Record<string, string[]> = {};
    daysOfWeek.value.forEach(day => {
        const times: string[] = [];
        for (let hour = 9; hour <= 18; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`;
            if (!occupiedTimes[day]?.includes(time)) {
                times.push(time);
            }
        }
        availableTimesForTrainer[day] = times;
    });

    // **Salva gli orari disponibili per il trainer**
    availableTimeSlots.value = { ...availableTimeSlots.value, [trainerId]: availableTimesForTrainer };
}

// **Quando cambia il trainer selezionato, carica gli orari**
watch(selectedTrainer, (newTrainer) => {
    if (newTrainer) {
        loadUnavailableTimes(newTrainer);
    }
});

// **Forza il ricalcolo quando selectedTrainer, selectedDay, o unavailableTimes cambia**
watch([selectedTrainer, selectedDay, unavailableTimes, availableTimeSlots], () => {
}, { deep: true });

// **Funzione per prenotare una sessione**
async function bookSession() {
    console.log("Trainer ID:", selectedTrainer.value);
    console.log("Day:", selectedDay.value);
    console.log("Time:", selectedTime.value);

    if (!selectedTrainer.value || !selectedDay.value || !selectedTime.value) {
        notificationStore.fire({
            title: "Errore",
            body: "Seleziona un trainer, un giorno e un orario per prenotare la sessione.",
            background: "danger",
            when: new Date(),
        });
        return;
    }

    const success = await store.client.createSession(
        selectedTrainer.value,
        selectedDay.value,
        selectedTime.value
    );

    if (success) {
        notificationStore.fire({
            title: "Successo",
            body: "Sessione prenotata con successo!",
            background: "success",
            when: new Date(),
        });
    } else {
        notificationStore.fire({
            title: "Errore",
            body: "Errore durante la prenotazione della sessione.",
            background: "danger",
            when: new Date(),
        });
    }
}
</script>

<template>
    <h2>Book a One-on-One Session</h2>

    <Dropdown id="trainer-dropdown">
        <DropdownItem v-for="(trainer, i) in trainersList" :key="i"
            :header="[trainer.label]"
            v-model="selectedTrainer"
            :id-prefix="trainer.id" 
            :index="i" 
            :dropdown-id="'trainer-dropdown'">
            <dl>
                <dt>Select Day</dt>
                <dd>
                    <SelectInput id="dayOfWeek" v-model="selectedDay" :options="daysOfWeek">
                        Day of Week
                    </SelectInput>
                </dd>

                <dt>Select Time</dt>
                <dd>
                    <SelectInput id="startTime" v-model="selectedTime" :options="availableTimeSlotsComputed">
                        Start Time
                    </SelectInput>
                </dd>

                <button class="btn btn-primary mt-2" @click="bookSession">
                    Book Session
                </button>
            </dl>
        </DropdownItem>
    </Dropdown>
</template>
