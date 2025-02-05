<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router';
import BackButton from '@/components/BackButton.vue';
import PageTitle from '@/components/PageTitle.vue';
import { useUserStore } from '@/store/user';
import { getProfileIcon } from '@gym-manager/models/user';
import router from '@/routes/router';
import { computed } from 'vue';

// Recupero del percorso corrente
const route = useRoute();
console.log(route.path);

const isLoginPage = computed(() => route.path === '/login');
const isAdminPage = computed(() => route.path === '/admin');
const isUserPage = computed(() => route.path === '/user');
const isTrainerPage = computed(() => route.path === '/trainer');
const backHidden = computed(() => isAdminPage.value || isUserPage.value || isTrainerPage.value || isLoginPage.value);

const store = useUserStore();
const user = store.client.userDetails; // Verifica se ci sono dettagli utente
const profileIcon = user ? getProfileIcon(user) : ''; // Calcola l'icona profilo solo se user esiste
</script>


<template>
    <header class="sticky-top d-flex navbar bg-body-tertiary px-2 border-bottom mb-2">
        <span :class="backHidden ? 'invisible' : ''">
            <BackButton buttonText="Back" />
        </span>

        <PageTitle title="Gym Manager" class="header-title" />

        <RouterLink :to="{ path: store.client.getProfilePath() }">
            <img v-if="profileIcon" :src="profileIcon" alt="Profile Icon" class="profile-icon rounded-circle" />
        </RouterLink>
    </header>
</template>


<style scoped>
.profile-icon:hover {
    transform: scale(1.1);
}

.profile-icon {
    height: 3em;
    transition: transform 0.2s ease-in-out;
}
</style>
