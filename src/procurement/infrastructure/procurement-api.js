import { BaseApi } from "../../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../../shared/infrastructure/base-endpoint.js";

const purchaseOrdersEndpoint = "/purchaseOrders";

export class ProcurementApi extends BaseApi {
    #purchaseOrdersEndpoint;

    constructor() {
        super();
        this.#purchaseOrdersEndpoint = new BaseEndpoint(this, purchaseOrdersEndpoint);
    }

    getPurchaseOrders() {
        return this.#purchaseOrdersEndpoint.getAll();
    }

    updateOrderStatus(id, data) {
        return this.#purchaseOrdersEndpoint.update(id, data);
    }
}