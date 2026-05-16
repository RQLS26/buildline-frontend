/**
 * Application Router
 * @description Central route configuration for the Buildline platform.
 *              Aggregates routes from all bounded contexts.
 * @author RQLS TEAM
 */
import { createRouter, createWebHistory } from 'vue-router';
import DashboardShell from "./shared/presentation/views/dashboard-shell.vue";
import iamRoutes from './iam/presentation/iam-routes.js';
import requisitionRoutes from './requisition/presentation/requisition-routes.js';
import suppliersRoutes from './suppliers/presentation/suppliers-routes.js';
import procurementRoutes from './procurement/presentation/procurement-routes.js';
import inventoryRoutes from './inventory/presentation/inventory-routes.js';
import profilesRoutes from './profiles/presentation/profiles-routes.js';
import communicationRoutes from './communication/presentation/communication-routes.js';
import analyticsRoutes from './analytics-budgeting/presentation/analytics-routes.js';
import deliveryRoutes from './delivery/presentation/delivery-routes.js';

import { useIamStore } from './iam/application/iam.store.js';

const about = () => import('./shared/presentation/views/about.vue');
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');
const accessDenied = () => import('./shared/presentation/views/access-denied.vue');

const routes = [
    { path: '/home', name: 'home', component: DashboardShell, meta: { title: 'Overview' } },
    { path: '/about', name: 'about', component: about, meta: { title: 'About' } },
    { path: '/delivery', name: 'delivery', component: () => import('./delivery/presentation/views/delivery-tracking.vue'), meta: { title: 'Delivery & Tracking' } },
    { path: '/users', name: 'users', component: () => import('./iam/presentation/views/users-management.vue'), meta: { title: 'Users & Roles', requiresAdmin: true } },
    { path: '/iam', name: 'iam', children: iamRoutes },
    { path: '/', redirect: '/iam/sign-in' },
    { path: '/access-denied', name: 'access-denied', component: accessDenied, meta: { title: 'Access Denied' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } },
    { path: '/requisition', name: 'requisition', children: requisitionRoutes },
    { path: '/suppliers', name: 'suppliers', children: suppliersRoutes },
    { path: '/procurement', name: 'procurement', children: procurementRoutes },
    { path: '/inventory', name: 'inventory', children: inventoryRoutes },
    { path: '/profiles', name: 'profiles', children: profilesRoutes },
    { path: '/communication', name: 'communication', children: communicationRoutes },
    { path: '/budget', name: 'budget', children: analyticsRoutes },
    { path: '/settings', name: 'settings', component: () => import('./shared/presentation/views/settings.vue'), meta: { title: 'Settings' } },
    {
        path: '/reports',
        name: 'reports',
        component: () => import('./analytics-budgeting/presentation/views/reports.vue'),
        meta: { title: 'Reports' }
    },
];

/**
 * @summary Creates the Vue Router instance with HTML5 history mode.
 */
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
});

/**
 * @summary Global navigation guard for authentication and role-based access control.
 * @description Redirects unauthenticated users to sign-in, authenticated users away from
 *              public routes, and non-admin users away from admin-only routes.
 */
router.beforeEach((to) => {
    let baseTitle = 'Buildline';
    document.title = `${baseTitle} - ${to.meta['title'] || 'App'}`;

    const store = useIamStore();

    const isPublicRoute = to.path.startsWith('/iam');

    if (!isPublicRoute && !store.isAuthenticated) {
        return '/iam/sign-in';
    }
    if (isPublicRoute && store.isAuthenticated) {
        return '/home';
    }
    if (to.meta.requiresAdmin && !store.isAdmin) {
        return '/access-denied';
    }
    // Allow navigation
    return true;
});

export default router;
