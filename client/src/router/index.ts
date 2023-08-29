import { createRouter, createWebHistory } from 'vue-router';
import routes from '@/router/routes';

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((_, __, next) => {
    return next();
});

export default router;
