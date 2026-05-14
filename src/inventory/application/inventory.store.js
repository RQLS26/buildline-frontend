import { defineStore } from 'pinia';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api/v1' });

export const useInventoryStore = defineStore('inventory', {
    state: () => ({
        inventoryList: [],
        isLoading: false
    }),
    actions: {
        async fetchInventory() {
            this.isLoading = true;
            try {
                const response = await api.get('/inventory');
                this.inventoryList = response.data;
            } catch (error) {
                console.error("Error cargando inventario:", error);
            } finally {
                this.isLoading = false;
            }
        }
    }
});