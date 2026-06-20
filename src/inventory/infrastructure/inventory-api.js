import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";
import { apiEndpoints } from "../../shared/infrastructure/api-endpoints.js";

/**
 * Infrastructure API adapter for warehouse inventory resources.
 *
 * @class InventoryApi
 * @extends BaseApi
 * @description Provides semantic methods for the company-scoped inventory backend contract.
 * @author RQLS TEAM
 */
export class InventoryApi extends BaseApi {
    #inventoryEndpoint;

    constructor() {
        super();
        this.#inventoryEndpoint = new BaseEndpoint(this, apiEndpoints.inventory);
    }

    /**
     * Retrieves current inventory items.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>>>} Response containing inventory item resources.
     */
    getInventoryItems() {
        return this.#inventoryEndpoint.getAll();
    }

    /**
     * Updates stock-related fields for an inventory item.
     *
     * @param {number|string} id - Inventory item identifier.
     * @param {Object} data - Partial stock update payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the updated inventory item.
     */
    updateStock(id, data) {
        return this.#inventoryEndpoint.patch(id, data);
    }

    /**
     * Creates a new inventory item from the inventory management view.
     *
     * @param {Object} resource - Inventory item creation payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the created inventory item.
     */
    createInventoryItem(resource) {
        return this.#inventoryEndpoint.create(resource);
    }

    /**
     * Partially updates an inventory item.
     *
     * @param {number|string} id - Inventory item identifier.
     * @param {Object} resource - Partial update payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the updated inventory item.
     */
    updateInventoryItem(id, resource) {
        return this.#inventoryEndpoint.patch(id, resource);
    }
}
