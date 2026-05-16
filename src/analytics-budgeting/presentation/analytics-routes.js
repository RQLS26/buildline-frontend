/**
 * Analytics Routes
 * @description Route definitions for the Analytics & Budgeting bounded context.
 * @author RQLS TEAM
 */
import FinancialDashboard from './views/financial-dashboard.vue';

const analyticsRoutes = [
    { path: '', name: 'financial-dashboard', component: FinancialDashboard, meta: { title: 'Budget & Costs' } }
];

export default analyticsRoutes;
