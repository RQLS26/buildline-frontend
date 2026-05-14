import { defineStore } from 'pinia';
import { ProcurementApi } from '../infrastructure/procurement-api.js';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api/v1' });

export const useProcurementStore = defineStore('procurement', {
    state: () => ({
        // Para Bandeja de Aprobaciones (Órdenes de Compra)
        purchaseOrders: [],

        // Para Cotizaciones (Quotations)
        requests: [],
        suppliers: [],

        isLoading: false
    }),
    actions: {
        async fetchOrders() {
            this.isLoading = true;
            try {
                const procurementApi = new ProcurementApi();
                const response = await procurementApi.getPurchaseOrders();
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
                const procurementApi = new ProcurementApi();
                const order = this.purchaseOrders.find(o => o.id === orderId);
                if (order) {
                    const updatedOrder = { ...order, status: newStatus };
                    await procurementApi.updateOrderStatus(orderId, updatedOrder);
                    await this.fetchOrders();
                }
            } catch (error) {
                console.error('Error actualizando estado:', error);
            }
        },

        async fetchQuotationData() {
            this.isLoading = true;
            try {
                const [reqRes, supRes] = await Promise.all([
                    api.get('/requisitions'),
                    api.get('/suppliers')
                ]);
                this.requests = reqRes.data;
                this.suppliers = supRes.data;
            } catch (error) {
                console.error("Error cargando datos para cotizaciones:", error);
            } finally {
                this.isLoading = false;
            }
        },
        async createQuotation(newQuotation) {
            try {
                await api.post('/quotations', newQuotation);
                return true;
            } catch (error) {
                console.error("Error enviando solicitud de cotización:", error);
                return false;
            }
        }
    }
});