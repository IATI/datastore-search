import { createWebHistory, createRouter } from 'vue-router';
import LandingView from '../views/LandingView.vue';
import ActivityView from '../views/ActivityView.vue';
import AboutPage from '../views/AboutPage.vue';

const routes = [
    {
        path: '/',
        name: 'landing',
        component: LandingView,
    },
    {
        path: '/about',
        name: 'about',
        component: AboutPage,
    },
    {
        path: '/activity/:iati_identifier',
        name: 'activity',
        component: ActivityView,
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
