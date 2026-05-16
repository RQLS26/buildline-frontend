/**
 * Base API
 * @description Provides a centralized Axios HTTP client instance for all API services.
 *              All bounded context APIs extend this class.
 * @author RQLS TEAM
 */
import axios from "axios";

const platformApi = "http://localhost:3000/";

export class BaseApi {
    #http;

    constructor() {
        this.#http = axios.create({
            baseURL: platformApi,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            },
        });
    }

    /** @summary Returns the configured Axios HTTP client instance. */
    get http() {
        return this.#http;
    }
}
