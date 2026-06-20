import { defineStore } from 'pinia';
import { ProfilesApi } from '../infrastructure/profiles-api.js';
import { useIamStore } from '../../iam/application/iam.store.js';

/**
 * Pinia store for company profile management.
 *
 * @description Loads and updates the company profile used by the settings/profile view.
 * Loads the company profile assigned to the current authenticated user's company membership.
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
                const iamStore = useIamStore();
                const companyId = iamStore.currentUser?.companyId;
                const response = companyId ? await api.getProfileById(companyId) : await api.getProfiles();
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
