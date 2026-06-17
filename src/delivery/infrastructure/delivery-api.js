/**
 * Delivery API Service
 * @description Infrastructure layer for delivery-related HTTP operations.
 * @author RQLS TEAM
 */
import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const deliveriesEndpoint = "api/v1/deliveries";

export class DeliveryApi extends BaseApi {
    #deliveriesEndpoint;

    constructor() {
        super();
        this.#deliveriesEndpoint = new BaseEndpoint(this, deliveriesEndpoint);
    }

    getDeliveries() {
        return this.#deliveriesEndpoint.getAll();
    }

    getDeliveryById(id) {
        return this.#deliveriesEndpoint.getById(id);
    }

    createDelivery(resource) {
        return this.#deliveriesEndpoint.create(resource);
    }

    updateDelivery(resource) {
        return this.#deliveriesEndpoint.update(resource.id, resource);
    }
}
