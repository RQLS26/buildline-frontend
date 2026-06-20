import { defineStore } from 'pinia';
import { RequisitionApi } from '../infrastructure/requisition-api.js';
import { scopedResources, withCompanyScope } from '../../shared/application/company-scope.js';

const api = new RequisitionApi();

/**
 * Pinia store for material requisition workflows.
 *
 * @description Coordinates requisition listing and creation with the backend while
 * exposing status-based getters consumed by tabs and counters.
 *
 * @author RQLS TEAM
 */
export const useRequisitionStore = defineStore('requisition', {
    state: () => ({
        requests: [],
        isLoading: false
    }),
    getters: {
        pendingRequests: (state) => state.requests.filter(r => r.status === 'Pending'),
        approvedRequests: (state) => state.requests.filter(r => r.status === 'Approved'),
        rejectedRequests: (state) => state.requests.filter(r => r.status === 'Rejected'),
        highPriorityPending: (state) => state.requests.filter(r => r.status === 'Pending' && r.priority === 'High'),
    },
    actions: {
        /**
         * Loads material requisitions from the backend.
         *
         * @returns {Promise<void>} Resolves after `requests` is refreshed.
         */
        async fetchRequests() {
            this.isLoading = true;
            try {
                const response = await api.getRequisitions();
                this.requests = scopedResources(response.data).sort((a, b) => b.id - a.id);
            } catch (error) {
                console.error("Error loading requests:", error);
            } finally {
                this.isLoading = false;
            }
        },
        /**
         * Creates a material requisition and refreshes the list.
         *
         * @param {Object} newReq - Requisition payload built by the material request view.
         * @returns {Promise<boolean>} True when creation succeeds.
         */
        async createRequest(newReq) {
            try {
                await api.createRequisition(withCompanyScope(newReq));
                await this.fetchRequests();
                return true;
            } catch (error) {
                console.error("Error creating request:", error);
                return false;
            }
        }
    }
});
