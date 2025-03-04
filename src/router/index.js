import { createWebHistory, createRouter } from 'vue-router';
import LandingView from '../views/LandingView.vue';
import ActivityView from '../views/ActivityView.vue';

const routes = [
    {
        path: '/',
        name: 'landing',
        component: LandingView,
    },
    {
        path: '/activity/:iati_identifier',
        name: 'activity',
        component: ActivityView,
    },
    {
        path: '/simple',
        name: 'Simple search',
        redirect: '/',
    },
    {
        path: '/advanced',
        name: 'Advanced search',
        redirect: '/',
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
