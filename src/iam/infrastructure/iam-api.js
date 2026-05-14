import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000' });

export class IamApi {
    getUsers() {
        return api.get('/users');
    }

    registerUser(userData) {
        return api.post('/users', userData);
    }
}