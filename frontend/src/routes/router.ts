import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/store/user';
import Login from '@/pages/Login.vue';
import AdminPage from '@/pages/AdminPage.vue';
import createCoursePage from '@/pages/createCoursePage.vue';
import createClientPage from '@/pages/createClientPage.vue';


const routes = [
    { path: '/login', name: "Login", component: Login },
    { path: '/admin', name: "adminPage", component: AdminPage, meta: {role: "admin"} },
    { path: '/createCourse', name: "createCourse", component: createCoursePage, meta: {role: "admin"} },
    { path: '/createClient', name: "createClient", component: createClientPage, meta: {role: "admin"} },
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
