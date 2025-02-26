<script setup lang="ts">
import CourseAvailabilityWatcher, { CourseAvailabilityUpdate } from '@/components/CourseAvailabilityWatcher.vue';
import ListView from '@/components/ListView.vue';
import router from '@/routes/router';
import { useModalsStore } from '@/store/modals';
import { useNotificationsStore } from '@/store/notifications';
import { useUserStore } from '@/store/user';
import { ListData, RowData } from '@/utils/lists';
import { Session, Trainer, User } from '@gym-manager/models';
import { computed, ref } from 'vue';

function displayableCourseFormatter(c: Session): RowData {
    return {
        id: c._id,
        dayOfWeek: c.dayOfWeek,
        startTime: c.startTime,
        participant: ((p: User) => `${p.firstName} ${p.lastName}`)(c.participant as unknown as User),
        trainer: ((t: Trainer) => `${t.firstName} ${t.lastName}`)(c.trainer as unknown as Trainer),
        trainerId: (c.trainer as Trainer)._id,
        participantId: (c.participant as User)._id,
    };
}

const client = useUserStore().client;
const confirm = useModalsStore().confirm;
const notification = useNotificationsStore();
const courses = ref<Array<Session>>([]);
const displayableCourses = computed(() => courses.value.map(displayableCourseFormatter));

client.listSessions().then(x => courses.value = x);

const data = computed<ListData>((): ListData => {
    return {
        actions: [
            { action: del, colour: "danger", label: "Delete" },
        ],
        data: displayableCourses.value,
        headers: [
            { key: "trainer", name: "Trainer", link: (d) => client.trainerProfilePath(d.trainerId as string) },
            { key: "participant", name: "Customer", link: (d) => client.customerProfilePath(d.participantId as string) },
            { key: "dayOfWeek", name: "Day" },
            { key: "startTime", name: "Time" },
        ]
    };
});
const del = async (d: Session | RowData) => {
    if (await confirm("Are you sure you want to delete this session?")) {
        client.cancelSession(d._id as string).then(r => {
            if (r) {
                courses.value = courses.value.filter(c => c._id != d._id)
                notification.fire({
                    title: 'Success',
                    body: 'Session deleted successfully!',
                    background: 'success',
                    when: new Date(),
                });
            } else {
                notification.fire({
                    title: 'Error',
                    body: 'Session while deleting the session',
                    background: 'danger',
                    when: new Date(),
                });
            }
        });
    }
}

const mobileHeader = (d: Session | RowData) =>
    `${d.dayOfWeek} ${d.startTime} (trainer: ${d.trainer})`;

const filter = (d: Session | RowData, s: string) =>
    ((d as Session).trainer as string).toLocaleLowerCase().indexOf(s.toLowerCase()) >= 0 ||
    ((d as Session).participant as string).toLocaleLowerCase().indexOf(s.toLowerCase()) >= 0;

</script>
<template>
    <h2>All one on one sessions</h2>
    <ListView :data="data" :mobile-header="mobileHeader" :filter-function="filter"></ListView>
</template>