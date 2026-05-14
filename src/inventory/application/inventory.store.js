import { defineStore } from 'pinia';
import { InventoryApi } from '../infrastructure/inventory-api.js';

export const useInventoryStore = defineStore('inventory', {
    state: () => ({
        items: [],
        isLoading: false
    }),
    actions: {
        async fetchInventory() {
            this.isLoading = true;
            try {
                const api = new InventoryApi();
                const response = await api.getInventoryItems();
                this.items = response.data;
            } catch (error) {
                console.error('Error cargando el inventario:', error);
            } finally {
                this.isLoading = false;
            }
        }
    },
    getters: {
        // Getter para calcular si un material está con stock bajo (crítico para la constructora)
        lowStockItems: (state) => {
            return state.items.filter(item => item.stock <= item.minStock);
        }
    }
});