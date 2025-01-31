import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/store/user';
import Login from '@/pages/Login.vue';
import AdminPage from '@/pages/AdminPage.vue';
import CreateCoursePage from '@/pages/CreateCoursePage.vue';
import CreateClientPage from '@/pages/CreateClientPage.vue';


const routes = [
  { path: '/login', name: "Login", component: Login },
  { path: '/admin', name: "adminPage", component: AdminPage, meta: { role: "admin" } },
  { path: '/admin/createCourse', name: "createCourse", component: CreateCoursePage, meta: { role: "admin" } },
  { path: '/admin/createClient', name: "createClient", component: CreateClientPage, meta: { role: "admin" } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});
router.beforeEach(async (to, from) => {
  const store = useUserStore()
  if (
    !store.isAuthenticated &&
    to.name !== 'Login'
  ) {
    return { name: 'Login' }
  }
})

export default router;
