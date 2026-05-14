import { BaseApi } from "../../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../../shared/infrastructure/base-endpoint.js";

const profilesEndpoint = "/profiles";

export class ProfilesApi extends BaseApi {
    #profilesEndpoint;

    constructor() {
        super();
        this.#profilesEndpoint = new BaseEndpoint(this, profilesEndpoint);
    }

    getProfileById(id) {
        return this.#profilesEndpoint.getById(id);
    }

    updateProfile(id, resource) {
        return this.#profilesEndpoint.update(id, resource);
    }
}