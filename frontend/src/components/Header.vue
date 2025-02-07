<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router';
import BackButton from '@/components/BackButton.vue';
import PageTitle from '@/components/PageTitle.vue';
import { useUserStore } from '@/store/user';
import { getProfileIcon } from '@gym-manager/models/user';
import router from '@/routes/router';
import { computed } from 'vue';
import { Role } from '@gym-manager/models';

// Recupero del percorso corrente
const route = useRoute();

const isImpersonating = computed(() => store.client.getRole === Role.Admin && route.query.id);
const isLoginPage = computed(() => route.path === '/login');
const isAdminPage = computed(() => route.path === '/admin');
const isUserPage = computed(() => route.path === '/user');
const isTrainerPage = computed(() => route.path === '/trainer');
const backHidden = computed(() => isAdminPage.value || ((isUserPage.value || isTrainerPage.value || isLoginPage.value) && !isImpersonating.value));

const store = useUserStore();

const profileIcon = computed(() => store.client.userDetails ? getProfileIcon(store.client.userDetails) : '');

</script>


<template>
    <header class="sticky-top d-flex justify-content-between navbar bg-body-tertiary px-2 border-bottom mb-2">
        <span v-if="profileIcon != ''" :class="backHidden ? 'invisible' : ''">
            <BackButton buttonText="Back" />
        </span>

        <PageTitle title="Gym Manager" class="header-title" />

        <RouterLink v-if="profileIcon != ''" :to="{ path: store.client.getProfilePath() }">
            <img :src="profileIcon" alt="Profile Icon" class="profile-icon rounded-circle" />
        </RouterLink>
    </header>
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
