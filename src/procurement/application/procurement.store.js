import { defineStore } from 'pinia';
import { ProcurementApi } from '../infrastructure/procurement-api.js';

export const useProcurementStore = defineStore('procurement', {
    state: () => ({
        purchaseOrders: [],
        isLoading: false
    }),
    actions: {
        async fetchOrders() {
            this.isLoading = true;
            try {
                const api = new ProcurementApi();
                const response = await api.getPurchaseOrders();
                // Ordenar para que las pendientes salgan primero
                this.purchaseOrders = response.data.sort((a, b) => {
                    if (a.status === 'Pendiente' && b.status !== 'Pendiente') return -1;
                    if (a.status !== 'Pendiente' && b.status === 'Pendiente') return 1;
                    return 0;
                });
            } catch (error) {
                console.error('Error cargando órdenes de compra:', error);
            } finally {
                this.isLoading = false;
            }
        },
        async updateStatus(orderId, newStatus) {
            try {
                const api = new ProcurementApi();
                const order = this.purchaseOrders.find(o => o.id === orderId);

                if (order) {
                    const updatedOrder = { ...order, status: newStatus };
                    await api.updateOrderStatus(orderId, updatedOrder);
                    await this.fetchOrders(); // Recargar la lista
                }
            } catch (error) {
                console.error('Error actualizando estado:', error);
            }
        }
    }
});