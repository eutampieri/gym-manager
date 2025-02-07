<script lang="ts" setup>
import { ref, Ref } from 'vue';
import { useUserStore } from '@/store/user';
import Dropdown from '@/components/Dropdown.vue';
import DropdownItem from '@/components/DropdownItem.vue';
import BookOneOnOne from '@/components/BookOneOnOne.vue';
import { Trainer } from '@gym-manager/models';
import { TrainerAvailabilities } from '@gym-manager/models/trainer';
import SectionContainer from '@/components/SectionContainer.vue';
import SectionContainerItem from '@/components/SectionContainerItem.vue';

const store = useUserStore();

const trainers = ref<[Trainer, Ref<TrainerAvailabilities | null>][]>();

store.client.listTrainers()
    .then(t => trainers.value = t.map(x => [x, ref(null)]));

async function fillAvailability(trainer: Trainer, r: Ref<TrainerAvailabilities | null>) {
    if (r.value === null) {
        r.value = await store.client.getTrainerAvailabilities(trainer._id);
    }
}
</script>

<template>
    <SectionContainer>
        <SectionContainerItem id="my-courses">
            <h2>Book a One-on-One Session</h2>
            <Dropdown id="trainer-dropdown">
                <DropdownItem v-for="(trainer, i) in trainers" :key="i"
                    :header="[`${trainer[0].firstName} ${trainer[0].lastName}`]" :id-prefix="trainer[0]._id" :index="i"
                    :dropdown-id="'trainer-dropdown'" @shown="() => fillAvailability(trainer[0], trainer[1])">
                    <BookOneOnOne :availabilities="trainer[1].value" :trainer-id="trainer[0]._id"></BookOneOnOne>
                </DropdownItem>
            </Dropdown>
        </SectionContainerItem>
    </SectionContainer>
</template>
