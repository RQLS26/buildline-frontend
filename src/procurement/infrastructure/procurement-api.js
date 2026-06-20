import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";
import { apiEndpoints } from "../../shared/infrastructure/api-endpoints.js";

/**
 * Infrastructure API adapter for procurement workflows.
 *
 * @class ProcurementApi
 * @extends BaseApi
 * @description Wraps purchase-order and quotation endpoints used by procurement screens.
 * @author RQLS TEAM
 */
export class ProcurementApi extends BaseApi {
    #purchaseOrdersEndpoint;
    #quotationsEndpoint;

    constructor() {
        super();
        this.#purchaseOrdersEndpoint = new BaseEndpoint(this, apiEndpoints.purchaseOrders);
        this.#quotationsEndpoint = new BaseEndpoint(this, apiEndpoints.quotations);
    }

    /**
     * Retrieves purchase orders.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>>>} Response containing purchase order resources.
     */
    getPurchaseOrders() {
        return this.#purchaseOrdersEndpoint.getAll();
    }

    /**
     * Creates a purchase order.
     *
     * @param {Object} resource - Purchase order creation payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the created purchase order.
     */
    createPurchaseOrder(resource) {
        return this.#purchaseOrdersEndpoint.create(resource);
    }

    /**
     * Updates purchase order status.
     *
     * @param {number|string} id - Purchase order identifier.
     * @param {Object} data - Partial update payload, commonly `{ status }`.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the updated purchase order.
     */
    updateOrderStatus(id, data) {
        return this.#purchaseOrdersEndpoint.patch(id, data);
    }

    /**
     * Retrieves quotations.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>>>} Response containing quotation resources.
     */
    getQuotations() {
        return this.#quotationsEndpoint.getAll();
    }

    /**
     * Creates a quotation.
     *
     * @param {Object} resource - Quotation creation payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the created quotation.
     */
    createQuotation(resource) {
        return this.#quotationsEndpoint.create(resource);
    }
}
