import { defineStore } from 'pinia';
import { CommunicationApi } from '../infrastructure/communication-api.js';

export const useCommunicationStore = defineStore('communication', {
    state: () => ({
        messages: [],
        isLoading: false
    }),
    actions: {
        async fetchMessages() {
            this.isLoading = true;
            try {
                const api = new CommunicationApi();
                const response = await api.getMessages();
                // Ordenamos para que los más nuevos salgan arriba
                this.messages = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            } catch (error) {
                console.error("Error cargando mensajes:", error);
            } finally {
                this.isLoading = false;
            }
        },
        async createMessage(newMessage) {
            try {
                const api = new CommunicationApi();
                await api.sendMessage(newMessage);
                await this.fetchMessages(); // Recargamos la tabla
                return true;
            } catch (error) {
                console.error("Error enviando mensaje:", error);
                return false;
            }
        },
        async deleteMessage(id) {
            try {
                const api = new CommunicationApi();
                await api.deleteMessage(id);
                await this.fetchMessages(); // Recargamos la tabla
            } catch (error) {
                console.error("Error eliminando mensaje:", error);
            }
        }
    }
});