<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import Dropdown from '@/components/Dropdown.vue';
import DropdownItem from '@/components/DropdownItem.vue';
import NameLink from '@/components/NameLink.vue';
import MainButton from '@/components/MainButton.vue';
import { ref } from 'vue';
import { Admin, CourseInfo, Role, SessionInfo, Trainer } from '@gym-manager/models';
import SectionContainer from '@/components/SectionContainer.vue';
import SectionContainerItem from '@/components/SectionContainerItem.vue';
import { useRoute } from 'vue-router';

const store = useUserStore();
const route = useRoute();

const myCourses = ref<Array<{ course: CourseInfo, dayOfWeek: string, startTime: string, participants: { firstName: string, lastName: string, id: string, }[] }>>();
const myOneOnOne = ref<Array<{ info: SessionInfo, participant: Admin }>>();
const user = ref<Trainer | undefined>();

((store.client.getRole == Role.Admin && route.query.id) ? store.client.getTrainerById(route.query.id as string) : Promise.resolve(store.client.userDetails as Trainer)).then((u) => {
    user.value = u;
    if (user.value) {
        store.client.getTrainerCourses(user.value.id)
            .then(courses => myCourses.value = courses);
        store.client.getTrainerSessions(user.value.id)
            .then(sessions => myOneOnOne.value = sessions);
    }
});


const contactSupport = '/support/chat'

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
            <p v-if="!(myCourses ?? []).length">You haven't signed up for any course yet</p>
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
                            <NameLink :path="store.client.customerProfilePath(session.participant.id)">{{
                                session.participant.firstName + ' ' + session.participant.lastName }}</NameLink>
                            </div>
                            <div v-else>
                                No participant enrolled.
                            </div>
                        </dd>
                    </dl>
                </DropdownItem>
            </Dropdown>
            <p v-if="!(myOneOnOne ?? []).length">You haven't signed up for any one-on-one yet</p>
        </SectionContainerItem>
    </SectionContainer>
    <MainButton class="btn-secondary mt-5" :path="contactSupport" :use-variant="true">Need help?</MainButton>
</template>