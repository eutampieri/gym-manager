<script setup lang="ts">
import ListView from '@/components/ListView.vue';
import { useUserStore } from '@/store/user';
import { ListData, RowData } from '@/utils/lists';
import { Admin } from '@gym-manager/models';
import { computed, ref } from 'vue';

const client = useUserStore().client;
const admins = ref<Admin[]>([]);
client.listAdmins().then(x => admins.value = x);

const data = computed<ListData>((): ListData => {
    return {
        actions: [
            { action: (d) => alert("Edit"), colour: "primary", label: "Edit" },
            { action: (d) => alert("Delete"), colour: "danger", label: "Delete" },
        ],
        data: admins.value.map(x => {
            return {
                username: x.username,
                firstName: x.firstName,
                lastName: x.lastName,
                superadmin: x.hasFullPrivileges ? "Yes" : "No"
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