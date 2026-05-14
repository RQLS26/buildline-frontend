import FinancialDashboard from './views/financial-dashboard.vue';

const analyticsRoutes = [
    { path: '', name: 'financial-dashboard', component: FinancialDashboard, meta: { title: 'Budget & Costs' } }
];

export default analyticsRoutes;