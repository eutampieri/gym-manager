<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import Dropdown from '@/components/Dropdown.vue';
import DropdownItem from '@/components/DropdownItem.vue';
import NameLink from '@/components/NameLink.vue';
import { Role } from '@gym-manager/models/user';
import { ref } from 'vue';
import { CourseModel } from '@gym-manager/models/course';

const store = useUserStore();
const myCourses = ref<Array<CourseModel>>()
    
store.client.getCourses()
    .then(courses => courses.flatMap(c =>
        c.schedule.map(s => {
            console.log(s)
            let nc = { ...c };
            nc.schedule = Array.of(s);
            return nc;
        })
    ))
    .then(courses => myCourses.value = courses)

const isTrainer = store.client.getRole == Role.Trainer;

function gotoTrainerProfile(username: string) {
    // TODO
}

</script>

<template>
    <section id="my-courses" class="my-3">
        <h2>My Courses</h2>
        <Dropdown>
            <DropdownItem v-for="(course, i) in myCourses" :key="i" :header="[course.schedule[0].dayOfWeek + course.schedule[0].startTime, course.name]" :id-prefix="'course'" :index="i">
                <dl>
                    <dt>{{ course.name }}</dt>
                    <dd>{{ course.description }}</dd>
                    <dt>Trainer</dt>
                    <dd><NameLink :action="() => gotoTrainerProfile(course.trainer)">{{ course.trainer }}</NameLink></dd>
                </dl>
                <button type="button" class="btn btn-primary m-2">Unsubscribe</button>
            </DropdownItem>
        </Dropdown>
    </section>
</template>