import axios from "axios";
import { getAuthToken, clearAuthSession } from "../../iam/infrastructure/iam-session.js";
import { platformApiBaseUrl } from "./api-endpoints.js";

/**
 * Shared HTTP client base class for every bounded-context API adapter.
 *
 * @class BaseApi
 * @description
 * Owns the Axios instance used by infrastructure adapters. This class is intentionally
 * generic: it knows how to reach the backend host, how to send JSON requests, how to
 * attach the persisted IAM token, and how to react to protected-resource authorization
 * failures. It does not know domain endpoints; those belong to context adapters such as
 * `IamApi`, `InventoryApi` or `ProcurementApi`.
 *
 * Application stores should depend on context adapters instead of constructing this class
 * directly. That keeps `/api/v1/...` route knowledge in the infrastructure layer.
 *
 * @author RQLS TEAM
 */
export class BaseApi {
    /**
     * Configured Axios instance used by derived API adapters.
     *
     * @type {import('axios').AxiosInstance}
     */
    #http;

    /**
     * Creates an Axios client configured for the Buildline backend.
     *
     * @description
     * The constructor attaches two interceptors:
     * - Request interceptor: reads the current JWT from IAM session storage and sends it
     *   as `Authorization: Bearer <token>`.
     * - Response interceptor: when a protected endpoint returns `401`, clears the browser
     *   session and redirects to sign-in. IAM auth endpoints are excluded so invalid
     *   credentials can be handled by the sign-in form without a forced page reload.
     */
    constructor() {
        this.#http = axios.create({
            baseURL: platformApiBaseUrl,
            headers: { 'Content-Type': 'application/json' },
        });

        this.#http.interceptors.request.use((config) => {
            const token = getAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        this.#http.interceptors.response.use(
            (response) => response,
            (error) => {
                const requestUrl = error.config?.url || '';
                const isAuthRequest = requestUrl.includes('/auth/');
                if (error.response?.status === 401 && !isAuthRequest) {
                    clearAuthSession();
                    window.location.href = '/iam/sign-in';
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Exposes the configured Axios client to infrastructure adapters.
     *
     * @returns {import('axios').AxiosInstance} Axios instance with base URL, JSON headers and IAM interceptors.
     */
    get http() {
        return this.#http;
    }
}
