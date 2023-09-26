import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'homepage',
        component: () => import('@/pages/Homepage.vue'),
    },
];

export default routes;
