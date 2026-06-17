/**
 * Suppliers API Service
 * @description Infrastructure layer for supplier management HTTP operations.
 * @author RQLS TEAM
 */
import { BaseApi} from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const suppliersEndpoint = "api/v1/suppliers";

export class SuppliersApi extends BaseApi {
    #suppliersEndpoint;

    constructor() {
        super();
        this.#suppliersEndpoint = new BaseEndpoint(this, suppliersEndpoint);
    }

    getSuppliers() {
        return this.#suppliersEndpoint.getAll();
    }

    // La validación de SUNAT se mantiene simulada porque no es un CRUD de base de datos
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
