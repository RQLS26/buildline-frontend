import { defineStore } from 'pinia';
import { IamApi } from '../infrastructure/iam-api.js';

export const useIamStore = defineStore('iam', {
    state: () => ({
        currentUser: null,
        isAuthenticated: false, // Inicia en falso siempre
        isLoading: false,
        error: null
    }),
    actions: {
        async signIn(email, password) {
            this.isLoading = true;
            this.error = null;
            try {
                const api = new IamApi();
                const response = await api.getUsers();

                // Si la BD responde pero no tiene el array de "users"
                if (!response.data) {
                    this.error = "Error de base de datos.";
                    return false;
                }

                const user = response.data.find(u => u.email === email && u.password === password);

                if (user) {
                    this.currentUser = user;
                    this.isAuthenticated = true;
                    return true;
                } else {
                    this.error = "Correo o contraseña incorrectos.";
                    return false;
                }
            } catch (error) {
                // Si el json-server está apagado, cae aquí
                this.error = "Error conectando con el servidor.";
                return false;
            } finally {
                this.isLoading = false;
            }
        },
        async signUp(userData) {
            this.isLoading = true;
            this.error = null;
            try {
                const api = new IamApi();
                const response = await api.registerUser(userData);
                this.currentUser = response.data;
                this.isAuthenticated = true;
                return true;
            } catch (error) {
                this.error = "Error al crear la cuenta.";
                return false;
            } finally {
                this.isLoading = false;
            }
        },
        logout() {
            this.currentUser = null;
            this.isAuthenticated = false;
        }
    }
});