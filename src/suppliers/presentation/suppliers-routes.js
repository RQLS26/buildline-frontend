/**
 * Suppliers Routes
 * @description Route definitions for the Suppliers bounded context.
 * @author RQLS TEAM
 */
import SupplierDirectory from "@/suppliers/presentation/views/supplier-directory.vue";
import IncidentsList from './views/incidents-list.vue';

const suppliersRoutes = [
    { path: 'directory', name: 'supplier-directory', component: SupplierDirectory, meta: { title: 'Suppliers' } },
    { path: 'incidents', name: 'incidents', component: IncidentsList, meta: { title: 'Incidents' } }
];

export default suppliersRoutes;
