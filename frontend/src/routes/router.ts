import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/store/user';
import Login from '@/pages/Login.vue';
import AdminPage from '@/pages/AdminPage.vue';
import CreateCoursePage from '@/pages/CreateCoursePage.vue';
import CreateClientPage from '@/pages/CreateClientPage.vue';
import ProfilePage from '@/pages/ProfilePage.vue';


const routes = [
  { path: '/login', name: "Login", component: Login },
  { path: '/admin', name: "adminPage", component: AdminPage, meta: { role: "admin" } },
  { path: '/admin/createCourse', name: "createCourse", component: CreateCoursePage, meta: { role: "admin" } },
  { path: '/admin/createClient', name: "createClient", component: CreateClientPage, meta: { role: "admin" } },
  { path: '/admin/profile', name: "adminProfile", component: ProfilePage, meta: { role: "admin" } },
  { path: '/trainer/profile', name: "trainerProfile", component: ProfilePage, meta: { role: "trainer" } },
  { path: '/user/profile', name: "userProfile", component: ProfilePage, meta: { role: "user" } },
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
