import ApprovalInbox from './views/approval-inbox.vue';

const procurementRoutes = [
    { path: 'inbox', name: 'approval-inbox', component: ApprovalInbox, meta: { title: 'Bandeja de Aprobaciones' } }
];

export default procurementRoutes;