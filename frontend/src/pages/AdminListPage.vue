<script setup lang="ts">
import ListView from '@/components/ListView.vue';
import router from '@/routes/router';
import { useModalsStore } from '@/store/modals';
import { useNotificationsStore } from '@/store/notifications';
import { useUserStore } from '@/store/user';
import { ListData, RowData } from '@/utils/lists';
import { Admin } from '@gym-manager/models';
import { computed, ref } from 'vue';

const client = useUserStore().client;
const confirm = useModalsStore().confirm;
const notification = useNotificationsStore();
const admins = ref<Admin[]>([]);
client.listAdmins().then(x => admins.value = x);

const data = computed<ListData>((): ListData => {
    return {
        actions: [
            { action: edit, colour: "primary", label: "Edit" },
            { action: del, colour: "danger", label: "Delete" },
        ],
        data: admins.value.map(x => {
            return {
                username: x.username,
                firstName: x.firstName,
                lastName: x.lastName,
                superadmin: x.hasFullPrivileges ? "Yes" : "No",
                _id: x._id
            }
        }),
        headers: [
            { key: "username", name: "Username" },
            { key: "firstName", name: "First name" },
            { key: "lastName", name: "Last name" },
            { key: "superadmin", name: "Admin management enabled" },
        ]
    };
});
const edit = (d: Admin | RowData) => router.push({ path: '/admin/updateAdmin/' + d._id })
const del = async (d: Admin | RowData) => {
    if (await confirm(`Are you sure you want to delete admin ${d.username}?`)) {
        client.deleteAdmin(d._id as string).then(r => {
            if (r) {
                admins.value = admins.value.filter(a => a._id != d._id)
                notification.fire({
                    title: 'Success',
                    body: 'Admin deleted successfully!',
                    background: 'success',
                    when: new Date(),
                });
            } else {
                notification.fire({
                    title: 'Error',
                    body: 'Error while deleting the admin',
                    background: 'danger',
                    when: new Date(),
                });
            }
        });
    }
}

const mobileHeader = (d: Admin | RowData) =>
    `${d.firstName} ${d.lastName}`;

const filter = (d: Admin | RowData, s: string) =>
    (d.username as string).toLocaleLowerCase().indexOf(s.toLowerCase()) >= 0 ||
    (d.firstName as string).toLocaleLowerCase().indexOf(s.toLowerCase()) >= 0 ||
    (d.lastName as string).toLocaleLowerCase().indexOf(s.toLowerCase()) >= 0;

</script>
<template>
    <h2>All admins</h2>
    <ListView :data="data" :mobile-header="mobileHeader" :filter-function="filter"></ListView>
</template>