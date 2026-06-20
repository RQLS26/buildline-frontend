import { useIamStore } from '../application/iam.store.js';

/**
 * IAM route-access guard used by the root Vue Router.
 *
 * @description
 * Keeps authentication and authorization decisions inside the IAM infrastructure boundary
 * instead of embedding session rules directly in `router.js`. The guard distinguishes
 * public IAM routes from authenticated application routes and checks admin-only metadata.
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target route.
 * @returns {true|Object} `true` when navigation is allowed; otherwise a named-route redirect.
 *
 * @example
 * router.beforeEach((to) => authenticationGuard(to));
 */
export const authenticationGuard = (to) => {
    const store = useIamStore();
    const isPublicRoute = to.path.startsWith('/iam');

    if (!isPublicRoute && !store.isAuthenticated) {
        return { name: 'sign-in' };
    }

    if (isPublicRoute && store.isAuthenticated) {
        return { name: 'home' };
    }

    if (to.meta.requiresAdmin && !store.isAdmin) {
        return { name: 'access-denied' };
    }

    return true;
};
