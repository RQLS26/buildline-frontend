/**
 * Analytics API Service
 * @description Infrastructure layer for budget and analytics HTTP operations.
 * @author RQLS TEAM
 */
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000' });

export class AnalyticsApi {
    /** @summary Retrieves all project budgets. */
    getBudgets() {
        return api.get('/budgets');
    }
}
