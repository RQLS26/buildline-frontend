/**
 * Delivery Routes
 * @description Route definitions for the Delivery & Tracking bounded context.
 * @author RQLS TEAM
 */
const DeliveryTracking = () => import('./views/delivery-tracking.vue');

export default [
    { path: 'tracking', name: 'delivery-tracking', component: DeliveryTracking, meta: { title: 'Delivery & Tracking' } }
];
