<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import Dropdown from '@/components/Dropdown.vue';
import DropdownItem from '@/components/DropdownItem.vue';
import { Role } from '@gym-manager/models/user';

const store = useUserStore();
// const myOneOnOne = store.client.getSessionsOfUser()
const myOneOnOne = [
    {
        trainer: "BOCCO",
        time: 'Wen 10:00-11:00'
    },{
        trainer: "BECCO",
        time: 'Fri 10:00-11:00'
    }
];
const isTrainer = store.client.getRole == Role.Trainer;

</script>

<template>
    <section id="my-one-on-one">
        <h2>My One-on-one</h2>
        <Dropdown>
            <DropdownItem v-for="(course, i) in myOneOnOne" :key="i" :header="[course.time, course.trainer]" :id-prefix="'one-on-one'" :index="i">
                <dl>
                    <dt>Trainer</dt>
                    <dd>{{ course.trainer }}</dd>
                </dl>
                <button type="button" class="btn btn-primary m-2">Cancel appointment</button>
            </DropdownItem>
        </Dropdown>
    </section>
</template>