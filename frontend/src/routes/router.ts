import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/store/user';
import Login from '@/pages/Login.vue';
import AdminPage from '@/pages/AdminPage.vue';
import CreateCoursePage from '@/pages/CreateCoursePage.vue';
import CreateClientPage from '@/pages/CreateClientPage.vue';
import ProfilePage from '@/pages/ProfilePage.vue';
import UserListPage from '@/pages/UserListPage.vue';
import TrainerListPage from '@/pages/TrainerListPage.vue';
import CourseListPage from '@/pages/CourseListPage.vue';
import CreateTrainerPage from '@/pages/CreateTrainerPage.vue';
import CreateAdminPage from '@/pages/CreateAdminPage.vue';
import UserPage from '@/pages/UserPage.vue';
import BookOneOnOnePage from '@/pages/BookOneOnOnePage.vue';
import AdminListPage from '@/pages/AdminListPage.vue';
import TrainerPage from '@/pages/TrainerPage.vue';
import BookCoursePage from '@/pages/BookCoursePage.vue';
import { Role } from '@gym-manager/models';
import OneOnOneListPage from '@/pages/OneOnOneListPage.vue';


const routes = [
    { path: '/login', name: "Login", component: Login },
    { path: '/admin', name: "adminPage", component: AdminPage, meta: { role: "admin" } },
    { path: '/admin/createCourse', name: "createCourse", component: CreateCoursePage, meta: { role: "admin" } },
    { path: '/admin/updateCourse/:id', name: "updateCourse", component: CreateCoursePage, meta: { role: "admin" }, props: true },
    { path: '/admin/listCourses', name: "listCourses", component: CourseListPage, meta: { role: "user" } },
    { path: '/admin/listOneOnOnes', name: "listOneOnOnes", component: OneOnOneListPage, meta: { role: "user" } },
    { path: '/admin/createClient', name: "createClient", component: CreateClientPage, meta: { role: "admin" } },
    { path: '/admin/updateClient/:id', name: "updateClient", component: CreateClientPage, meta: { role: "admin" }, props: true },
    { path: '/admin/listCustomers', name: "listCustomers", component: UserListPage, meta: { role: "admin" } },
    { path: '/admin/createTrainer', name: "createTrainer", component: CreateTrainerPage, meta: { role: "admin" } },
    { path: '/admin/updateTrainer/:id', name: "updateTrainer", component: CreateTrainerPage, meta: { role: "admin" }, props: true },
    { path: '/admin/listTrainers', name: "listTrainers", component: TrainerListPage, meta: { role: "admin" } },
    { path: '/admin/createAdmin', name: "createAdmin", component: CreateAdminPage, meta: { role: "admin" } },
    { path: '/admin/updateAdmin/:id', name: "updateAdmin", component: CreateAdminPage, meta: { role: "admin" }, props: true },
    { path: '/admin/listAdmins', name: "listAdmins", component: AdminListPage, meta: { role: "admin" } },
    { path: '/user', name: "userPage", component: UserPage, meta: { role: "user" } },
    { path: '/user/book/session', name: "bookOneOnOne", component: BookOneOnOnePage, meta: { role: "user" }, props: true },
    { path: '/user/book/course', name: "bookCourse", component: BookCoursePage, meta: { role: "user" } },
    { path: '/trainer', name: "trainerPage", component: TrainerPage, meta: { role: "trainer" } },
    { path: '/:role/profile/:id', name: "userProfile", component: ProfilePage, meta: { role: "user" }, props: true },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});
router.beforeEach(async (to, from) => {
    const store = useUserStore()
    if (
        !store.client.isLoggedIn &&
        to.name !== 'Login'
    ) {
        return { name: 'Login' }
    }
});
router.beforeEach(async (to, from) => {
    if (to.path === '/') {
        const store = useUserStore()
        switch (store.client.getRole) {
            case Role.Admin:
                return '/admin';
            case Role.Trainer:
                return '/trainer';
            case Role.User:
                return '/user';
        }
    }
});

export default router;
