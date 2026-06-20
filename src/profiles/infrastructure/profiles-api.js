import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";
import { apiEndpoints } from "../../shared/infrastructure/api-endpoints.js";

/**
 * Infrastructure API adapter for company profile resources.
 *
 * @class ProfilesApi
 * @extends BaseApi
 * @description Wraps `/api/v1/profiles` operations used by the company profile view.
 * @author RQLS TEAM
 */
export class ProfilesApi extends BaseApi {
    #profilesEndpoint;

    constructor() {
        super();
        this.#profilesEndpoint = new BaseEndpoint(this, apiEndpoints.profiles);
    }

    /**
     * Retrieves a company profile by identifier.
     *
     * @param {number|string} id - Profile identifier.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the profile resource.
     */
    getProfileById(id) {
        return this.#profilesEndpoint.getById(id);
    }

    /**
     * Replaces editable company profile fields through the backend PUT endpoint.
     *
     * @param {number|string} id - Profile identifier.
     * @param {Object} resource - Complete profile payload submitted by the view.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the updated profile resource.
     */
    updateProfile(id, resource) {
        return this.#profilesEndpoint.update(id, resource);
    }
}
