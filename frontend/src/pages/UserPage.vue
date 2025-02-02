<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import MyCoursesDropdown from '@/components/MyCoursesDropdown.vue';
import MyOneOnOneDropdown from '@/components/MyOneOnOneDropdown.vue';
import MainButton from '@/components/MainButton.vue';

const store = useUserStore();

const user = store.client.getUserDetails;

</script>

<template>
    <div class="d-flex flex-column">
        <h1 class="mx-auto">Hello {{ user?.username }}!</h1>
        <MainButton class="btn-primary">Book course</MainButton>
        <MainButton class="btn-primary">Book one-on-one</MainButton>
    </div>
    <MyCoursesDropdown />
    <MyOneOnOneDropdown />
    <MainButton class="btn-secondary mt-5">Need help?</MainButton>
</template>