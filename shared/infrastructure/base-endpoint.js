export class BaseEndpoint {
    #resourceEndpoint;
    #baseApi;

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