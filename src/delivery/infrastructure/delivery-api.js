import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";
import { apiEndpoints } from "../../shared/infrastructure/api-endpoints.js";

/**
 * Infrastructure API adapter for delivery tracking resources.
 *
 * @class DeliveryApi
 * @extends BaseApi
 * @description Wraps `/api/v1/deliveries` operations used by the delivery tracking view.
 * @author RQLS TEAM
 */
export class DeliveryApi extends BaseApi {
    #deliveriesEndpoint;

    constructor() {
        super();
        this.#deliveriesEndpoint = new BaseEndpoint(this, apiEndpoints.deliveries);
    }

    /**
     * Retrieves all delivery records.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>>>} Response containing delivery resources.
     */
    getDeliveries() {
        return this.#deliveriesEndpoint.getAll();
    }

    /**
     * Retrieves one delivery by identifier.
     *
     * @param {number|string} id - Delivery identifier.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the delivery resource.
     */
    getDeliveryById(id) {
        return this.#deliveriesEndpoint.getById(id);
    }

    /**
     * Creates a delivery record.
     *
     * @param {Object} resource - Delivery creation payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the created delivery.
     */
    createDelivery(resource) {
        return this.#deliveriesEndpoint.create(resource);
    }

    /**
     * Updates delivery status and related tracking fields.
     *
     * @param {number|string} id - Delivery identifier.
     * @param {Object} resource - Partial update payload, commonly `{ status }`.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the updated delivery.
     */
    updateDeliveryStatus(id, resource) {
        return this.#deliveriesEndpoint.patch(id, resource);
    }
}
