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


const routes = [
  { path: '/login', name: "Login", component: Login },
  { path: '/admin', name: "adminPage", component: AdminPage, meta: { role: "admin" } },
  { path: '/admin/profile', name: "adminProfile", component: ProfilePage, meta: { role: "admin" } },
  { path: '/admin/createCourse', name: "createCourse", component: CreateCoursePage, meta: { role: "admin" } },
  { path: '/admin/createClient', name: "createClient", component: CreateClientPage, meta: { role: "admin" } },
  { path: '/admin/listCustomers', name: "listCustomers", component: UserListPage, meta: { role: "admin" } },
  { path: '/admin/listTrainers', name: "listTrainers", component: TrainerListPage, meta: { role: "admin" } },
  { path: '/admin/listCourses', name: "listCourses", component: CourseListPage, meta: { role: "user" } },
  { path: '/admin/createTrainer', name: "createTrainer", component: CreateTrainerPage, meta: { role: "admin" } },
  { path: '/admin/createAdmin', name: "createAdmin", component: CreateAdminPage, meta: { role: "admin" } },
  { path: '/trainer/profile/:id', name: "trainerProfile", component: ProfilePage, meta: { role: "trainer" }, props: true },
  { path: '/user', name: "userPage", component: UserPage, meta: { role: "user" } },
  { path: '/user/profile/:id', name: "userProfile", component: ProfilePage, meta: { role: "user" }, props: true },
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
})

export default router;
