/**
 * Requisition Routes
 * @description Route definitions for the Material Requisition bounded context.
 * @author RQLS TEAM
 */
import RequisitionInventoryView from './views/requisition-inventory-view.vue';
import MaterialRequest from './views/material-request.vue';

const requisitionRoutes = [
    { path: 'inventory', name: 'requisition-inventory', component: RequisitionInventoryView, meta: { title: 'Material Request' } },
    { path: 'material-request', name: 'material-request', component: MaterialRequest, meta: { title: 'Material Requests' } },
    { path: 'requests', redirect: '/requisition/material-request' }
];

export default requisitionRoutes;
