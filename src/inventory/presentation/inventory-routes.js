/**
 * Inventory Routes
 * @description Route definitions for the Inventory bounded context.
 * @author RQLS TEAM
 */
import InventoryList from './views/inventory-list.vue';

const inventoryRoutes = [
    { path: 'list', name: 'inventory-list', component: InventoryList, meta: { title: 'Inventory' } }
];

export default inventoryRoutes;
