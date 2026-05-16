/**
 * IAM API Service
 * @description Infrastructure layer for Identity & Access Management HTTP operations.
 * @author RQLS TEAM
 */
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000' });

export class IamApi {
    /** @summary Retrieves all registered users. */
    getUsers() {
        return api.get('/users');
    }

    registerUser(userData) {
        return api.post('/users', userData);
    }
}
