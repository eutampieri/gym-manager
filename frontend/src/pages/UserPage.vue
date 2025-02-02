<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import MyCoursesDropdown from '@/components/MyCoursesDropdown.vue';
import MyOneOnOneDropdown from '@/components/MyOneOnOneDropdown.vue';
import MainButton from '@/components/MainButton.vue';
import router from '@/routes/router';

const store = useUserStore();

const user = store.client.getUserDetails;

function bookCourse() {
    // TODO
}
function bookOneonOne() {
    // TODO
}
function contactSupport() {
    // TODO
}

</script>

<template>
    <div class="d-flex flex-column">
        <h1 class="mx-auto">Hello {{ user?.username }}!</h1>
        <MainButton :action="bookCourse">Book course</MainButton>
        <MainButton :action="bookOneonOne">Book one-on-one</MainButton>
    </div>
    <MyCoursesDropdown />
    <MyOneOnOneDropdown />
    <MainButton class="btn-secondary mt-5" :action="contactSupport">Need help?</MainButton>
</template>