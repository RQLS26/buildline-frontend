import MaterialRequest from './views/material-request.vue';

const requisitionRoutes = [
    { path: 'requests', name: 'material-requests', component: MaterialRequest, meta: { title: 'Material Requests' } }
];

export default requisitionRoutes;