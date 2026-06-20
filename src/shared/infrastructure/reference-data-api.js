import { BaseApi } from './base-api.js';
import { BaseEndpoint } from './base-endpoint.js';
import { apiEndpoints } from './api-endpoints.js';

/**
 * Infrastructure API adapter for shared catalog resources.
 *
 * @class ReferenceDataApi
 * @extends BaseApi
 * @description
 * Provides semantic access to backend catalog endpoints consumed across bounded
 * contexts. Keeping these calls in a shared adapter prevents views from hard-coding
 * project, category or material lists.
 *
 * @author RQLS TEAM
 */
export class ReferenceDataApi extends BaseApi {
    #projectsEndpoint;
    #categoriesEndpoint;
    #materialsEndpoint;

    constructor() {
        super();
        this.#projectsEndpoint = new BaseEndpoint(this, apiEndpoints.analyticsProjects);
        this.#categoriesEndpoint = new BaseEndpoint(this, apiEndpoints.categories);
        this.#materialsEndpoint = new BaseEndpoint(this, apiEndpoints.materials);
    }

    /**
     * Retrieves construction projects available to frontend filters and forms.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>>>} Response containing project resources.
     */
    getProjects() {
        return this.#projectsEndpoint.getAll();
    }

    /**
     * Retrieves material categories available to inventory and supplier workflows.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>>>} Response containing category resources.
     */
    getCategories() {
        return this.#categoriesEndpoint.getAll();
    }

    /**
     * Retrieves material references available to requisition, inventory and procurement forms.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>>>} Response containing material resources.
     */
    getMaterials() {
        return this.#materialsEndpoint.getAll();
    }
}
