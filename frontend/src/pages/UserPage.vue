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
function unsubscribeFromCourse(courseId: string, courseName: string) {
    if (confirm('Do you want to unsubscribe from ' + courseName + '?')) {
        store.client.unsubscribeFromCourse(courseId)
            .then(id => myCourses.value = myCourses.value?.filter(x => x.id != id));
    }
}
function bookCourse() {
    // TODO
    console.log('book course clicked')
}
function bookOneonOne() {
    // TODO
    console.log('book one-on-one clicked')
}
function contactSupport() {
    // TODO
    console.log('contact support clicked')
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
        <Dropdown id="my-courses-dropdown">
            <DropdownItem v-for="(course, i) in myCourses" :key="i" :header="[course.schedule[0].dayOfWeek + ' ' + course.schedule[0].startTime, course.name]" 
                :id-prefix="'course'" :index="i" :dropdown-id="'my-courses-dropdown'">
                <dl>
                    <dt>{{ course.name }}</dt>
                    <dd>{{ course.description }}</dd>
                    <dt>Trainer</dt>
                    <dd><NameLink :action="() => gotoTrainerProfile(course.trainer)">{{ course.trainer }}</NameLink></dd>
                </dl>
                <button type="button" class="btn btn-primary m-2" @click="() => unsubscribeFromCourse(course.id, course.name)">Unsubscribe</button>
            </DropdownItem>
        </Dropdown>
    </section>
    <MyOneOnOneDropdown />
    <MainButton class="btn-secondary mt-5" :action="contactSupport">Need help?</MainButton>
</template>