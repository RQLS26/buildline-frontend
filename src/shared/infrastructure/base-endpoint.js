/**
 * Base Endpoint
 * @description Generic CRUD endpoint handler. Wraps HTTP methods for a specific resource path.
 *              Used by all bounded context API classes.
 * @author RQLS TEAM
 */
export class BaseEndpoint {
    #resourceEndpoint;
    #baseApi;

    /**
     * @param {BaseApi} baseApi - The API instance providing the HTTP client.
     * @param {string} resourceEndpoint - The resource path (e.g. "/deliveries").
     */
    constructor(baseApi, resourceEndpoint) {
        this.#baseApi = baseApi;
        this.#resourceEndpoint = resourceEndpoint;
    }

    /** @summary Retrieves all resources. */
    getAll() {
        return this.#baseApi.http.get(this.#resourceEndpoint);
    }

    /** @summary Retrieves a single resource by ID. */
    getById(id) {
        return this.#baseApi.http.get(`${this.#resourceEndpoint}/${id}`);
    }

    /** @summary Creates a new resource. */
    create(resource) {
        return this.#baseApi.http.post(this.#resourceEndpoint, resource);
    }

    /** @summary Updates an existing resource by ID. */
    update(id, resource) {
        return this.#baseApi.http.put(`${this.#resourceEndpoint}/${id}`, resource);
    }

    /** @summary Deletes a resource by ID. */
    delete(id) {
        return this.#baseApi.http.delete(`${this.#resourceEndpoint}/${id}`);
    }
}
