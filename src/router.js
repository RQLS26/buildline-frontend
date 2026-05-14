import { createRouter, createWebHistory } from 'vue-router';
import Home from '../shared/presentation/views/home.vue';
import iamRoutes from '@/iam/presentation/iam-routes.js';
import requisitionRoutes from '@/requisition/presentation/requisition-routes.js';
import suppliersRoutes from './suppliers/presentation/suppliers-routes.js';
import procurementRoutes from './procurement/presentation/procurement-routes.js';
import inventoryRoutes from './inventory/presentation/inventory-routes.js';
import profilesRoutes from './profiles/presentation/profiles-routes.js';
import communicationRoutes from './communication/presentation/communication-routes.js';

const about = () => import('../shared/presentation/views/about.vue');
const pageNotFound = () => import('../shared/presentation/views/page-not-found.vue');

const routes = [
    { path: '/home', name: 'home', component: Home, meta: { title: 'Home' } },
    { path: '/about', name: 'about', component: about, meta: { title: 'About' } },
    { path: '/iam', name: 'iam', children: iamRoutes },
    { path: '/', redirect: '/home' },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } },
    { path: '/requisition', name: 'requisition', children: requisitionRoutes },
    { path: '/suppliers', name: 'suppliers', children: suppliersRoutes },
    { path: '/procurement', name: 'procurement', children: procurementRoutes },
    { path: '/inventory', name: 'inventory', children: inventoryRoutes },
    { path: '/profiles', name: 'profiles', children: profilesRoutes },
    { path: '/communication', name: 'communication', children: communicationRoutes },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
});

router.beforeEach((to, from, next) => {
    let baseTitle = 'Buildline';
    document.title = `${baseTitle} - ${to.meta['title'] || 'App'}`;
    return next();
});

export default router;