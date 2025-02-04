<script lang="ts" setup>
import { useRoute } from 'vue-router';
import BackButton from '@/components/BackButton.vue';
import PageTitle from '@/components/PageTitle.vue';
import { useUserStore } from '@/store/user'; 
import { getProfileIcon } from '@gym-manager/models/user';
import router from '@/routes/router';
import { computed } from 'vue';

// Recupero del percorso corrente
const route = useRoute();

const isLoginPage = computed(() => route.path === '/login');

// Recupero dei dati dell'utente dallo store Vuex/Pinia
const store = useUserStore();
const user = store.client.userDetails; // Verifica se ci sono dettagli utente
const profileIcon = user ? getProfileIcon(user) : ''; // Calcola l'icona profilo solo se user esiste
</script>


<template>
    <header class="header-container">
        <!-- Pulsante Back visibile solo se NON siamo nella pagina di login -->
        <BackButton v-if="!isLoginPage" buttonText="Back" />

        <!-- Titolo centrato -->
        <PageTitle title="Gym Manager" class="header-title" />

        <!-- Icona profilo (a destra) visibile solo se esiste -->
        <img v-if="profileIcon" :src="profileIcon" alt="Profile Icon" class="profile-icon" />
    </header>
</template>


<style scoped>
/* Header ben bilanciato */
.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between; /* Distribuisce gli elementi tra sinistra, centro e destra */
    padding: 10px 20px;
    background-color: #f8f9fa;
    border-bottom: 2px solid #ddd;
    width: 100%;
    height: 60px; /* Altezza fissa */
    position: sticky; /* Mantiene l'header visibile in alto senza coprire */
    top: 0;
    left: 0;
    z-index: 1000; /* Assicura che sia sopra gli altri elementi */
}

/* Stile per il titolo centrato */
.header-title {
    flex: 1; /* Occupa lo spazio centrale */
    text-align: center; /* Centra il testo */
    font-size: 1.5rem;
    font-weight: bold;
}

/* Stile per l'icona del profilo */
.profile-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
}

/* Effetto hover per migliorare la UI */
.profile-icon:hover {
    transform: scale(1.1);
}
</style>
