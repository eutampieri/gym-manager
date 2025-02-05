<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import Dropdown from '@/components/utils/Dropdown.vue';
import DropdownItem from '@/components/utils/DropdownItem.vue';
import NameLink from '@/components/utils/NameLink.vue';
import MainButton from '@/components/utils/MainButton.vue';
import { ref } from 'vue';
import { Admin, CourseInfo, SessionInfo } from '@gym-manager/models';
import SectionContainer from '@/components/utils/SectionContainer.vue';
import SectionContainerItem from '@/components/utils/SectionContainerItem.vue';

const store = useUserStore();

const user = store.client.userDetails;

const myCourses = ref<Array<{ course: CourseInfo, dayOfWeek: string, startTime: string, participants: { firstName: string, lastName: string, id: string, }[] }>>();
const myOneOnOne = ref<Array<{ info: SessionInfo, participant: Admin }>>();

if (user) {
    store.client.getTrainerCourses(user.id)
        .then(courses => myCourses.value = courses);
    store.client.getTrainerSessions(user.id)
        .then(sessions => myOneOnOne.value = sessions);
}

const contactSupport = '/support/chat'

</script>

<template>
    <div class="d-flex flex-column">
        <h1 class="mx-auto">Hello {{ user?.username }}!</h1>
    </div>
    <SectionContainer>  
        <SectionContainerItem id="my-courses" class="my-3">
            <h2>My Courses</h2>
            <Dropdown id="my-courses-dropdown">
                <DropdownItem v-for="(course, i) in myCourses" :key="i" :header="[course.dayOfWeek + ' ' + course.startTime, course.course.name]" 
                    :id-prefix="'course'" :index="i" :dropdown-id="'my-courses-dropdown'">
                    <dl>
                        <dt>{{ course.course.name }}</dt>
                        <dd>{{ course.course.description }}</dd>
                        <dt>Partecipants</dt>
                        <dd><NameLink v-for="u in course.participants" :path="store.client.customerProfilePath(u.id)">{{ u.firstName + ' ' + u.lastName }}</NameLink></dd>
                    </dl>
                </DropdownItem>
            </Dropdown>
        </SectionContainerItem>
        <SectionContainerItem id="my-one-on-one" class="my-3">
            <h2>My One-on-one</h2>
            <Dropdown id="my-oo-dropdown">
                <DropdownItem v-for="(session, i) in myOneOnOne" :key="i" :header="[session.info.dayOfWeek + ' ' + session.info.startTime, session.participant.firstName + ' ' + session.participant.lastName]" 
                    :id-prefix="'one-on-one'" :index="i" :dropdown-id="'my-oo-dropdown'">
                    <dl>
                        <dt>Partecipant</dt>
                        <dd><NameLink :path="store.client.customerProfilePath(session.participant.id)">{{ session.participant.firstName + ' ' + session.participant.lastName }}</NameLink></dd>
                    </dl>
                </DropdownItem>
            </Dropdown>
        </SectionContainerItem>
    </SectionContainer>
    <MainButton class="btn-secondary mt-5" :path="contactSupport" :use-variant="true">Need help?</MainButton>
</template>