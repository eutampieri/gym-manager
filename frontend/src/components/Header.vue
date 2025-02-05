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

const isLoginPage = computed(() => route.path === '/login');

const store = useUserStore();
const user = store.client.userDetails; // Verifica se ci sono dettagli utente
const profileIcon = user ? getProfileIcon(user) : ''; // Calcola l'icona profilo solo se user esiste
</script>


<template>
    <header class="d-flex navbar bg-body-tertiary px-2 border-bottom">
        <BackButton buttonText="Back" />

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
