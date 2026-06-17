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

    getAll() {
        return this.#baseApi.http.get(this.#resourceEndpoint);
    }

    getById(id) {
        return this.#baseApi.http.get(`${this.#resourceEndpoint}/${id}`);
    }

    create(resource) {
        return this.#baseApi.http.post(this.#resourceEndpoint, resource);
    }

    update(id, resource) {
        return this.#baseApi.http.put(`${this.#resourceEndpoint}/${id}`, resource);
    }

    delete(id) {
        return this.#baseApi.http.delete(`${this.#resourceEndpoint}/${id}`);
    }
}
