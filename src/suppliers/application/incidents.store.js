/**
 * Incidents Store
 * @description Pinia store for supplier incident tracking and resolution workflows.
 * @author RQLS TEAM
 */
import { defineStore } from 'pinia';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api/v1' });

export const useIncidentsStore = defineStore('incidents', {
    state: () => ({
        incidentsList: [],
        isLoading: false
    }),
    getters: {
        openIncidents: (state) => state.incidentsList.filter(i => i.status === 'Open'),
        inProgressIncidents: (state) => state.incidentsList.filter(i => i.status === 'In Progress'),
        resolvedIncidents: (state) => state.incidentsList.filter(i => i.status === 'Resolved'),
        highSeverity: (state) => state.incidentsList.filter(i => i.severity === 'High'),
    },
    actions: {
        async fetchIncidents() {
            this.isLoading = true;
            try {
                const response = await api.get('/incidents');
                this.incidentsList = response.data.sort((a, b) => b.id - a.id);
            } catch (error) {
                console.error("Error loading incidents:", error);
            } finally {
                this.isLoading = false;
            }
        },
        async createIncident(incident) {
            try {
                await api.post('/incidents', incident);
                await this.fetchIncidents();
                return true;
            } catch (error) {
                console.error("Error creating incident:", error);
                return false;
            }
        },
        async updateIncidentStatus(id, newStatus) {
            try {
                await api.patch(`/incidents/${id}`, { status: newStatus });
                await this.fetchIncidents();
            } catch (error) {
                console.error("Error updating incident:", error);
            }
        }
    }
});
