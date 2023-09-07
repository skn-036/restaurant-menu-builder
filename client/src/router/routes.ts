import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'homepage',
        component: () => import('@/pages/Homepage.vue'),
    },
    {
        path: '/template-builder',
        name: 'template-builder',
        component: () => import('@/pages/TemplateBuilder.vue'),
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('@/pages/Test.vue'),
    },
];

export default routes;
