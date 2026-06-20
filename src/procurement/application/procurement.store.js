import { defineStore } from 'pinia';
import { ProcurementApi } from '../infrastructure/procurement-api.js';
import { scopedResources, withCompanyScope } from '../../shared/application/company-scope.js';

const api = new ProcurementApi();

/**
 * Pinia store for procurement purchase orders and quotations.
 *
 * @description Coordinates order and quotation actions with `ProcurementApi` while
 * exposing dashboard-friendly subsets such as pending, approved and rejected orders.
 *
 * @author RQLS TEAM
 */
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
        /**
         * Loads purchase orders ordered from newest to oldest.
         *
         * @returns {Promise<void>} Resolves after `purchaseOrders` is refreshed.
         */
        async fetchOrders() {
            this.isLoading = true;
            try {
                const response = await api.getPurchaseOrders();
                this.purchaseOrders = scopedResources(response.data).sort((a, b) => b.id - a.id);
            } catch (error) {
                console.error('Error loading purchase orders:', error);
            } finally {
                this.isLoading = false;
            }
        },
        /**
         * Creates a purchase order and refreshes order state.
         *
         * @param {Object} order - Purchase order creation payload.
         * @returns {Promise<boolean>} True when creation succeeds.
         */
        async createOrder(order) {
            try {
                await api.createPurchaseOrder(withCompanyScope(order));
                await this.fetchOrders();
                return true;
            } catch (error) {
                console.error('Error creating order:', error);
                return false;
            }
        },
        /**
         * Updates a purchase order status.
         *
         * @param {number|string} id - Purchase order identifier.
         * @param {string} newStatus - Target status value.
         * @returns {Promise<void>} Resolves after the optional refresh.
         */
        async updateOrderStatus(id, newStatus) {
            try {
                const order = this.purchaseOrders.find(o => o.id === id);
                if (order) {
                    await api.updateOrderStatus(id, { status: newStatus });
                    await this.fetchOrders();
                }
            } catch (error) {
                console.error('Error updating order status:', error);
            }
        },
        /**
         * Loads quotations ordered from newest to oldest.
         *
         * @returns {Promise<void>} Resolves after `quotations` is refreshed.
         */
        async fetchQuotations() {
            this.isLoading = true;
            try {
                const response = await api.getQuotations();
                this.quotations = scopedResources(response.data).sort((a, b) => b.id - a.id);
            } catch (error) {
                console.error('Error loading quotations:', error);
            } finally {
                this.isLoading = false;
            }
        },
        /**
         * Creates a quotation and refreshes quotation state.
         *
         * @param {Object} quotation - Quotation creation payload.
         * @returns {Promise<boolean>} True when creation succeeds.
         */
        async createQuotation(quotation) {
            try {
                await api.createQuotation(withCompanyScope(quotation));
                await this.fetchQuotations();
                return true;
            } catch (error) {
                console.error('Error creating quotation:', error);
                return false;
            }
        }
    }
});
