<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import Dropdown from '@/components/Dropdown.vue';
import DropdownItem from '@/components/DropdownItem.vue';
import NameLink from '@/components/NameLink.vue';
import MainButton from '@/components/MainButton.vue';
import { ref } from 'vue';
import { Course, Session } from '@gym-manager/models';

const store = useUserStore();

const user = store.client.getUserDetails;

const myCourses = ref<Array<Course>>();
const myOneOnOne = ref<Array<Session>>();

function customerProfilePath(customerId: string) {
    return '/user/profile/' + customerId;
}

const contactSupport = '/support/chat'
</script>

<template>
    <div class="d-flex flex-column">
        <h1 class="mx-auto">Hello {{ user?.username }}!</h1>
    </div>
    <section id="my-courses" class="my-3">
        <h2>My Courses</h2>
        <Dropdown id="my-courses-dropdown">
            <DropdownItem v-for="(course, i) in myCourses" :key="i" :header="[course.schedule[0].dayOfWeek + ' ' + course.schedule[0].startTime, course.name]" 
                :id-prefix="'course'" :index="i" :dropdown-id="'my-courses-dropdown'">
                <dl>
                    <dt>{{ course.name }}</dt>
                    <dd>{{ course.description }}</dd>
                    <dt>Partecipants</dt>
                    <dd><NameLink v-for="u in course.schedule[0].participants" :path="customerProfilePath(u)">{{ u }}</NameLink></dd>
                </dl>
            </DropdownItem>
        </Dropdown>
    </section>
    <section id="my-one-on-one" class="my-3">
        <h2>My One-on-one</h2>
        <Dropdown id="my-oo-dropdown">
            <DropdownItem v-for="(course, i) in myOneOnOne" :key="i" :header="[course.dayOfWeek + ' ' + course.startTime, course.trainer]" 
                :id-prefix="'one-on-one'" :index="i" :dropdown-id="'my-oo-dropdown'">
                <dl>
                    <dt>Partecipant</dt>
                    <dd>{{ course.participant }}</dd>
                </dl>
            </DropdownItem>
        </Dropdown>
    </section>
    <MainButton class="btn-secondary mt-5" :path="contactSupport">Need help?</MainButton>
</template>