/**
 * Inventory API Service
 * @description Infrastructure layer for inventory management HTTP operations.
 * @author RQLS TEAM
 */
import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const inventoryEndpoint = "/inventory";

export class InventoryApi extends BaseApi {
    #inventoryEndpoint;

    constructor() {
        super();
        this.#inventoryEndpoint = new BaseEndpoint(this, inventoryEndpoint);
    }

    getInventoryItems() {
        return this.#inventoryEndpoint.getAll();
    }

    updateStock(id, data) {
        return this.#inventoryEndpoint.update(id, data);
    }
}
