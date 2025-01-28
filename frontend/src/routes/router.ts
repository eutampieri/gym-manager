import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/pages/Login.vue';
import { useUserStore } from '@/store/user';
import AdminPage from '@/pages/AdminPage.vue';
import createCoursePage from '@/pages/createCoursePage.vue';


const routes = [
    { path: '/login', name: "Login", component: Login },
    { path: '/admin', name: "Home", component: AdminPage, meta: {role: "admin"} },
    { path: '/createCourse', name: "createCourse", component: createCoursePage, meta: {role: "admin"} },
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
