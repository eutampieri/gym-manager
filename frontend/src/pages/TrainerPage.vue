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
        <h2 class="mx-auto">Hello {{ user?.firstName }}!</h2>
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
                        <dt>Participants</dt>
                        <dd>
                            <ul v-if="course.participants.length">
                                <li v-for="u in course.participants">
                                    <NameLink :path="store.client.customerProfilePath(u.id)">{{
                                        u.firstName + ' ' + u.lastName }}</NameLink>
                                </li>
                            </ul>
                            <p v-else>No participants enrolled</p>
                        </dd>
                    </dl>
                </DropdownItem>
            </Dropdown>
            <p v-if="!(myCourses ?? []).length" class="py-5 px-3 text-muted text-center text-lg-start">You haven't signed up for any course yet</p>
        </SectionContainerItem>
        <SectionContainerItem id="my-one-on-one" class="my-3">
            <h3>My One-on-one</h3>
            <Dropdown id="my-oo-dropdown">
                <DropdownItem v-for="(session, i) in myOneOnOne" :key="i"
                    :header="[session.info.dayOfWeek + ' ' + session.info.startTime, session.participant.firstName + ' ' + session.participant.lastName]"
                    :id-prefix="'one-on-one'" :index="i" :dropdown-id="'my-oo-dropdown'">
                    <dl>
                        <dt>Participant</dt>
                        <dd>
                            <div v-if="session.participant">
                            <NameLink :path="store.client.customerProfilePath(session.participant._id)">{{
                                session.participant.firstName + ' ' + session.participant.lastName }}</NameLink>
                            </div>
                            <div v-else>
                                No participant enrolled.
                            </div>
                        </dd>
                    </dl>
                </DropdownItem>
            </Dropdown>
            <p v-if="!(myOneOnOne ?? []).length" class="py-5 px-3 text-muted text-center text-lg-start">You haven't signed up for any one-on-one session yet</p>
        </SectionContainerItem>
    </SectionContainer>
    <ChatButton v-if="!store.client.isImpersonating" class="btn-secondary mt-5" :use-variant="true">Need help?
    </ChatButton>
</template>