import CompanyProfile from './views/company-profile.vue';

const profilesRoutes = [
    { path: 'company', name: 'company-profile', component: CompanyProfile, meta: { title: 'Perfil de Empresa' } }
];

export default profilesRoutes;