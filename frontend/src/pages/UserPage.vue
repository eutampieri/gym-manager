<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import Dropdown from '@/components/Dropdown.vue';
import DropdownItem from '@/components/DropdownItem.vue';
import NameLink from '@/components/NameLink.vue';
import MainButton from '@/components/MainButton.vue';
import router from '@/routes/router';
import { Course, Session } from '@gym-manager/models';
import { ref } from 'vue';

const store = useUserStore();

const user = store.client.getUserDetails;

const myCourses = ref<Array<Course>>();
const myOneOnOne = ref<Array<Session>>();
    
store.client.getUserCourses()
    .then(courses => myCourses.value = courses);
store.client.getUserSessions()
    .then(sessions => myOneOnOne.value = sessions);

function unsubscribeFromCourse(courseId: string, courseName: string) {
    if (confirm('Do you want to unsubscribe from ' + courseName + '?')) {
        store.client.unsubscribeFromCourse(courseId)
        .then(id => myCourses.value = myCourses.value?.filter(x => x.id != id));
    }
}
function cancelSession(sessionId: string) {
    if (confirm('Do you want to cancel the private session?')) {
        store.client.cancelSession(sessionId)
        .then(id => myOneOnOne.value = myOneOnOne.value?.filter(x => x.id != id));
    }
}
function trainerProfilePath(trainerId: string) {
    // TODO 
    return '/trainer/profile/' + trainerId;
}

const bookCourse = '/user/bookCourse'
const bookOneonOne = '/user/bookSession'
const contactSupport = '/support/chat'

</script>

<template>
    <div class="d-flex flex-column">
        <h1 class="mx-auto">Hello {{ user?.username }}!</h1>
        <MainButton :path="bookCourse">Book course</MainButton>
        <MainButton :path="bookOneonOne">Book one-on-one</MainButton>
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
                    <dd><NameLink :path="trainerProfilePath(course.trainer)">{{ course.trainer }}</NameLink></dd>
                </dl>
                <button type="button" class="btn btn-primary m-2" @click="() => unsubscribeFromCourse(course.id, course.name)">Unsubscribe</button>
            </DropdownItem>
        </Dropdown>
    </section>
    <section id="my-one-on-one" class="my-3">
        <h2>My One-on-one</h2>
        <Dropdown id="my-oo-dropdown">
            <DropdownItem v-for="(course, i) in myOneOnOne" :key="i" :header="[course.dayOfWeek + ' ' + course.startTime, course.trainer]" 
                :id-prefix="'one-on-one'" :index="i" :dropdown-id="'my-oo-dropdown'">
                <dl>
                    <dt>Trainer</dt>
                    <dd>{{ course.trainer }}</dd>
                </dl>
                <button type="button" class="btn btn-primary m-2" @click="() => cancelSession(course.id)">Cancel appointment</button>
            </DropdownItem>
        </Dropdown>
    </section>
    <MainButton class="btn-secondary mt-5" :path="contactSupport">Need help?</MainButton>
</template>