import { defineStore } from 'pinia';
import { ReferenceDataApi } from '../infrastructure/reference-data-api.js';

const api = new ReferenceDataApi();

/**
 * Pinia store for shared backend catalogs.
 *
 * @description Loads project, category and material reference data once and exposes
 * option arrays for views that previously depended on static mock lists.
 *
 * @author RQLS TEAM
 */
export const useReferenceDataStore = defineStore('referenceData', {
    state: () => ({
        projects: [],
        categories: [],
        materials: [],
        isLoading: false
    }),
    getters: {
        projectNames: (state) => state.projects.map(project => project.name),
        categoryNames: (state) => state.categories.map(category => category.name),
        materialNames: (state) => state.materials.map(material => material.name),
        materialUnits: (state) => [...new Set(state.materials.map(material => material.unit).filter(Boolean))],
        hasLoaded: (state) => state.projects.length > 0 || state.categories.length > 0 || state.materials.length > 0
    },
    actions: {
        /**
         * Loads every shared catalog required by frontend forms and filters.
         *
         * @returns {Promise<void>} Resolves after all catalog collections are refreshed.
         */
        async fetchAll() {
            this.isLoading = true;
            try {
                const [projectsResponse, categoriesResponse, materialsResponse] = await Promise.all([
                    api.getProjects(),
                    api.getCategories(),
                    api.getMaterials()
                ]);
                this.projects = projectsResponse.data || [];
                this.categories = categoriesResponse.data || [];
                this.materials = materialsResponse.data || [];
            } catch (error) {
                console.error('Error loading reference data:', error);
            } finally {
                this.isLoading = false;
            }
        }
    }
});
