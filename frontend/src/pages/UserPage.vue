<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import Dropdown from '@/components/Dropdown.vue';
import DropdownItem from '@/components/DropdownItem.vue';
import NameLink from '@/components/NameLink.vue';
import MyOneOnOneDropdown from '@/components/MyOneOnOneDropdown.vue';
import MainButton from '@/components/MainButton.vue';
import router from '@/routes/router';
import { Course } from '@gym-manager/models';
import { ref } from 'vue';

const store = useUserStore();

const user = store.client.getUserDetails;

const myCourses = ref<Array<Course>>();
    
store.client.getUserCourses()
    .then(courses => myCourses.value = courses);

function gotoTrainerProfile(username: string) {
    // TODO 
}
function unsubsribeFromCourse(courseName: string) {
    if (confirm('Do you want to unsubscribe from ' + courseName + '?')) {
        // store.client.removeUserFromCourse(user?.username, courseName);
    }
}
function bookCourse() {
    // TODO
}
function bookOneonOne() {
    // TODO
}
function contactSupport() {
    // TODO
}

</script>

<template>
    <div class="d-flex flex-column">
        <h1 class="mx-auto">Hello {{ user?.username }}!</h1>
        <MainButton :action="bookCourse">Book course</MainButton>
        <MainButton :action="bookOneonOne">Book one-on-one</MainButton>
    </div>
    <section id="my-courses" class="my-3">
        <h2>My Courses</h2>
        <Dropdown>
            <DropdownItem v-for="(course, i) in myCourses" :key="i" :header="[course.schedule[0].dayOfWeek + ' ' + course.schedule[0].startTime, course.name]" :id-prefix="'course'" :index="i">
                <dl>
                    <dt>{{ course.name }}</dt>
                    <dd>{{ course.description }}</dd>
                    <dt>Trainer</dt>
                    <dd><NameLink :action="() => gotoTrainerProfile(course.trainer)">{{ course.trainer }}</NameLink></dd>
                </dl>
                <button type="button" class="btn btn-primary m-2" @click="() => unsubsribeFromCourse(course.name)">Unsubscribe</button>
            </DropdownItem>
        </Dropdown>
    </section>
    <MyOneOnOneDropdown />
    <MainButton class="btn-secondary mt-5" :action="contactSupport">Need help?</MainButton>
</template>