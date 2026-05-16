/**
 * Delivery API Service
 * @description Infrastructure layer for delivery-related HTTP operations.
 * @author RQLS TEAM
 */
import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const deliveriesEndpoint = "/deliveries";

export class DeliveryApi extends BaseApi {
    #deliveriesEndpoint;

    constructor() {
        super();
        this.#deliveriesEndpoint = new BaseEndpoint(this, deliveriesEndpoint);
    }

    /** @summary Retrieves all deliveries. */
    getDeliveries() {
        return this.#deliveriesEndpoint.getAll();
    }

    /** @summary Retrieves a delivery by its ID. */
    getDeliveryById(id) {
        return this.#deliveriesEndpoint.getById(id);
    }

    /** @summary Creates a new delivery record. */
    createDelivery(resource) {
        return this.#deliveriesEndpoint.create(resource);
    }

    /** @summary Updates an existing delivery record. */
    updateDelivery(resource) {
        return this.#deliveriesEndpoint.update(resource.id, resource);
    }
}
