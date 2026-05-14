import SupplierDirectory from "@/suppliers/presentation/supplier-directory.vue";
import IncidentsList from './views/incidents-list.vue';

const suppliersRoutes = [
    { path: 'directory', name: 'supplier-directory', component: SupplierDirectory, meta: { title: 'Directorio de Proveedores' } },
    { path: 'incidents', name: 'incidents', component: IncidentsList, meta: { title: 'Incidents' } }
];

export default suppliersRoutes;