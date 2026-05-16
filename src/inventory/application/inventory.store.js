/**
 * Inventory Store
 * @description Pinia store for warehouse inventory management and stock tracking.
 * @author RQLS TEAM
 */
import { defineStore } from 'pinia';
import axios from 'axios';

const api = axios.create({ baseURL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000') + '/api/v1' });

export const useInventoryStore = defineStore('inventory', {
    state: () => ({
        inventoryList: [],
        isLoading: false
    }),
    getters: {
        totalItems: (state) => state.inventoryList.length,
        inStockItems: (state) => state.inventoryList.filter(i => i.currentStock > i.minStock),
        lowStockItems: (state) => state.inventoryList.filter(i => i.currentStock > 0 && i.currentStock <= i.minStock),
        outOfStockItems: (state) => state.inventoryList.filter(i => i.currentStock === 0),
        totalStockValue: (state) => state.inventoryList.reduce((sum, i) => sum + i.currentStock, 0),
        inventorySummary: (state) => {
            const inStock = state.inventoryList.filter(i => i.currentStock > i.minStock).length;
            const lowStock = state.inventoryList.filter(i => i.currentStock > 0 && i.currentStock <= i.minStock).length;
            const outOfStock = state.inventoryList.filter(i => i.currentStock === 0).length;
            return { inStock, lowStock, outOfStock, total: state.inventoryList.length };
        }
    },
    actions: {
        async fetchInventory() {
            this.isLoading = true;
            try {
                const response = await api.get('/inventory');
                this.inventoryList = response.data;
            } catch (error) {
                console.error("Error loading inventory:", error);
            } finally {
                this.isLoading = false;
            }
        },
        async updateStock(id, newStock) {
            try {
                await api.patch(`/inventory/${id}`, { currentStock: newStock, lastUpdated: new Date().toISOString().split('T')[0] });
                await this.fetchInventory();
                return true;
            } catch (error) {
                console.error("Error updating stock:", error);
                return false;
            }
        },
        async addItem(itemData) {
            try {
                await api.post('/inventory', itemData);
                await this.fetchInventory();
                return true;
            } catch (error) {
                console.error("Error adding item:", error);
                return false;
            }
        },
        async updateItem(id, itemData) {
            try {
                await api.patch(`/inventory/${id}`, itemData);
                await this.fetchInventory();
                return true;
            } catch (error) {
                console.error("Error updating item:", error);
                return false;
            }
        }
    }
});
