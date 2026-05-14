import { defineStore } from 'pinia';
import { SuppliersApi } from '../infrastructure/suppliers-api.js';

export const useSuppliersStore = defineStore('suppliers', {
    state: () => ({
        suppliersList: [],
        isLoading: false,
        rucValidationResult: null,
        isValidatingRuc: false
    }),
    actions: {
        async fetchSuppliers() {
            this.isLoading = true;
            try {
                const api = new SuppliersApi();
                const response = await api.getSuppliers();
                // response.data es el array que viene del JSON Server
                this.suppliersList = response.data.sort((a, b) => b.rating - a.rating);
            } catch (error) {
                console.error('Error cargando proveedores:', error);
            } finally {
                this.isLoading = false;
            }
        },
        async verifyRuc(ruc) {
            this.isValidatingRuc = true;
            this.rucValidationResult = null;
            const api = new SuppliersApi();
            const result = await api.validateRuc(ruc);
            this.rucValidationResult = result;
            this.isValidatingRuc = false;
            return result;
        }
    }
});