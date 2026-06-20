import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";
import { apiEndpoints } from "../../shared/infrastructure/api-endpoints.js";

/**
 * Infrastructure API adapter for the Identity and Access Management bounded context.
 *
 * @class IamApi
 * @extends BaseApi
 * @description
 * Wraps backend IAM endpoints used by authentication screens and user-management views.
 * The adapter exposes semantic methods so stores do not know the raw `/api/v1/auth` or
 * `/api/v1/users` paths.
 *
 * @author RQLS TEAM
 */
export class IamApi extends BaseApi {
    #usersEndpoint;

    constructor() {
        super();
        this.#usersEndpoint = new BaseEndpoint(this, apiEndpoints.users);
    }

    /**
     * Sends credentials to the backend sign-in endpoint.
     *
     * @param {string} email - User email submitted by the sign-in form.
     * @param {string} password - Plain password submitted by the sign-in form.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response with authenticated user projection and JWT token.
     */
    signIn(email, password) {
        return this.http.post(`${apiEndpoints.auth}/sign-in`, { email, password });
    }

    /**
     * Registers a new user through the backend sign-up endpoint.
     *
     * @param {Object} userData - Sign-up payload accepted by the backend IAM contract.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response with authenticated user projection and JWT token.
     */
    signUp(userData) {
        return this.http.post(`${apiEndpoints.auth}/sign-up`, userData);
    }

    /**
     * Retrieves all users visible to the authenticated account.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>>>} Response containing user resources.
     */
    getAllUsers() {
        return this.#usersEndpoint.getAll();
    }

    /**
     * Retrieves the authenticated user's own account projection.
     *
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the current user resource.
     */
    getCurrentUser() {
        return this.http.get(`${apiEndpoints.users}/me`);
    }

    /**
     * Creates a user from the administration screen.
     *
     * @param {Object} userData - Create-user payload including role and account metadata.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the created user resource.
     */
    createUser(userData) {
        return this.#usersEndpoint.create(userData);
    }

    /**
     * Partially updates user metadata or role.
     *
     * @param {number|string} id - Backend user identifier.
     * @param {Object} data - Partial user update payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the updated user resource.
     */
    updateUser(id, data) {
        return this.#usersEndpoint.patch(id, data);
    }

    /**
     * Changes a user's password through the dedicated IAM security endpoint.
     *
     * @param {number|string} id - Backend user identifier.
     * @param {Object} data - Password change payload with currentPassword and newPassword.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the updated user resource.
     */
    changePassword(id, data) {
        return this.http.patch(`${apiEndpoints.users}/${id}/password`, data);
    }
}
