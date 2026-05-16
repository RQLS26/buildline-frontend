/**
 * Requisition Store
 * @description Pinia store for material requisition requests and inventory operations.
 * @author RQLS TEAM
 */
import { defineStore } from 'pinia';
import axios from 'axios';

const api = axios.create({ baseURL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000') + '/api/v1' });

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
        async fetchRequests() {
            this.isLoading = true;
            try {
                const response = await api.get('/requisitions');
                this.requests = response.data.sort((a, b) => b.id - a.id);
            } catch (error) {
                console.error("Error loading requests:", error);
            } finally {
                this.isLoading = false;
            }
        },
        async createRequest(newReq) {
            try {
                await api.post('/requisitions', newReq);
                await this.fetchRequests();
                return true;
            } catch (error) {
                console.error("Error creating request:", error);
                return false;
            }
        }
    }
});
