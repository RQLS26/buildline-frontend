import { defineStore } from 'pinia';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api/v1' });

export const useRequisitionStore = defineStore('requisition', {
    state: () => ({
        requests: [],
        isLoading: false
    }),
    actions: {
        async fetchRequests() {
            this.isLoading = true;
            try {
                const response = await api.get('/requisitions');
                // Ordenamos para que los más recientes salgan primero
                this.requests = response.data.sort((a, b) => b.id - a.id);
            } catch (error) {
                console.error("Error cargando pedidos:", error);
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
                console.error("Error creando pedido:", error);
                return false;
            }
        }
    }
});