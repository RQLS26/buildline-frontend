import { defineStore } from 'pinia';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000' });

export const useIncidentsStore = defineStore('incidents', {
    state: () => ({
        incidentsList: [],
        isLoading: false
    }),
    actions: {
        async fetchIncidents() {
            this.isLoading = true;
            try {
                const response = await api.get('/incidents');
                this.incidentsList = response.data;
            } catch (error) {
                console.error("Error cargando incidentes:", error);
            } finally {
                this.isLoading = false;
            }
        }
    }
});