<script lang="ts" setup>
import { isValidCapacity, isOnlyLetters } from '@/utils/validation';
import { computed, onMounted, ref, watch} from 'vue';
import { CreateCourseRequest } from "@gym-manager/models/course";
import ValidatingGenericInput from '@/components/ValidatingGenericInput.vue';
import SelectInput from '@/components/SelectInput.vue';
import { useCourseStore } from '../store/course';

const name = ref("");
const description = ref("");
const dayOfWeek = ref("");
const startTime = ref("");
const endTime = ref("");
const capacity = ref("");
const trainer = ref("");
const message = ref(""); 
const trainerId = ref("");
const trainersList = ref<string[]>([]);

const nameValid = ref(false);
const descriptionValid = ref(false);
const capacityValid = ref(false);


const submitButtonEnabled = computed(() => {
    return (
        name.value !== "" &&
        description.value !== "" &&
        dayOfWeek.value !== "" &&
        startTime.value !== "" &&
        endTime.value !== "" &&
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

// Orari disponibili (9:00 - 18:00)
const timeSlots = computed(() => {
    const times = [];
    for (let hour = 9; hour <= 18; hour++) {
        times.push(`${hour}:00`);
    }
    return times;
});
watch(startTime, (newStartTime) => {
    if (!newStartTime) {
        endTime.value = ""; // Resetta endTime se startTime è vuoto
        return;
    }
    const hour = parseInt(newStartTime.split(":")[0], 10);
    endTime.value = hour < 18 ? `${hour + 1}:00` : ""; // Calcola endTime
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
            dayOfWeek: dayOfWeek.value,
            startTime: startTime.value,
            endTime: endTime.value,
            capacity: capacity.value,
            trainer: trainerId.value,
        }

        console.log("request name: "+ request.name);
        console.log("request description: "+ request.description);
        console.log("request dayOfWeek: "+ request.dayOfWeek);
        console.log("request startTime: "+ request.startTime);
        console.log("request endTime: "+ request.endTime);
        console.log("request capacity: "+ request.capacity);
        console.log("request trainerId: "+ request.trainer);
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
     <div class="header-container">
        <BackButton buttonText="Back" />
        <PageTitle title="Gym Manager" />
    </div>
    <form id="courseForm">
        <h2>Creating {{ name === "" ? "a new course" : `${name}` }}</h2>

        <ValidatingGenericInput type="text" id="name" error-message="The name can only contain letters"
            :validation-function="isOnlyLetters" v-model="name" v-model:valid="nameValid">
            Name
        </ValidatingGenericInput>

        <ValidatingGenericInput type="text" id="description" error-message="The description can only contain letters"
            :validation-function="isOnlyLetters" v-model="description" v-model:valid="descriptionValid">
            Description
        </ValidatingGenericInput>

        
        <SelectInput id="dayOfWeek" v-model="dayOfWeek" :options="daysOfWeek">
         Day of Week
        </SelectInput>

        <SelectInput id="startTime" v-model="startTime" :options="timeSlots">
         Start Time
        </SelectInput>

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