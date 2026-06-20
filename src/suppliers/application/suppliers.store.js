import { defineStore } from 'pinia';
import { SuppliersApi } from '../infrastructure/suppliers-api.js';

const api = new SuppliersApi();

/**
 * Pinia store for supplier directory, incidents and RUC validation state.
 *
 * @description Coordinates supplier and incident workflows through `SuppliersApi`. The
 * RUC validation result remains local because Sprint 3 does not include a backend SUNAT
 * integration endpoint.
 *
 * @author RQLS TEAM
 */
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
        /**
         * Loads suppliers ordered by rating.
         *
         * @returns {Promise<void>} Resolves after `suppliersList` is refreshed.
         */
        async fetchSuppliers() {
            this.isLoading = true;
            try {
                const response = await api.getSuppliers();
                this.suppliersList = response.data.sort((a, b) => b.rating - a.rating);
            } catch (error) {
                console.error('Error loading suppliers:', error);
            } finally {
                this.isLoading = false;
            }
        },
        /**
         * Creates a supplier and refreshes the directory.
         *
         * @param {Object} supplierData - Supplier creation payload.
         * @returns {Promise<boolean>} True when creation succeeds.
         */
        async createSupplier(supplierData) {
            try {
                await api.createSupplier(supplierData);
                await this.fetchSuppliers();
                return true;
            } catch (error) {
                console.error('Error creating supplier:', error);
                return false;
            }
        },
        /**
         * Updates supplier metadata.
         *
         * @param {number|string} id - Supplier identifier.
         * @param {Object} supplierData - Partial supplier update payload.
         * @returns {Promise<boolean>} True when update succeeds.
         */
        async updateSupplier(id, supplierData) {
            try {
                await api.updateSupplier(id, supplierData);
                await this.fetchSuppliers();
                return true;
            } catch (error) {
                console.error('Error updating supplier:', error);
                return false;
            }
        },
        /**
         * Deletes a supplier and refreshes the directory.
         *
         * @param {number|string} id - Supplier identifier.
         * @returns {Promise<boolean>} True when deletion succeeds.
         */
        async deleteSupplier(id) {
            try {
                await api.deleteSupplier(id);
                await this.fetchSuppliers();
                return true;
            } catch (error) {
                console.error('Error deleting supplier:', error);
                return false;
            }
        },
        /**
         * Loads supplier incidents ordered from newest to oldest.
         *
         * @returns {Promise<void>} Resolves after `incidentsList` is refreshed.
         */
        async fetchIncidents() {
            this.isLoading = true;
            try {
                const response = await api.getIncidents();
                this.incidentsList = response.data.sort((a, b) => b.id - a.id);
            } catch (error) {
                console.error('Error loading incidents:', error);
            } finally {
                this.isLoading = false;
            }
        },
        /**
         * Creates a supplier incident.
         *
         * @param {Object} incidentData - Incident creation payload.
         * @returns {Promise<boolean>} True when creation succeeds.
         */
        async createIncident(incidentData) {
            try {
                await api.createIncident(incidentData);
                await this.fetchIncidents();
                return true;
            } catch (error) {
                console.error('Error creating incident:', error);
                return false;
            }
        },
        /**
         * Updates the status of a supplier incident.
         *
         * @param {number|string} id - Incident identifier.
         * @param {string} newStatus - Target incident status.
         * @returns {Promise<boolean>} True when update succeeds.
         */
        async updateIncidentStatus(id, newStatus) {
            try {
                await api.updateIncidentStatus(id, { status: newStatus });
                await this.fetchIncidents();
                return true;
            } catch (error) {
                console.error('Error updating incident:', error);
                return false;
            }
        },
        /**
         * Runs local RUC validation simulation and stores the displayed result.
         *
         * @param {string} ruc - RUC value entered by the user.
         * @returns {Promise<{isValid: boolean, message: string}>} Validation result.
         */
        async verifyRuc(ruc) {
            this.isValidatingRuc = true;
            this.rucValidationResult = null;
            const result = await api.validateRuc(ruc);
            this.rucValidationResult = result;
            this.isValidatingRuc = false;
            return result;
        }
    }
});
