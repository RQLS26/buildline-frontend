import { defineStore } from 'pinia';
import { ProfilesApi } from '../infrastructure/profiles-api.js';

export const useProfilesStore = defineStore('profiles', {
    state: () => ({
        companyProfile: null,
        isLoading: false
    }),
    actions: {
        async fetchProfile() {
            this.isLoading = true;
            try {
                const api = new ProfilesApi();
                // Consultamos el ID "1" de nuestro db.json
                const response = await api.getProfileById("1");
                this.companyProfile = response.data;
            } catch (error) {
                console.error("Error cargando perfil:", error);
            } finally {
                this.isLoading = false;
            }
        },
        async updateProfile(updatedData) {
            this.isLoading = true;
            try {
                const api = new ProfilesApi();
                // Enviamos los datos actualizados al json-server
                const response = await api.updateProfile(this.companyProfile.id, updatedData);
                this.companyProfile = response.data;
                return true;
            } catch (error) {
                console.error("Error actualizando perfil:", error);
                return false;
            } finally {
                this.isLoading = false;
            }
        }
    }
});