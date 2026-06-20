import { defineStore } from 'pinia';
import { SuppliersApi } from '../infrastructure/suppliers-api.js';

const api = new SuppliersApi();

/**
 * Focused Pinia store for supplier incident tracking screens.
 *
 * @description Keeps incident-only state for screens that do not need the full supplier
 * directory store. It still uses `SuppliersApi` because incidents belong to the Suppliers
 * bounded context in the backend contract.
 *
 * @author RQLS TEAM
 */
export const useIncidentsStore = defineStore('incidents', {
    state: () => ({
        incidentsList: [],
        isLoading: false
    }),
    getters: {
        openIncidents: (state) => state.incidentsList.filter(i => i.status === 'Open'),
        inProgressIncidents: (state) => state.incidentsList.filter(i => i.status === 'In Progress'),
        resolvedIncidents: (state) => state.incidentsList.filter(i => i.status === 'Resolved'),
        highSeverity: (state) => state.incidentsList.filter(i => i.severity === 'High'),
    },
    actions: {
        /**
         * Loads supplier incidents from the backend.
         *
         * @returns {Promise<void>} Resolves after `incidentsList` is refreshed.
         */
        async fetchIncidents() {
            this.isLoading = true;
            try {
                const response = await api.getIncidents();
                this.incidentsList = response.data.sort((a, b) => b.id - a.id);
            } catch (error) {
                console.error("Error loading incidents:", error);
            } finally {
                this.isLoading = false;
            }
        },
        /**
         * Creates a supplier incident and refreshes incident state.
         *
         * @param {Object} incident - Incident creation payload.
         * @returns {Promise<boolean>} True when creation succeeds.
         */
        async createIncident(incident) {
            try {
                await api.createIncident(incident);
                await this.fetchIncidents();
                return true;
            } catch (error) {
                console.error("Error creating incident:", error);
                return false;
            }
        },
        /**
         * Updates the status of one incident.
         *
         * @param {number|string} id - Incident identifier.
         * @param {string} newStatus - Target incident status.
         * @returns {Promise<void>} Resolves after the update attempt.
         */
        async updateIncidentStatus(id, newStatus) {
            try {
                await api.updateIncidentStatus(id, { status: newStatus });
                await this.fetchIncidents();
            } catch (error) {
                console.error("Error updating incident:", error);
            }
        }
    }
});
