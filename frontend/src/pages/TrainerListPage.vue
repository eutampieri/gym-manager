<script setup lang="ts">
import ListView from '@/components/ListView.vue';
import router from '@/routes/router';
import { useModalsStore } from '@/store/modals';
import { useNotificationsStore } from '@/store/notifications';
import { useUserStore } from '@/store/user';
import { ListData, RowData } from '@/utils/lists';
import { Trainer } from '@gym-manager/models';
import { computed, ref } from 'vue';

const client = useUserStore().client;
const confirm = useModalsStore().confirm;
const notification = useNotificationsStore();
const users = ref<Array<Trainer>>([]);
client.listTrainers().then(x => users.value = x);

const data = computed<ListData>((): ListData => {
    return {
        actions: [
            { action: edit, colour: "primary", label: "Edit" },
            { action: del, colour: "danger", label: "Delete" },
        ],
        data: users.value,
        headers: [
            { key: "username", name: "Username", link: (d) => client.trainerProfilePath(d.id as string) },
            { key: "firstName", name: "First name" },
            { key: "lastName", name: "Last name" },
            { key: "email", name: "Email" },
            { key: "phoneNumber", name: "Mobile" },
        ]
    };
});
const edit = (d: Trainer | RowData) => router.push({ path: '/admin/updateTrainer/' + d._id })
const del = async (d: Trainer | RowData) => {
    if (await confirm(`Are you sure you want to delete trainer ${d.username}?`)) {
        client.deleteTrainer(d._id as string).then(r => {
            if (r) {
                users.value = users.value.filter(t => t._id != d._id)
                notification.fire({
                    title: 'Success',
                    body: 'Trainer deleted successfully!',
                    background: 'success',
                    when: new Date(),
                });
            } else {
                notification.fire({
                    title: 'Error',
                    body: 'Error while deleting the trainer',
                    background: 'danger',
                    when: new Date(),
                });
            }
        });
    }
}

const mobileHeader = (d: Trainer | RowData) =>
    `${d.firstName} ${d.lastName}`;

const filter = (d: Trainer | RowData, s: string) =>
    (d.username as string).toLocaleLowerCase().indexOf(s.toLowerCase()) >= 0 ||
    (d.firstName as string).toLocaleLowerCase().indexOf(s.toLowerCase()) >= 0 ||
    (d.lastName as string).toLocaleLowerCase().indexOf(s.toLowerCase()) >= 0;

</script>
<template>
    <h2>All trainers</h2>
    <ListView :data="data" :mobile-header="mobileHeader" :filter-function="filter"></ListView>
</template>