import { defineStore } from 'pinia';
import { AnalyticsApi } from '../infrastructure/analytics-api.js';

export const useAnalyticsStore = defineStore('analytics', {
    state: () => ({
        budgets: [],
        isLoading: false
    }),
    actions: {
        async fetchBudgets() {
            this.isLoading = true;
            try {
                const api = new AnalyticsApi();
                const response = await api.getBudgets();
                this.budgets = response.data;
            } catch (error) {
                console.error("Error cargando presupuestos:", error);
            } finally {
                this.isLoading = false;
            }
        }
    }
});