<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import Dropdown from '@/components/Dropdown.vue';
import DropdownItem from '@/components/DropdownItem.vue';
import NameLink from '@/components/NameLink.vue';
import { Role } from '@gym-manager/models/user';

const store = useUserStore();
// const myCourses = store.client.getCoursesOfUser()
const myCourses = [
    {
        name: "ZUMBA",
        trainer: {
            username: "BBBBB"
        },
        description: "a very ggo course",
        time: 'Wen 10:00-11:00'
    },{
        name: "ZEMBA",
        trainer: {
            username: "banbbn"
        },
        description: "a very bba course",
        time: 'Fri 10:00-11:00'
    }
];
const isTrainer = store.client.getRole == Role.Trainer;

function gotoTrainerProfile(username: string) {
    // TODO
}

</script>

<template>
    <section id="my-courses" class="my-3">
        <h2>My Courses</h2>
        <Dropdown>
            <DropdownItem v-for="(course, i) in myCourses" :key="i" :header="[course.time, course.name]" :id-prefix="'course'" :index="i">
                <dl>
                    <dt>{{ course.name }}</dt>
                    <dd>{{ course.description }}</dd>
                    <dt>Trainer</dt>
                    <dd><NameLink :action="() => gotoTrainerProfile(course.trainer.username)">{{ course.trainer.username }}</NameLink></dd>
                </dl>
                <button type="button" class="btn btn-primary m-2">Unsubscribe</button>
            </DropdownItem>
        </Dropdown>
    </section>
</template>