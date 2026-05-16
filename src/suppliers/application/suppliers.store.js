/**
 * Suppliers Store
 * @description Pinia store for supplier directory, ratings, and SUNAT validation.
 * @author RQLS TEAM
 */
import { defineStore } from 'pinia';
import { SuppliersApi } from '../infrastructure/suppliers-api.js';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000' });

export const useSuppliersStore = defineStore('suppliers', {
    state: () => ({
        suppliersList: [],
        incidentsList: [],
        isLoading: false,
        rucValidationResult: null,
        isValidatingRuc: false
    }),
    getters: {
        activeSuppliers: (state) => state.suppliersList.filter(s => s.isActive),
        inactiveSuppliers: (state) => state.suppliersList.filter(s => !s.isActive),
        avgDeliveryRate: (state) => {
            if (state.suppliersList.length === 0) return 0;
            const total = state.suppliersList.reduce((sum, s) => sum + (s.deliveryRate || 0), 0);
            return Math.round(total / state.suppliersList.length);
        },
        openIncidents: (state) => state.incidentsList.filter(i => i.status === 'Open'),
        inProgressIncidents: (state) => state.incidentsList.filter(i => i.status === 'In Progress'),
        resolvedIncidents: (state) => state.incidentsList.filter(i => i.status === 'Resolved'),
    },
    actions: {
        async fetchSuppliers() {
            this.isLoading = true;
            try {
                const suppliersApi = new SuppliersApi();
                const response = await suppliersApi.getSuppliers();
                this.suppliersList = response.data.sort((a, b) => b.rating - a.rating);
            } catch (error) {
                console.error('Error loading suppliers:', error);
            } finally {
                this.isLoading = false;
            }
        },
        async createSupplier(supplierData) {
            try {
                await api.post('/suppliers', supplierData);
                await this.fetchSuppliers();
                return true;
            } catch (error) {
                console.error('Error creating supplier:', error);
                return false;
            }
        },
        async updateSupplier(id, supplierData) {
            try {
                await api.patch(`/suppliers/${id}`, supplierData);
                await this.fetchSuppliers();
                return true;
            } catch (error) {
                console.error('Error updating supplier:', error);
                return false;
            }
        },
        async deleteSupplier(id) {
            try {
                await api.delete(`/suppliers/${id}`);
                await this.fetchSuppliers();
                return true;
            } catch (error) {
                console.error('Error deleting supplier:', error);
                return false;
            }
        },
        async fetchIncidents() {
            this.isLoading = true;
            try {
                const response = await api.get('/incidents');
                this.incidentsList = response.data.sort((a, b) => b.id - a.id);
            } catch (error) {
                console.error('Error loading incidents:', error);
            } finally {
                this.isLoading = false;
            }
        },
        async createIncident(incidentData) {
            try {
                await api.post('/incidents', incidentData);
                await this.fetchIncidents();
                return true;
            } catch (error) {
                console.error('Error creating incident:', error);
                return false;
            }
        },
        async updateIncidentStatus(id, newStatus) {
            try {
                await api.patch(`/incidents/${id}`, { status: newStatus });
                await this.fetchIncidents();
                return true;
            } catch (error) {
                console.error('Error updating incident:', error);
                return false;
            }
        },
        async verifyRuc(ruc) {
            this.isValidatingRuc = true;
            this.rucValidationResult = null;
            const suppliersApi = new SuppliersApi();
            const result = await suppliersApi.validateRuc(ruc);
            this.rucValidationResult = result;
            this.isValidatingRuc = false;
            return result;
        }
    }
});
