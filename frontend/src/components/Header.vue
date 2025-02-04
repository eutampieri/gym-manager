<script lang="ts" setup>
import BackButton from '@/components/BackButton.vue';
import PageTitle from '@/components/PageTitle.vue';

</script>
<template>
    <header>
        <section class="d-flex align-items-center">
            <BackButton buttonText="Back" />
            <PageTitle title="Gym Manager" />
        </section>
        <slot></slot>
    </header>
</template>