import { defineStore } from 'pinia';
import { ProfilesApi } from '../infrastructure/profiles-api.js';

/**
 * Pinia store for company profile management.
 *
 * @description Loads and updates the company profile used by the settings/profile view.
 * Loads the company profile collection from the backend and selects the first profile available to the current account.
 *
 * @author RQLS TEAM
 */
export const useProfilesStore = defineStore('profiles', {
    state: () => ({
        companyProfile: null,
        isLoading: false
    }),
    actions: {
        /**
         * Loads the primary company profile.
         *
         * @returns {Promise<void>} Resolves after `companyProfile` is refreshed.
         */
        async fetchProfile() {
            this.isLoading = true;
            try {
                const api = new ProfilesApi();
                const response = await api.getProfiles();
                this.companyProfile = Array.isArray(response.data) ? response.data[0] || null : response.data;
            } catch (error) {
                console.error("Error cargando perfil:", error);
            } finally {
                this.isLoading = false;
            }
        },
        /**
         * Updates the active company profile.
         *
         * @param {Object} updatedData - Complete profile payload from the form.
         * @returns {Promise<boolean>} True when the backend accepts the update.
         */
        async updateProfile(updatedData) {
            this.isLoading = true;
            try {
                const api = new ProfilesApi();
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
