import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/HomePage.vue';
import { ref } from 'vue';
import Login from '@/pages/Login.vue';
import { useUserStore } from '@/store/user';


const routes = [
    { path: '/', name: "Home", component: Home },
    { path: '/login', name: "Login", component: Login },
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
