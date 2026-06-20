import { defineStore } from 'pinia';
import { InventoryApi } from '../infrastructure/inventory-api.js';

const api = new InventoryApi();

/**
 * Pinia store for inventory listing, stock indicators and item update workflows.
 *
 * @description Uses `InventoryApi` for backend communication and keeps presentation-ready
 * stock groupings derived from the loaded inventory list.
 *
 * @author RQLS TEAM
 */
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
        /**
         * Loads inventory items from the backend.
         *
         * @returns {Promise<void>} Resolves after `inventoryList` is refreshed.
         */
        async fetchInventory() {
            this.isLoading = true;
            try {
                const response = await api.getInventoryItems();
                this.inventoryList = response.data;
            } catch (error) {
                console.error("Error loading inventory:", error);
            } finally {
                this.isLoading = false;
            }
        },
        /**
         * Updates only the current stock field for an item.
         *
         * @param {number|string} id - Inventory item identifier.
         * @param {number} newStock - New current stock value.
         * @returns {Promise<boolean>} True when the stock update succeeds.
         */
        async updateStock(id, newStock) {
            try {
                await api.updateStock(id, { currentStock: newStock, lastUpdated: new Date().toISOString().split('T')[0] });
                await this.fetchInventory();
                return true;
            } catch (error) {
                console.error("Error updating stock:", error);
                return false;
            }
        },
        /**
         * Creates an inventory item and refreshes the list.
         *
         * @param {Object} itemData - Inventory creation payload built by the view dialog.
         * @returns {Promise<boolean>} True when creation succeeds.
         */
        async addItem(itemData) {
            try {
                await api.createInventoryItem(itemData);
                await this.fetchInventory();
                return true;
            } catch (error) {
                console.error("Error adding item:", error);
                return false;
            }
        },
        /**
         * Updates editable inventory item fields.
         *
         * @param {number|string} id - Inventory item identifier.
         * @param {Object} itemData - Partial update payload.
         * @returns {Promise<boolean>} True when the backend accepts the update.
         */
        async updateItem(id, itemData) {
            try {
                await api.updateInventoryItem(id, itemData);
                await this.fetchInventory();
                return true;
            } catch (error) {
                console.error("Error updating item:", error);
                return false;
            }
        }
    }
});
