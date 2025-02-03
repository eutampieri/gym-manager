<script setup lang="ts">
import ListView from '@/components/ListView.vue';
import { useUserStore } from '@/store/user';
import { ListData, RowData } from '@/utils/lists';
import { Trainer } from '@gym-manager/models';
import { computed, ref } from 'vue';

const client = useUserStore().client;
const users = ref<Array<Trainer>>([]);
client.listUsers().then(x => users.value = x);

const data = computed<ListData>((): ListData => {
    return {
        actions: [
            { action: (d) => alert("Edit"), colour: "primary", label: "Edit" },
            { action: (d) => alert("Delete"), colour: "danger", label: "Delete" },
        ],
        data: users.value,
        headers: [
            { key: "username", name: "Username" },
            { key: "firstName", name: "First name" },
            { key: "lastName", name: "Last name" },
            { key: "dateOfBirth", name: "Date of birth" },
            { key: "fiscalCode", name: "CF" },
            { key: "address", name: "Address" },
        ]
    };
});

const mobileHeader = (d: Trainer | RowData) =>
    `${d.firstName} ${d.lastName}`;

const filter = (d: Trainer | RowData, s: string) =>
    d.username.toLocaleLowerCase().indexOf(s.toLowerCase()) >= 0 ||
    d.firstName.toLocaleLowerCase().indexOf(s.toLowerCase()) >= 0 ||
    d.lastName.toLocaleLowerCase().indexOf(s.toLowerCase()) >= 0;

</script>
<template>
    <h2>All trainers</h2>
    <ListView :data="data" :mobile-header="mobileHeader" :filter-function="filter"></ListView>
</template>