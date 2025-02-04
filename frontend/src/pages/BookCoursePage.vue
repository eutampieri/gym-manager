<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import Dropdown from '@/components/Dropdown.vue';
import DropdownItem from '@/components/DropdownItem.vue';
import NameLink from '@/components/NameLink.vue';
import { Course, CourseInfo, Trainer } from '@gym-manager/models';
import { ref } from 'vue';

const store = useUserStore();

const user = store.client.userDetails;

const myCourses = ref<{ course: CourseInfo; dayOfWeek: string; startTime: string; }[]>();
const allCourses = ref<{ course: Course; trainer: Trainer }[]>();

// get all courses and trainers
store.client.listCourses()
    .then(courses => Promise.all(courses.map(c => 
            store.client.getTrainer(c.trainer)
                .then(t => ({ course: c, trainer: t }))
            ))
    ).then(d => allCourses.value = d);

//get user courses
if (user) {
    store.client.getCustomerCourses(user.id)
        .then(courses => myCourses.value = courses);
}

</script>

<template>
    <section id="my-courses" class="my-3">
        <h2>My Courses</h2>
        <Dropdown id="my-courses-dropdown">
            <DropdownItem v-for="(course, i) in allCourses" :key="i"
                :header="[course.course.name, course.trainer.firstName + ' ' + course.trainer.lastName]"
                :id-prefix="'course'" :index="i" :dropdown-id="'my-courses-dropdown'">
                <dl>
                    <dt>{{ course.course.name }}</dt>
                    <dd>{{ course.course.description }}</dd>
                    <dt>Trainer</dt>
                    <dd>
                        <NameLink :path="store.client.trainerProfilePath(course.course.trainer)">{{ course.trainer.firstName + ' ' + course.trainer.lastName }}</NameLink>
                    </dd>
                    <dt>Date & Time</dt>
                    <dd class="d-flex flex-row justify-content-between">
                        <!-- TODO -->
                    </dd>
                </dl>
            </DropdownItem>
        </Dropdown>
    </section>
</template>