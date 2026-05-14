import { createRouter, createWebHistory } from 'vue-router';
import Home from "../shared/presentation/views/home.vue";
import iamRoutes from './iam/presentation/iam-routes.js';
import requisitionRoutes from './requisition/presentation/requisition-routes.js';
import suppliersRoutes from './suppliers/presentation/suppliers-routes.js';
import procurementRoutes from './procurement/presentation/procurement-routes.js';
import inventoryRoutes from './inventory/presentation/inventory-routes.js';
import profilesRoutes from './profiles/presentation/profiles-routes.js';
import communicationRoutes from './communication/presentation/communication-routes.js';
import analyticsRoutes from './analytics-budgeting/presentation/analytics-routes.js';

import { useIamStore } from './iam/application/iam.store.js';

const about = () => import('../shared/presentation/views/about.vue');
const pageNotFound = () => import('../shared/presentation/views/page-not-found.vue');

const routes = [
    { path: '/home', name: 'home', component: Home, meta: { title: 'Home' } },
    { path: '/about', name: 'about', component: about, meta: { title: 'About' } },
    { path: '/iam', name: 'iam', children: iamRoutes },
    { path: '/', redirect: '/iam/sign-in' }, // Si entras a la raíz, te manda al login
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } },
    { path: '/requisition', name: 'requisition', children: requisitionRoutes },
    { path: '/suppliers', name: 'suppliers', children: suppliersRoutes },
    { path: '/procurement', name: 'procurement', children: procurementRoutes },
    { path: '/inventory', name: 'inventory', children: inventoryRoutes },
    { path: '/profiles', name: 'profiles', children: profilesRoutes },
    { path: '/communication', name: 'communication', children: communicationRoutes },
    { path: '/budget', name: 'budget', children: analyticsRoutes },
    { path: '/settings', name: 'settings', component: () => import('../shared/presentation/views/settings.vue'), meta: { title: 'Settings' } },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
});

router.beforeEach((to, from, next) => {
    let baseTitle = 'Buildline';
    document.title = `${baseTitle} - ${to.meta['title'] || 'App'}`;

    const store = useIamStore();

    const isPublicRoute = to.path.startsWith('/iam');

    if (!isPublicRoute && !store.isAuthenticated) {
        next('/iam/sign-in');
    }
    else if (isPublicRoute && store.isAuthenticated) {
        next('/home');
    }
    else {
        next();
    }
});

export default router;