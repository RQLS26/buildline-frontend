/**
 * Profiles Routes
 * @description Route definitions for the Company Profiles bounded context.
 * @author RQLS TEAM
 */
import CompanyProfile from './views/company-profile.vue';

const profilesRoutes = [
    { path: 'company', name: 'company-profile', component: CompanyProfile, meta: { title: 'Perfil de Empresa' } }
];

export default profilesRoutes;
