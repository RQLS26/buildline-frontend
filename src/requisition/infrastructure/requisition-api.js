import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";
import { apiEndpoints } from "../../shared/infrastructure/api-endpoints.js";

/**
 * Infrastructure API adapter for requisition and material-reference workflows.
 *
 * @class RequisitionApi
 * @extends BaseApi
 * @description Wraps company-scoped requisition and material backend contracts.
 * @author RQLS TEAM
 */
export class RequisitionApi extends BaseApi {
    #materialsEndpoint;
    #requisitionsEndpoint;

    constructor() {
        super();
        this.#materialsEndpoint = new BaseEndpoint(this, apiEndpoints.materials);
        this.#requisitionsEndpoint = new BaseEndpoint(this, apiEndpoints.requisitions);
    }

    /**
     * Retrieves material reference data for request forms.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>>>} Response containing material resources.
     */
    getMaterials() {
        return this.#materialsEndpoint.getAll();
    }

    /**
     * Creates a material requisition.
     *
     * @param {Object} resource - Requisition creation payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the created requisition.
     */
    createRequisition(resource) {
        return this.#requisitionsEndpoint.create(resource);
    }

    /**
     * Retrieves requisitions.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>>>} Response containing requisition resources.
     */
    getRequisitions() {
        return this.#requisitionsEndpoint.getAll();
    }

    /**
     * Partially updates a requisition.
     *
     * @param {number|string} id - Requisition identifier.
     * @param {Object} resource - Partial update payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the updated requisition.
     */
    updateRequisition(id, resource) {
        return this.#requisitionsEndpoint.patch(id, resource);
    }
}
