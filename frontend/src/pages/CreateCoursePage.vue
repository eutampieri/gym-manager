<script lang="ts" setup>
import { isValidCapacity, isOnlyLetters } from '@/utils/validation';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { CourseScheduleEntry, CreateCourseRequest } from "@gym-manager/models/course";
import ValidatingGenericInput from '@/components/ValidatingGenericInput.vue';
import { SelectInputValue } from '@/components/SelectInput.vue';
import { useUserStore } from '@/store/user';
import SelectInput from '@/components/SelectInput.vue';
import { useNotificationsStore } from '@/store/notifications';

const name = ref("");
const description = ref("");
const capacityString = ref("");
const capacity = computed(() => parseInt(capacityString.value));
const trainer = ref("");
const allTrainers = ref<SelectInputValue[]>([]);
const scheduleEntries = ref<CourseScheduleEntry[]>([]);

const scheduleEntriesDays = computed(() => scheduleEntries.value.map(computeDays));
const scheduleEntriesHours = computed(() => scheduleEntries.value.map(computeHours));
const trainersList = computed(() => allTrainers.value.map(t => ({ ...t, selected: t.id == trainer.value })));

const nameValid = ref(false);
const descriptionValid = ref(false);
const capacityValid = ref(false);

const submitButtonEnabled = computed(() => {
    return (
        name.value !== "" &&
        description.value !== "" &&
        scheduleEntries.value.length > 0 &&
        capacity.value > 0 &&
        trainer.value !== "" &&
        descriptionValid.value &&
        capacityValid.value &&
        nameValid.value
    );
});

const client = useUserStore().client;
const notification = useNotificationsStore();

const props = defineProps<{ id?: string }>();

if (props.id) {
    client.getCourseById(props.id).then(r => {
        if (r) {
            name.value = r.name;
            description.value = r.description;
            capacityString.value = r.capacity.toString();
            trainer.value = r.trainer;
            scheduleEntries.value = r.schedule;
        } else {
            notification.fire({
                title: 'Error',
                body: 'This course could not be found',
                background: 'danger'
            })
        }
    })
}
// Giorni della settimana
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Orari disponibili (09:00 - 18:00)
// const timeSlots = computed(() => {
//     const times = [];
//     for (let hour = 9; hour <= 18; hour++) {
//         times.push(`${hour.toString().padStart(2, '0')}:00`); //padding iniziale per avere 09:00
//     }
//     return times;
// });
// Orari disponibili (09:00 - 18:00)
const timeSlots = Array(10).fill(9).map((x, i) => x + i).map(h => `${h.toString().padStart(2, '0')}:00`);

function computeDays(entry: CourseScheduleEntry): SelectInputValue[] {
    return daysOfWeek.map(s => ({ id: s, label: s, selected: entry.dayOfWeek == s }))
}
function computeHours(entry: CourseScheduleEntry): SelectInputValue[] {
    return timeSlots.map(s => ({ id: s, label: s, selected: entry.startTime == s }))
}

// Aggiungi un nuovo giorno/orario
const addScheduleEntry = () => {
    scheduleEntries.value.push({ dayOfWeek: "", startTime: "", participants: [], availableSpots: 0 });
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

client.listTrainers()
    .then(x => x.map((y => { return { id: y.id, label: `${y.firstName} ${y.lastName}` }; })))
    .then(x => allTrainers.value = x);

const createRequest = () => ({
        name: name.value,
        description: description.value,
        schedule: scheduleEntries.value,
        capacity: capacity.value,
        trainer: trainer.value,
    }) as CreateCourseRequest;

async function handleUpdateCourse() {
    try {
        const request = createRequest();
        const id = props.id!;
        const response = await client.updateCourse(id, request);

        if (response) {
            notification.fire({
                title: 'Success',
                body: `Course "${name.value}" successfully updated!`,
                background: 'success',
                when: new Date(),
            });
        } else {
            throw new Error();
        }
    } catch (error) {
        notification.fire({
            title: 'Error',
            body: 'Error while updating the course',
            background: 'danger',
            when: new Date(),
        });
    }
}
async function handleCreateCourse() {
    try {
        const request = createRequest();
        const response = await client.addCourse(request);

        if (response) {
            notification.fire({
                title: 'Success',
                body: `Course "${name.value}" successfully created!`,
                background: 'success',
                when: new Date(),
            });
        } else {
            throw new Error();
        }
    } catch (error) {
        notification.fire({
            title: 'Error',
            body: 'Error while creating course',
            background: 'danger',
            when: new Date(),
        });
    }
}
</script>

<template>
    <h2 v-if="props.id">Update {{ name != '' ? name : 'Course' }}</h2>
    <h2 v-else>Create {{ name != '' ? name : 'a new Course' }}</h2>
    <form>
        <ValidatingGenericInput type="text" id="name" error-message="The name can only contain letters"
            :validation-function="isOnlyLetters" v-model="name" v-model:valid="nameValid">
            Name
        </ValidatingGenericInput>

        <ValidatingGenericInput type="text" id="description" error-message="The description can only contain letters"
            :validation-function="isOnlyLetters" v-model="description" v-model:valid="descriptionValid">
            Description
        </ValidatingGenericInput>

        <h3 class="fs-5">Schedule</h3>
        <div>
            <div v-for="(entry, index) in scheduleEntries" :key="index" class="schedule-entry">
                <SelectInput :id="'dayOfWeek' + index" v-model="entry.dayOfWeek" :options="scheduleEntriesDays[index]">
                    Day of Week
                </SelectInput>
    
                <SelectInput :id="'startTime' + index" v-model="entry.startTime" :options="scheduleEntriesHours[index]">
                    Start Time
                </SelectInput>
    
                <button type="button" class="btn btn-danger" @click="removeScheduleEntry(index)">Remove</button>
            </div>
            <button type="button" class="btn btn-secondary" @click="addScheduleEntry">Add Schedule Entry</button>
        </div>

        <ValidatingGenericInput type="text" id="capacity" error-message="The course must have at least one participant"
            :validation-function="isValidCapacity" v-model="capacityString" v-model:valid="capacityValid">
            Capacity
        </ValidatingGenericInput>

        <SelectInput id="trainer" v-model="trainer" :options="trainersList">
            Trainer
        </SelectInput>

        <button v-if="props.id" class="btn btn-primary" type="button" @click="handleUpdateCourse"
            :disabled="!submitButtonEnabled">Update Course {{ name }}</button>
        <button v-else class="btn btn-primary" type="button" @click="handleCreateCourse"
            :disabled="!submitButtonEnabled">Create Course {{ name }}</button>
    </form>
</template>