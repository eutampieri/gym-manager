<script lang="ts" setup>
import { ref, computed } from 'vue';
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

// Giorni della settimana
const daysOfWeek = ref(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);

// Orari disponibili (09:00 - 18:00)
const timeSlots = computed(() => {
    const times = [];
    for (let hour = 9; hour <= 18; hour++) {
        times.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return times;
});

// Caricamento lista trainer
store.client.listTrainers()
    .then(trainers => {
        trainersList.value = trainers.map(trainer => ({
            id: trainer._id,
            label: `${trainer.firstName} ${trainer.lastName}`
        }));
    });

// Funzione per prenotare una sessione
async function bookSession() {
    console.log(selectedTrainer);
    console.log(selectedDay);
    console.log(selectedTime);
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
            :dropdown-id="'trainer-dropdown'"
          
            >
            <dl>
              
                <dt>Select Day</dt>
                <dd>
                    <SelectInput id="dayOfWeek" v-model="selectedDay" :options="daysOfWeek">
                        Day of Week
                    </SelectInput>
                </dd>

                <dt>Select Time</dt>
                <dd>
                    <SelectInput id="startTime" v-model="selectedTime" :options="timeSlots">
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
