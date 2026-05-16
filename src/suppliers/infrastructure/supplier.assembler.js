/**
 * Supplier Assembler
 * @description Maps API responses to Supplier domain entities.
 * @author RQLS TEAM
 */
import { Supplier } from "../domain/model/supplier.entity.js";

export class SupplierAssembler {
    /** @summary Converts a raw API resource to a Supplier entity. */
    static toEntityFromResource(resource) {
        return new Supplier({ ...resource });
    }

    /** @summary Converts an Axios response to an array of Supplier entities. */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
