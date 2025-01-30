<script lang="ts" setup>
import { ref } from 'vue';
import Form from '@/components/Form.vue';
import { ValidatingFormField } from '@/utils/form';
const name = ref("");
const description = ref("");
const dayOfWeek = ref("");
const startTime = ref("");
const endTime = ref("");
const capacity = ref("");
const id = ref("");
const trainer = ref("");
const message = ref("");
function isOnlyLetters(id: string) {
    return /^[a-zA-Z]+$/.test(id);
}
function isOnlyNumbers(id: string) {
    return /^\d+$/.test(id);
}

async function fetchTrainerId(trainerUsername: string) {
    if (!isOnlyLetters(trainerUsername)) {
        message.value = "Username of the trainer can only contain letters";
        return;
    }
    try {
        if (!trainerUsername) {
            message.value = "Inserisci un trainer";
            return;
        }

        // FUNZIONE fetchTrainerIdByUsername
        const response = await fetch(`/trainers/trainerId/${trainerUsername}`);

        if (response.ok) {
            const trainerId = await response.json();
            console.log("Trainer ID:", trainerId);
            return trainerId;
        } else {
            message.value = "Trainer not found";
        }
    } catch (error) {
        console.error('Error fetching trainer ID:', error);
        message.value = "Trainer not found";
    }
}
async function checkId(id: string) {
    if (!isOnlyNumbers(id)) {
        message.value = "Id can only contain numbers";
        return true;
    }
    try {
        // FUNZIONE isCourseidPresent
        const response = await fetch(`/courses/checkId/${id}`);
        if (response.ok) {
            const check = await response.json();
            return check;
        }
        else {
            message.value = "Error in checking id";
        }
    } catch (error) {
        console.error('Errore nel check dell id:', error);
        message.value = "Error in checking id";
    }
}
async function handleCreateCourse() {
    message.value = "";
    await fetchTrainerId(trainer.value);  // Controlla il trainer
    await checkId(id.value);              // Controlla l'ID del corso
    if (!isOnlyLetters(name.value)) {
        message.value = "Name can only contain letters";
        return;
    }
    const validDaysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (!validDaysOfWeek.includes(dayOfWeek.value)) {
        message.value = "Day of week not valid";
        return;
    }
    if (endTime.value <= startTime.value) {
        message.value = "Enter the correct times";
        return;
    }
    if (parseInt(endTime.value.split(':')[1]) !== 0 || parseInt(startTime.value.split(':')[1]) !== 0) {
        message.value = "The times must be in the format hh:00";
        return;
    }
    if (parseInt(endTime.value.split(':')[0]) !== parseInt(startTime.value.split(':')[0]) + 1) {
        message.value = "The courses must last one hour";
        return;
    }
    if (parseInt(capacity.value) < 1) {
        message.value = "The course must have at least one participant";
        return;
    }
    // Verifica se l'ID è già usato
    const idExists = await checkId(id.value);
    if (idExists) {
        message.value = "Id already in use";
        return;
    }

    try {
        // Ottieni l'ID del trainer
        const trainerId = await fetchTrainerId(trainer.value);
        if (!trainerId) {
            message.value = "Trainer not found";
            return;
        }

        // Crea il JSON del corso
        const formData = new FormData();
        formData.set('name', name.value);
        formData.set('description', description.value);
        formData.set('dayOfWeek', dayOfWeek.value);
        formData.set('startTime', startTime.value);
        formData.set('endTime', endTime.value);
        formData.set('capacity', capacity.value);
        formData.set('id', id.value);
        formData.set('trainer', trainerId);

        let courseData: Record<string, string> = {};
        formData.forEach((value, key) => {
            courseData[key] = value as string;
        });

        // Crea il corso nel backend
        const response = await fetch('/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courseData)
        });

        if (response.status === 201) {
            // Recupera l'ID del corso creato
            const courseResponse = await fetch(`/courses/_id/id/${id.value}`);
            if (!courseResponse.ok) throw new Error("Error retrieving course ID");
            const courseId = await courseResponse.json();

            // Associa il corso al trainer
            const trainerCourseResponse = await fetch(`/trainers/courses/add/${trainerId}/${courseId}`);
            if (!trainerCourseResponse.ok) throw new Error("Error adding course to trainer");

            message.value = "Course successfully created!";
        } else {
            message.value = "errore nella creazione del corso"
        }
    } catch (error) {
        console.error("Error in creating course:", error);
        message.value = "Error in creating course";
    }


}
const fields: ValidatingFormField[] = [
    {
        errorMessage: 'pizza',
        validatingFunction: function (value: string): boolean {
            return true;
        },
        statusBinding: ref(),
        id: 'zsf',
        label: 'asasa',
        type: 'text',
        binding: ref()
    }
];
</script>
<template>
    <div id="message" style="color: red;">{{ message }}</div> <!-- Div per il messaggio di successo/insuccesso -->
    <form id="courseForm">
        <h2>Creazione di {{ name === "" ? "un nuovo corso" : name }}</h2>
        <Form :fields="fields"></Form>
        <div class="mb-3">
            <label class="form-label" for="name">Name:</label>
            <input class="form-control" type="text" id="name" v-model="name">
        </div>

        <div class="mb-3">
            <label class="form-label" for="description">Description:</label>
            <input class="form-control" type="text" id="description" v-model="description">
        </div>

        <div class="mb-3">
            <label class="form-label" for="dayOfWeek">Day of Week:</label>
            <input class="form-control" type="text" id="dayOfWeek" v-model="dayOfWeek">
        </div>

        <div class="mb-3">
            <label class="form-label" for="startTime">Start Time:</label>
            <input class="form-control" type="time" id="startTime" v-model="startTime">
        </div>

        <div class="mb-3">
            <label class="form-label" for="endTime">End Time:</label>
            <input class="form-control" type="time" id="endTime" v-model="endTime">
        </div>

        <div class="mb-3">
            <label class="form-label" for="capacity">Capacity:</label>
            <input class="form-control" type="number" id="capacity" v-model="capacity">
        </div>

        <div class="mb-3">
            <label class="form-label" for="id">ID:</label>
            <input class="form-control" type="number" id="id" v-model="id">
        </div>

        <div class="mb-3">
            <label class="form-label" for="trainer">Username del trainer:</label>
            <input class="form-control" type="text" id="trainer" v-model="trainer">
        </div>

        <button class="btn btn-primary" type="button" @click="handleCreateCourse()">Create Course {{ name }}</button>

    </form>

</template>