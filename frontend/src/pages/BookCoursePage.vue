<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import Dropdown from '@/components/Dropdown.vue';
import DropdownItem from '@/components/DropdownItem.vue';
import NameLink from '@/components/NameLink.vue';
import { Course, CourseInfo, Trainer } from '@gym-manager/models';
import { ref } from 'vue';
import CourseSchedule from '@/components/CourseSchedule.vue';
import SectionContainer from '@/components/SectionContainer.vue';
import SectionContainerItem from '@/components/SectionContainerItem.vue';

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

function isAlreadyBooked(courseId: string, dayOfWeek: string, startTime: string): boolean {
    return undefined != myCourses.value?.find(e => e.course.id == courseId && e.dayOfWeek == dayOfWeek && e.startTime == startTime)
}

</script>

<template>
    <SectionContainer>
        <SectionContainerItem id="my-courses">
            <h2>All courses</h2>
            <Dropdown id="my-courses-dropdown">
                <DropdownItem v-for="(course, i) in allCourses" :key="i"
                    :header="[`${course.course.name} (${course.trainer.firstName} ${course.trainer.lastName})`]"
                    :id-prefix="'course'" :index="i" :dropdown-id="'my-courses-dropdown'">
                    <dl>
                        <dt>{{ course.course.name }}</dt>
                        <dd>{{ course.course.description }}</dd>
                        <dt>Trainer</dt>
                        <dd>
                            <NameLink :path="store.client.trainerProfilePath(course.course.trainer)">{{ course.trainer.firstName + ' ' + course.trainer.lastName }}</NameLink>
                        </dd>
                        <dt>Date & Time</dt>
                        <dd class="container">
                            <CourseSchedule v-for="schedule in course.course.schedule" :course-id="course.course.id" 
                                :schedule="schedule" :booked="isAlreadyBooked(course.course.id, schedule.dayOfWeek, schedule.startTime)"/>
                        </dd>
                    </dl>
                </DropdownItem>
            </Dropdown>
        </SectionContainerItem>
    </SectionContainer>
</template>