<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import Dropdown from '@/components/Dropdown.vue';
import DropdownItem from '@/components/DropdownItem.vue';
import NameLink from '@/components/NameLink.vue';
import ChatButton from '@/components/ChatButton.vue';
import { ref } from 'vue';
import { Admin, CourseInfo, SessionInfo } from '@gym-manager/models';
import SectionContainer from '@/components/SectionContainer.vue';
import SectionContainerItem from '@/components/SectionContainerItem.vue';

const store = useUserStore();

const myCourses = ref<Array<{ course: CourseInfo, dayOfWeek: string, startTime: string, participants: { firstName: string, lastName: string, id: string, }[] }>>();
const myOneOnOne = ref<Array<{ info: SessionInfo, participant: Admin }>>();
const user = store.client.userDetails;

if (user) {
    store.client.getTrainerCourses(user._id)
        .then(courses => myCourses.value = courses);
    store.client.getTrainerSessions(user._id)
        .then(sessions => myOneOnOne.value = sessions);
}

</script>

<template>
    <div class="d-flex flex-column">
        <h2 class="mx-auto">Hello {{ user?.username }}!</h2>
    </div>
    <SectionContainer>
        <SectionContainerItem id="my-courses" class="my-3">
            <h3>My Courses</h3>
            <Dropdown id="my-courses-dropdown">
                <DropdownItem v-for="(course, i) in myCourses" :key="i"
                    :header="[course.dayOfWeek + ' ' + course.startTime, course.course.name]" :id-prefix="'course'"
                    :index="i" :dropdown-id="'my-courses-dropdown'">
                    <dl>
                        <dt>{{ course.course.name }}</dt>
                        <dd>{{ course.course.description }}</dd>
                        <dt>Partecipants</dt>
                        <dd>
                            <ul>
                                <li v-for="u in course.participants">
                                    <NameLink :path="store.client.customerProfilePath(u.id)">{{
                                        u.firstName + ' ' + u.lastName }}</NameLink>
                                </li>
                            </ul>
                        </dd>
                    </dl>
                </DropdownItem>
            </Dropdown>
        </SectionContainerItem>
        <SectionContainerItem id="my-one-on-one" class="my-3">
            <h3>My One-on-one</h3>
            <Dropdown id="my-oo-dropdown">
                <DropdownItem v-for="(session, i) in myOneOnOne" :key="i"
                    :header="[session.info.dayOfWeek + ' ' + session.info.startTime, session.participant.firstName + ' ' + session.participant.lastName]"
                    :id-prefix="'one-on-one'" :index="i" :dropdown-id="'my-oo-dropdown'">
                    <dl>
                        <dt>Partecipant</dt>
                        <dd>
                            <NameLink :path="store.client.customerProfilePath(session.participant._id)">{{
                                session.participant.firstName + ' ' + session.participant.lastName }}</NameLink>
                        </dd>
                    </dl>
                </DropdownItem>
            </Dropdown>
        </SectionContainerItem>
    </SectionContainer>
    <ChatButton v-if="!store.client.isImpersonating" class="btn-secondary mt-5" :use-variant="true">Need help?
    </ChatButton>
</template>