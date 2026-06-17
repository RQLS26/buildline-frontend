/**
 * Analytics API Service
 * @description Infrastructure layer for budget and analytics HTTP operations.
 * @author RQLS TEAM
 */
import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const budgetsEndpoint = "api/v1/budgets";

export class AnalyticsApi extends BaseApi {
    #budgetsEndpoint;

    constructor() {
        super();
        this.#budgetsEndpoint = new BaseEndpoint(this, budgetsEndpoint);
    }

    getBudgets() {
        return this.#budgetsEndpoint.getAll();
    }
}
