import { defineStore } from 'pinia';
import { DeliveryApi } from '../infrastructure/delivery-api.js';

const api = new DeliveryApi();

/**
 * Pinia store for delivery tracking and status updates.
 *
 * @description Loads delivery resources through `DeliveryApi` and exposes derived
 * collections used by the tracking dashboard.
 *
 * @author RQLS TEAM
 */
export const useDeliveryStore = defineStore('delivery', {
    state: () => ({
        deliveries: [],
        isLoading: false
    }),
    getters: {
        /** @summary Filters deliveries currently in transit. */
        inTransit: (state) => state.deliveries.filter(d => d.status === 'In Transit'),
        /** @summary Filters delayed deliveries. */
        delayed: (state) => state.deliveries.filter(d => d.status === 'Delayed'),
        /** @summary Filters delivered shipments. */
        delivered: (state) => state.deliveries.filter(d => d.status === 'Delivered'),
        /** @summary Filters shipped deliveries. */
        shipped: (state) => state.deliveries.filter(d => d.status === 'Shipped'),
        /** @summary Returns the next pending arrival or null. */
        nextArrival: (state) => {
            const pending = state.deliveries.filter(d => d.status !== 'Delivered');
            return pending.length > 0 ? pending[0] : null;
        },
        /** @summary Calculates on-time delivery rate percentage. */
        onTimeRate: (state) => {
            if (state.deliveries.length === 0) return 0;
            const total = state.deliveries.length;
            const onTime = state.deliveries.filter(d => d.status !== 'Delayed').length;
            return Math.round((onTime / total) * 100);
        }
    },
    actions: {
        /**
         * Fetches all deliveries from the backend.
         *
         * @returns {Promise<void>} Resolves after `deliveries` is refreshed.
         */
        async fetchDeliveries() {
            this.isLoading = true;
            try {
                const response = await api.getDeliveries();
                this.deliveries = response.data;
            } catch (error) {
                console.error('Error loading deliveries:', error);
            } finally {
                this.isLoading = false;
            }
        },
        /**
         * Updates delivery status by ID.
         *
         * @param {number|string} id - Delivery ID.
         * @param {string} newStatus - New status value.
         * @returns {Promise<boolean>} True when the backend accepts the update.
         */
        async updateDeliveryStatus(id, newStatus) {
            try {
                await api.updateDeliveryStatus(id, { status: newStatus });
                await this.fetchDeliveries();
                return true;
            } catch (error) {
                console.error('Error updating delivery status:', error);
                return false;
            }
        },
        /**
         * Creates a new delivery record.
         *
         * @param {Object} deliveryData - Delivery payload.
         * @returns {Promise<boolean>} True when creation succeeds.
         */
        async createDelivery(deliveryData) {
            try {
                await api.createDelivery(deliveryData);
                await this.fetchDeliveries();
                return true;
            } catch (error) {
                console.error('Error creating delivery:', error);
                return false;
            }
        }
    }
});
