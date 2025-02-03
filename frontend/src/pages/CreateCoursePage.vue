<script lang="ts" setup>
import { isValidCapacity, isOnlyLetters } from '@/utils/validation';
import { computed, onMounted, ref, watch } from 'vue';
import { CreateCourseRequest } from "@gym-manager/models/course";
import ValidatingGenericInput from '@/components/ValidatingGenericInput.vue';
import SelectInput from '@/components/SelectInput.vue';
import { useCourseStore } from '../store/course';
import Header from '@/components/Header.vue';

const name = ref("");
const description = ref("");
const capacity = ref("");
const trainer = ref("");
const message = ref("");
const trainerId = ref("");
const trainersList = ref<string[]>([]);
const scheduleEntries = ref<{ dayOfWeek: string, startTime: string, availableSpots: number }[]>([]);

const nameValid = ref(false);
const descriptionValid = ref(false);
const capacityValid = ref(false);


const submitButtonEnabled = computed(() => {
    return (
        name.value !== "" &&
        description.value !== "" &&
        scheduleEntries.value.length > 0 &&
        capacity.value !== "" &&
        trainer.value !== "" &&
        trainerId.value !== "" &&
        descriptionValid.value &&
        capacityValid.value &&
        nameValid.value
    );
});

// Giorni della settimana
const daysOfWeek = ref(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);

// Orari disponibili (09:00 - 18:00)
const timeSlots = computed(() => {
    const times = [];
    for (let hour = 9; hour <= 18; hour++) {
        times.push(`${hour.toString().padStart(2, '0')}:00`); //padding iniziale per avere 09:00
    }
    return times;
});
// Aggiungi un nuovo giorno/orario
const addScheduleEntry = () => {
    scheduleEntries.value.push({ dayOfWeek: "", startTime: "", availableSpots: 0 });
};

// Rimuovi un giorno/orario
const removeScheduleEntry = (index: number) => {
    scheduleEntries.value.splice(index, 1);
};
// Watch per aggiornare availableSpots quando cambia capacity
watch(capacity, (newCapacity) => {
    const numericCapacity = Number(newCapacity);
    if (!isNaN(numericCapacity)) {
        scheduleEntries.value = scheduleEntries.value.map(entry => ({
            ...entry,
            availableSpots: numericCapacity
        }));
    }
});
watch(trainer, async (newTrainer) => {
    if (!newTrainer) {
        trainerId.value = ""; // Resetta trainerId se trainer è vuoto
        return;
    }

    // Chiama fetchTrainerId per ottenere il trainerId
    await fetchTrainerId();
});


async function fetchAllTrainers() {
    try {
        const response = await fetch(`/trainers`);
        if (!response.ok) throw new Error("Error retrieving trainers");
        const trainers = await response.json();
        // Estrai gli username e aggiorna la lista dei trainer
        trainersList.value = trainers.map((trainer: { username: String; }) => trainer.username);
    } catch (error) {
        console.error('Error retrieving trainers:', error);
        message.value = "Error retrieving trainers";
    }
}
async function fetchTrainerId() {
    try {
        const response = await fetch(`/trainers/trainerId/${trainer.value}`);
        if (!response.ok) throw new Error("Error retrieving trainer id");
        const id = await response.json();
        // Estrai gli username e aggiorna la lista dei trainer
        trainerId.value = id;
    } catch (error) {
        console.error('Error retrieving trainer id:', error);
        message.value = "Error retrieving trainer id";
    }
}
onMounted(() => {
    fetchAllTrainers(); // Recupera i trainer quando il form si carica
});
const course = useCourseStore().course;
async function handleCreateCourse() {
    try {
    
        // Creazione dell'oggetto JSON con i dati del cliente
        const request: CreateCourseRequest = {
            name: name.value,
            description: description.value,
            schedule: scheduleEntries.value,
            capacity: Number(capacity.value),
            trainer: trainerId.value,
        }
        // Effettua la richiesta POST per creare il cliente
        const response = await course.addCourse(request);

        if (response.status === 201) {
            message.value = "Course successfully created!";
        } else {
            message.value = "Error during course creation";
        }
    } catch (error) {
        console.error("Error during course creation:", error);
        message.value = "Error during course creation";
    }

}


</script>

<template>
    <Header>
        <h2>Creating {{ name === "" ? "a new course" : `${name}` }}</h2>
    </Header>

    <form>
        <ValidatingGenericInput type="text" id="name" error-message="The name can only contain letters"
            :validation-function="isOnlyLetters" v-model="name" v-model:valid="nameValid">
            Name
        </ValidatingGenericInput>

        <ValidatingGenericInput type="text" id="description" error-message="The description can only contain letters"
            :validation-function="isOnlyLetters" v-model="description" v-model:valid="descriptionValid">
            Description
        </ValidatingGenericInput>

        <div>Schedule</div>
        <div v-for="(entry, index) in scheduleEntries" :key="index" class="schedule-entry">
            <SelectInput :id="'dayOfWeek' + index" v-model="entry.dayOfWeek" :options="daysOfWeek">
                Day of Week
            </SelectInput>

            <SelectInput :id="'startTime' + index" v-model="entry.startTime" :options="timeSlots">
                Start Time
            </SelectInput>

            <button type="button" class="btn btn-danger" @click="removeScheduleEntry(index)">Remove</button>
        </div>
        <button type="button" class="btn btn-secondary" @click="addScheduleEntry">Add Schedule Entry</button>

        <br>
        <ValidatingGenericInput type="text" id="capacity" error-message="The course must have at least one participant"
            :validation-function="isValidCapacity" v-model="capacity" v-model:valid="capacityValid">
            Spots Available
        </ValidatingGenericInput>

        <SelectInput id="trainer" v-model="trainer" :options="trainersList">
            Trainer
        </SelectInput>


        <button class="btn btn-primary" type="button" @click="handleCreateCourse()"
            :disabled="!submitButtonEnabled">Create Course {{ name }}</button>

        <p v-if="message">
            {{ message }}
        </p>

    </form>

</template>