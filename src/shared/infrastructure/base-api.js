/**
 * Base API
 * @description Provides a centralized Axios HTTP client instance for all API services
 *              with automatic JWT token attachment and 401 redirect handling.
 * @author RQLS TEAM
 */
import axios from "axios";
import router from "../../router.js";

const platformApi = import.meta.env.VITE_API_BASE_URL || "http://localhost:5163/";

export class BaseApi {
    #http;

    constructor() {
        this.#http = axios.create({
            baseURL: platformApi,
            headers: { 'Content-Type': 'application/json' },
        });

        this.#http.interceptors.request.use((config) => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        this.#http.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                    router.push('/iam/sign-in');
                }
                return Promise.reject(error);
            }
        );
    }

    get http() {
        return this.#http;
    }
}
