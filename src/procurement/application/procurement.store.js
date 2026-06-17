/**
 * Procurement Store
 * @description Pinia store for purchase order management and approval workflows.
 * @author RQLS TEAM
 */
import { defineStore } from 'pinia';
import axios from 'axios';

const api = axios.create({ baseURL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000') });

export const useProcurementStore = defineStore('procurement', {
    state: () => ({
        purchaseOrders: [],
        quotations: [],
        isLoading: false
    }),
    getters: {
        totalSpent: (state) => state.purchaseOrders
            .filter(o => o.status === 'Approved')
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
        pendingOrders: (state) => state.purchaseOrders.filter(o => o.status === 'Pending'),
        approvedOrders: (state) => state.purchaseOrders.filter(o => o.status === 'Approved'),
        rejectedOrders: (state) => state.purchaseOrders.filter(o => o.status === 'Rejected'),
        pendingQuotations: (state) => state.quotations.filter(q => q.status === 'Pending'),
        acceptedQuotations: (state) => state.quotations.filter(q => q.status === 'Accepted'),
    },
    actions: {
        async fetchOrders() {
            this.isLoading = true;
            try {
                const response = await api.get('/api/v1/purchaseOrders');
                this.purchaseOrders = response.data.sort((a, b) => b.id - a.id);
            } catch (error) {
                console.error('Error loading purchase orders:', error);
            } finally {
                this.isLoading = false;
            }
        },
        async createOrder(order) {
            try {
                await api.post('/api/v1/purchaseOrders', order);
                await this.fetchOrders();
                return true;
            } catch (error) {
                console.error('Error creating order:', error);
                return false;
            }
        },
        async updateOrderStatus(id, newStatus) {
            try {
                const order = this.purchaseOrders.find(o => o.id === id);
                if (order) {
                    await api.patch(`/api/v1/purchaseOrders/${id}`, { status: newStatus });
                    await this.fetchOrders();
                }
            } catch (error) {
                console.error('Error updating order status:', error);
            }
        },
        async fetchQuotations() {
            this.isLoading = true;
            try {
                const response = await api.get('/api/v1/quotations');
                this.quotations = response.data.sort((a, b) => b.id - a.id);
            } catch (error) {
                console.error('Error loading quotations:', error);
            } finally {
                this.isLoading = false;
            }
        },
        async createQuotation(quotation) {
            try {
                await api.post('/api/v1/quotations', quotation);
                await this.fetchQuotations();
                return true;
            } catch (error) {
                console.error('Error creating quotation:', error);
                return false;
            }
        }
    }
});
