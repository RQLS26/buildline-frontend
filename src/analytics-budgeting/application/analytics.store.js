import { defineStore } from 'pinia';
import { AnalyticsApi } from '../infrastructure/analytics-api.js';

/**
 * Pinia store for analytics and budgeting dashboard state.
 *
 * @description Loads budget data through `AnalyticsApi` and exposes aggregate financial
 * indicators consumed by dashboard widgets.
 *
 * @author RQLS TEAM
 */
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
        /**
         * Loads budget records from the backend.
         *
         * @returns {Promise<void>} Resolves after `budgets` is refreshed.
         */
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
