/**
 * Reusable REST endpoint wrapper for collection-style backend resources.
 *
 * @class BaseEndpoint
 * @description
 * Provides the shared CRUD method implementations used by bounded-context API adapters.
 * The class receives a `BaseApi` owner and a resource path provider such as
 * `api/v1/companies/1/inventory`; it then composes the final request URLs through the
 * already-configured Axios client.
 *
 * This class deliberately stays infrastructure-only. It should not be imported by Vue
 * views or Pinia stores directly; stores should call methods exposed by context adapters.
 *
 * @author RQLS TEAM
 */
export class BaseEndpoint {
    #resourceEndpoint;
    #baseApi;

    /**
     * Creates a resource endpoint wrapper.
     *
     * @param {import('./base-api.js').BaseApi} baseApi - Context API instance that owns the configured HTTP client.
     * @param {string|(() => string)} resourceEndpoint - Relative backend route without a leading slash, or a provider used for company-scoped routes.
     */
    constructor(baseApi, resourceEndpoint) {
        this.#baseApi = baseApi;
        this.#resourceEndpoint = resourceEndpoint;
    }

    /**
     * Resolves the endpoint path for the current request.
     *
     * @returns {string} Relative backend route for the current active session.
     * @description
     * Company-scoped endpoints are functions because the active company is only known after
     * authentication. Resolving the path per call prevents stale routes when a user signs out
     * and another company account signs in inside the same browser session.
     */
    #resolveResourceEndpoint() {
        return typeof this.#resourceEndpoint === 'function'
            ? this.#resourceEndpoint()
            : this.#resourceEndpoint;
    }

    /**
     * Retrieves every resource from the collection.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>>>} Axios response containing the resource list.
     */
    getAll() {
        return this.#baseApi.http.get(this.#resolveResourceEndpoint());
    }

    /**
     * Retrieves a single resource by backend identifier.
     *
     * @param {string|number} id - Backend resource identifier.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Axios response containing the requested resource.
     */
    getById(id) {
        return this.#baseApi.http.get(`${this.#resolveResourceEndpoint()}/${id}`);
    }

    /**
     * Creates a resource in the collection.
     *
     * @param {Object} resource - Payload expected by the backend create endpoint.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Axios response containing the created resource or command result.
     */
    create(resource) {
        return this.#baseApi.http.post(this.#resolveResourceEndpoint(), resource);
    }

    /**
     * Replaces a resource through HTTP PUT.
     *
     * @param {string|number} id - Backend resource identifier.
     * @param {Object} resource - Complete replacement payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Axios response containing the updated resource.
     */
    update(id, resource) {
        return this.#baseApi.http.put(`${this.#resolveResourceEndpoint()}/${id}`, resource);
    }

    /**
     * Partially updates a resource through HTTP PATCH.
     *
     * @param {string|number} id - Backend resource identifier.
     * @param {Object} resource - Partial update payload accepted by the backend.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Axios response containing the updated resource.
     */
    patch(id, resource) {
        return this.#baseApi.http.patch(`${this.#resolveResourceEndpoint()}/${id}`, resource);
    }

    /**
     * Deletes a resource by backend identifier.
     *
     * @param {string|number} id - Backend resource identifier.
     * @returns {Promise<import('axios').AxiosResponse<void|Object>>} Axios response returned by the delete endpoint.
     */
    delete(id) {
        return this.#baseApi.http.delete(`${this.#resolveResourceEndpoint()}/${id}`);
    }
}
