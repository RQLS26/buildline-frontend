import { BaseApi} from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";
import { apiEndpoints } from "../../shared/infrastructure/api-endpoints.js";

/**
 * Infrastructure API adapter for supplier directory and incident workflows.
 *
 * @class SuppliersApi
 * @extends BaseApi
 * @description
 * Wraps supplier and supplier-incident backend resources. It also keeps the local
 * SUNAT-style RUC validation simulation because that interaction is UI-only in Sprint 3.
 *
 * @author RQLS TEAM
 */
export class SuppliersApi extends BaseApi {
    #suppliersEndpoint;
    #incidentsEndpoint;

    constructor() {
        super();
        this.#suppliersEndpoint = new BaseEndpoint(this, apiEndpoints.suppliers);
        this.#incidentsEndpoint = new BaseEndpoint(this, apiEndpoints.incidents);
    }

    /**
     * Retrieves suppliers.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>>>} Response containing supplier resources.
     */
    getSuppliers() {
        return this.#suppliersEndpoint.getAll();
    }

    /**
     * Creates a supplier.
     *
     * @param {Object} resource - Supplier creation payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the created supplier.
     */
    createSupplier(resource) {
        return this.#suppliersEndpoint.create(resource);
    }

    /**
     * Partially updates a supplier.
     *
     * @param {number|string} id - Supplier identifier.
     * @param {Object} resource - Partial supplier update payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the updated supplier.
     */
    updateSupplier(id, resource) {
        return this.#suppliersEndpoint.patch(id, resource);
    }

    /**
     * Deletes a supplier.
     *
     * @param {number|string} id - Supplier identifier.
     * @returns {Promise<import('axios').AxiosResponse<void|Object>>} Backend delete response.
     */
    deleteSupplier(id) {
        return this.#suppliersEndpoint.delete(id);
    }

    /**
     * Retrieves supplier incidents.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>>>} Response containing incident resources.
     */
    getIncidents() {
        return this.#incidentsEndpoint.getAll();
    }

    /**
     * Creates a supplier incident.
     *
     * @param {Object} resource - Incident creation payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the created incident.
     */
    createIncident(resource) {
        return this.#incidentsEndpoint.create(resource);
    }

    /**
     * Updates incident status or metadata.
     *
     * @param {number|string} id - Incident identifier.
     * @param {Object} resource - Partial incident update payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the updated incident.
     */
    updateIncidentStatus(id, resource) {
        return this.#incidentsEndpoint.patch(id, resource);
    }

    /**
     * Simulates RUC validation for the supplier registration experience.
     *
     * @param {string} ruc - Supplier RUC entered by the user.
     * @returns {Promise<{isValid: boolean, message: string}>} Validation result displayed by the supplier view.
     */
    validateRuc(ruc) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const isValid = ruc.length === 11 && ruc.startsWith('20');
                resolve({
                    isValid: isValid,
                    message: isValid ? 'Activo y Habido (SUNAT)' : 'RUC Inválido o de Baja'
                });
            }, 500);
        });
    }
}
