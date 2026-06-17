/**
 * IAM API Service
 * @description Infrastructure layer for Identity & Access Management HTTP operations
 *              including authentication (sign-in/sign-up) and user management.
 * @author RQLS TEAM
 */
import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const usersEndpoint = "api/v1/users";
const authEndpoint = "api/v1/auth";

export class IamApi extends BaseApi {
    #usersEndpoint;

    constructor() {
        super();
        this.#usersEndpoint = new BaseEndpoint(this, usersEndpoint);
    }

    signIn(email, password) {
        return this.http.post(`${authEndpoint}/sign-in`, { email, password });
    }

    signUp(userData) {
        return this.http.post(`${authEndpoint}/sign-up`, userData);
    }

    getAllUsers() {
        return this.#usersEndpoint.getAll();
    }

    createUser(userData) {
        return this.#usersEndpoint.create(userData);
    }

    updateUser(id, data) {
        return this.http.patch(`${usersEndpoint}/${id}`, data);
    }
}
