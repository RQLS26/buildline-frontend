import SupplierDirectory from "@/suppliers/presentation/supplier-directory.vue";

const suppliersRoutes = [
    { path: 'directory', name: 'supplier-directory', component: SupplierDirectory, meta: { title: 'Directorio de Proveedores' } }
];

export default suppliersRoutes;