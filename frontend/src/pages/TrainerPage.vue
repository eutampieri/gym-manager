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
                            <NameLink :path="store.client.customerProfilePath(session.participant.id)">{{
                                session.participant.firstName + ' ' + session.participant.lastName }}</NameLink>
                        </dd>
                    </dl>
                </DropdownItem>
            </Dropdown>
        </SectionContainerItem>
    </SectionContainer>
    <MainButton class="btn-secondary mt-5" :path="contactSupport" :use-variant="true">Need help?</MainButton>
</template>