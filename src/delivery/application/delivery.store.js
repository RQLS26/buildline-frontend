/**
 * Delivery Store
 * @description Pinia store for the Delivery & Tracking bounded context.
 * @author RQLS TEAM
 */
import { defineStore } from 'pinia';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000' });

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
        /** @summary Fetches all deliveries from the API. */
        async fetchDeliveries() {
            this.isLoading = true;
            try {
                const response = await api.get('/deliveries');
                this.deliveries = response.data;
            } catch (error) {
                console.error('Error loading deliveries:', error);
            } finally {
                this.isLoading = false;
            }
        },
        /**
         * @summary Updates delivery status by ID.
         * @param {number|string} id - Delivery ID.
         * @param {string} newStatus - New status value.
         * @returns {Promise<boolean>}
         */
        async updateDeliveryStatus(id, newStatus) {
            try {
                await api.patch(`/deliveries/${id}`, { status: newStatus });
                await this.fetchDeliveries();
                return true;
            } catch (error) {
                console.error('Error updating delivery status:', error);
                return false;
            }
        },
        /**
         * @summary Creates a new delivery record.
         * @param {Object} deliveryData - Delivery payload.
         * @returns {Promise<boolean>}
         */
        async createDelivery(deliveryData) {
            try {
                await api.post('/deliveries', deliveryData);
                await this.fetchDeliveries();
                return true;
            } catch (error) {
                console.error('Error creating delivery:', error);
                return false;
            }
        }
    }
});
