import ApprovalInbox from './views/approval-inbox.vue';
import QuotationsManagement from './views/quotations-management.vue';

const procurementRoutes = [
    { path: 'inbox', name: 'approval-inbox', component: ApprovalInbox, meta: { title: 'Purchase Orders' } },
    { path: 'quotations', name: 'quotations-management', component: QuotationsManagement, meta: { title: 'Quotations' } }
];

export default procurementRoutes;