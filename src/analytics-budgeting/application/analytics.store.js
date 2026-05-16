/**
 * Analytics Store
 * @description Pinia store for budget analytics, project costs, and financial data.
 * @author RQLS TEAM
 */
import { defineStore } from 'pinia';
import { AnalyticsApi } from '../infrastructure/analytics-api.js';

export const useAnalyticsStore = defineStore('analytics', {
    state: () => ({
        budgets: [],
        isLoading: false
    }),
    getters: {
        totalBudget: (state) => state.budgets.reduce((sum, b) => sum + (b.totalBudget || 0), 0),
        totalSpent: (state) => state.budgets.reduce((sum, b) => sum + (b.spent || 0), 0),
        totalRemaining() { return this.totalBudget - this.totalSpent; },
        spentPercentage() { return this.totalBudget > 0 ? Math.round((this.totalSpent / this.totalBudget) * 100) : 0; },
    },
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
