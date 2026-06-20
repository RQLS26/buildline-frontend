import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";
import { apiEndpoints } from "../../shared/infrastructure/api-endpoints.js";

/**
 * Infrastructure API adapter for analytics and budgeting resources.
 *
 * @class AnalyticsApi
 * @extends BaseApi
 * @description Wraps budget endpoints consumed by the financial dashboard and reports.
 * @author RQLS TEAM
 */
export class AnalyticsApi extends BaseApi {
    #budgetsEndpoint;

    constructor() {
        super();
        this.#budgetsEndpoint = new BaseEndpoint(this, apiEndpoints.analyticsBudgets);
    }

    /**
     * Retrieves project budget records.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>>>} Response containing budget resources.
     */
    getBudgets() {
        return this.#budgetsEndpoint.getAll();
    }
}
