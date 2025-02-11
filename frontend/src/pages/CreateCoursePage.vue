<script lang="ts" setup>
import { isValidCapacity, isOnlyLetters } from '@/utils/validation';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { CourseScheduleEntry, CreateCourseRequest } from "@gym-manager/models/course";
import ValidatingGenericInput from '@/components/ValidatingGenericInput.vue';
import { SelectInputValue } from '@/components/SelectInput.vue';
import { useUserStore } from '@/store/user';
import SelectInput from '@/components/SelectInput.vue';
import { useNotificationsStore } from '@/store/notifications';
import SectionContainer from '@/components/SectionContainer.vue';
import SectionContainerItem from '@/components/SectionContainerItem.vue';
import TextAreaInput from '@/components/TextAreaInput.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

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
const capacityValid = ref(false);

const submitButtonEnabled = computed(() => {
    return (
        name.value !== "" &&
        description.value !== "" &&
        scheduleEntries.value.length > 0 &&
        capacity.value > 0 &&
        trainer.value !== "" &&
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
const timeSlots = Array(10).fill(9).map((x, i) => x + i).map(h => `${h.toString().padStart(2, '0')}:00`);
function computeDays(entry: CourseScheduleEntry): SelectInputValue[] {
    return daysOfWeek.map(s => ({ id: s, label: s, selected: entry.dayOfWeek == s }))
}
function computeHours(entry: CourseScheduleEntry): SelectInputValue[] {
    return timeSlots.map(s => ({ id: s, label: s, selected: entry.startTime == s }))
}

// Aggiungi un nuovo giorno/orario
const addScheduleEntry = () => {
    scheduleEntries.value.push({ dayOfWeek: "", startTime: "", participants: [], availableSpots: undefined });
};
// Rimuovi un giorno/orario
const removeScheduleEntry = (index: number) => {
    scheduleEntries.value.splice(index, 1);
};
const correctSchedule = (cap: number, schedules: CourseScheduleEntry[]) => schedules.map(e => ({ ...e, availableSpots: cap }))

// Watch per aggiornare availableSpots quando cambia capacity
watch(capacity, (newCapacity) => {
    const numericCapacity = Number(newCapacity);
    if (!isNaN(numericCapacity)) {
        scheduleEntries.value = correctSchedule(numericCapacity, scheduleEntries.value);
    }
});

client.listTrainers()
    .then(x => x.map((y => { return { id: y._id, label: `${y.firstName} ${y.lastName}` }; })))
    .then(x => allTrainers.value = x);

const createRequest = () => ({
    name: name.value,
    description: description.value,
    schedule: correctSchedule(capacity.value, scheduleEntries.value),
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
            router.back();
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
            router.back();
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
    <h2 v-if="props.id" class="text-center">Update {{ name != '' ? name : 'Course' }}</h2>
    <h2 v-else class="text-center">Create {{ name != '' ? name : 'a new Course' }}</h2>
    <SectionContainer>
        <SectionContainerItem>
            <form>
                <ValidatingGenericInput type="text" id="name" error-message="The name can only contain letters"
                    :validation-function="isOnlyLetters" v-model="name" v-model:valid="nameValid">
                    Name
                </ValidatingGenericInput>
                <SelectInput id="trainer" v-model="trainer" :options="trainersList">
                    Trainer
                </SelectInput>

                <TextAreaInput type="text" id="description" label="Description" v-model="description" />

                <h3 class="fs-5">Schedule</h3>
                <div class="d-flex flex-column">
                    <div v-for="(entry, index) in scheduleEntries" :key="index"
                        :class="`schedule-entry d-flex justify-content-center align-content-center pb-1 ${index != 0 ? 'pt-3 border-top' : ''}`">
                        <div class="d-flex flex-column col-8">
                            <SelectInput :id="'dayOfWeek' + index" v-model="entry.dayOfWeek"
                                :options="scheduleEntriesDays[index]">
                                Day of Week
                            </SelectInput>
                            <SelectInput :id="'startTime' + index" v-model="entry.startTime"
                                :options="scheduleEntriesHours[index]">
                                Start Time
                            </SelectInput>
                        </div>
                        <button type="button" class="btn btn-danger m-3 align-self-center"
                            @click="removeScheduleEntry(index)">Remove</button>
                    </div>
                    <button type="button" class="btn btn-secondary mx-auto" @click="addScheduleEntry">Add Schedule
                        Entry</button>
                </div>

                <ValidatingGenericInput type="number" id="capacity"
                    error-message="The course must have at least one participant" :validation-function="isValidCapacity"
                    v-model="capacityString" v-model:valid="capacityValid">
                    Capacity
                </ValidatingGenericInput>



                <button v-if="props.id" class="btn btn-primary" type="button" @click="handleUpdateCourse"
                    :disabled="!submitButtonEnabled">Update Course {{ name }}</button>
                <button v-else class="btn btn-primary" type="button" @click="handleCreateCourse"
                    :disabled="!submitButtonEnabled">Create Course {{ name }}</button>
            </form>
        </SectionContainerItem>
    </SectionContainer>

</template>