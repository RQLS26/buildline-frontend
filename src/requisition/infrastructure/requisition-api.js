/**
 * Requisition API Service
 * @description Infrastructure layer for material requisition HTTP operations.
 * @author RQLS TEAM
 */
import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const materialsEndpoint = "/materials";
const requisitionsEndpoint = "/requisitions";

export class RequisitionApi extends BaseApi {
    #materialsEndpoint;
    #requisitionsEndpoint;

    constructor() {
        super();
        this.#materialsEndpoint = new BaseEndpoint(this, materialsEndpoint);
        this.#requisitionsEndpoint = new BaseEndpoint(this, requisitionsEndpoint);
    }

    getMaterials() {
        return this.#materialsEndpoint.getAll();
    }

    createRequisition(resource) {
        return this.#requisitionsEndpoint.create(resource);
    }
}
