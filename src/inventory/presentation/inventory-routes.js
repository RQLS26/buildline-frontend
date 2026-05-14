import InventoryList from './views/inventory-list.vue';

const inventoryRoutes = [
    { path: 'list', name: 'inventory-list', component: InventoryList, meta: { titleKey: 'inventory.title' } }
];

export default inventoryRoutes;