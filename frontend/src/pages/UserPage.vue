<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import Dropdown from '@/components/Dropdown.vue';
import DropdownItem from '@/components/DropdownItem.vue';
import NameLink from '@/components/NameLink.vue';
import MainButton from '@/components/MainButton.vue';
import { CourseInfo, SessionInfo, Trainer } from '@gym-manager/models';
import { ref } from 'vue';
import { useModalsStore } from '@/store/modals';

const store = useUserStore();
const confirm = useModalsStore().confirm;

const user = store.client.userDetails;

const myCourses = ref<Array<{ course: CourseInfo; dayOfWeek: string; startTime: string; }>>();
const myOneOnOne = ref<Array<{ info: SessionInfo, trainer: Trainer }>>();

if (user) {
    store.client.getCustomerCourses(user.id)
        .then(courses => myCourses.value = courses);
    store.client.getCustomerSessions(user.id)
        .then(sessions => myOneOnOne.value = sessions);
}

async function unsubscribeFromCourse(courseId: string, courseName: string) {
    if (await confirm('Do you want to unsubscribe from ' + courseName + '?')) {
        store.client.unsubscribeFromCourse(courseId)
            .then(id => myCourses.value = myCourses.value?.filter(x => x.course.id != id));
    }
}
async function cancelSession(sessionId: string) {
    if (await confirm('Do you want to cancel the private session?')) {
        store.client.cancelSession(sessionId)
            .then(id => myOneOnOne.value = myOneOnOne.value?.filter(x => x.info.id != id));
    }
}
function trainerProfilePath(trainerId: string) {
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
            <DropdownItem v-for="(course, i) in myCourses" :key="i"
                :header="[course.dayOfWeek + ' ' + course.startTime, course.course.name]" :id-prefix="'course'"
                :index="i" :dropdown-id="'my-courses-dropdown'">
                <dl>
                    <dt>{{ course.course.name }}</dt>
                    <dd>{{ course.course.description }}</dd>
                    <dt>Trainer</dt>
                    <dd>
                        <NameLink :path="trainerProfilePath(course.course.trainer)">{{ course.course.trainer }}
                        </NameLink>
                    </dd>
                </dl>
                <button type="button" class="btn btn-primary m-2"
                    @click="() => unsubscribeFromCourse(course.course.id, course.course.name)">Unsubscribe</button>
            </DropdownItem>
        </Dropdown>
    </section>
    <section id="my-one-on-one" class="my-3">
        <h2>My One-on-one</h2>
        <Dropdown id="my-oo-dropdown">
            <DropdownItem v-for="(session, i) in myOneOnOne" :key="i"
                :header="[session.info.dayOfWeek + ' ' + session.info.startTime, session.trainer.firstName + ' ' + session.trainer]"
                :id-prefix="'one-on-one'" :index="i" :dropdown-id="'my-oo-dropdown'">
                <dl>
                    <dt>Trainer</dt>
                    <dd>
                        <NameLink :path="trainerProfilePath(session.trainer.id)">{{ session.trainer.firstName + ' ' +
                            session.trainer }}</NameLink>
                    </dd>
                </dl>
                <button type="button" class="btn btn-primary m-2" @click="() => cancelSession(session.info.id)">Cancel
                    appointment</button>
            </DropdownItem>
        </Dropdown>
    </section>
    <MainButton class="mt-5" :path="contactSupport" :use-variant="true">Need help?</MainButton>
</template>