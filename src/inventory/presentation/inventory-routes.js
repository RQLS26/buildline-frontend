import InventoryList from './views/inventory-list.vue';

const inventoryRoutes = [
    { path: 'list', name: 'inventory-list', component: InventoryList, meta: { title: 'Control de Almacén' } }
];

export default inventoryRoutes;