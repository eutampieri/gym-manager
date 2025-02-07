<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router';
import router from '@/routes/router';
import BackButton from '@/components/BackButton.vue';
import PageTitle from '@/components/PageTitle.vue';
import { useUserStore } from '@/store/user';
import { getProfileIcon } from '@gym-manager/models/user';
import { computed } from 'vue';

// Recupero del percorso corrente
const route = useRoute();
const client = useUserStore().client;

const isLoginPage = computed(() => route.path === '/login');
const isAdminPage = computed(() => route.path === '/admin');
const isUserPage = computed(() => route.path === '/user');
const isTrainerPage = computed(() => route.path === '/trainer');
const backHidden = computed(() => isAdminPage.value || ((isUserPage.value || isTrainerPage.value || isLoginPage.value)));

const profileIcon = computed(() => client.userDetails ? getProfileIcon(client.userDetails) : '');

const stopImpersonation = () => {
    client.stopImpersonating();
    router.push({ path: '/admin' })
}
</script>

<template>
    <header class="sticky-top d-flex justify-content-between navbar bg-body-tertiary px-2 border-bottom mb-2">
        <span v-if="profileIcon != ''" :class="backHidden ? 'invisible' : ''">
            <BackButton buttonText="Back" />
        </span>

        <PageTitle title="Gym Manager" class="header-title" />

        <RouterLink v-if="profileIcon != ''" :to="{ path: client.getProfilePath() }">
            <img :src="profileIcon" alt="Profile Icon" class="profile-icon rounded-circle" />
        </RouterLink>
    </header>
    <div v-if="client.isImpersonating" class="alert alert-info text-center mx-auto col-11 col-lg-7">
        You are currently impersonating a user. <button type="button" class="btn btn-link" @click="stopImpersonation">Click to stop impersonation.</button>
    </div>
</template>

<style scoped>
.profile-icon:hover {
    transform: scale(1.1);
}

.profile-icon {
    height: 3em;
    width: 3em;
    max-width: 3em;
    transition: transform 0.2s ease-in-out;
}
</style>
