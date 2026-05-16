/**
 * Purchase Order Assembler
 * @description Maps API responses to PurchaseOrder domain entities.
 * @author RQLS TEAM
 */
import { PurchaseOrder } from "../domain/model/purchase-order.entity.js";

export class PurchaseOrderAssembler {
    /** @summary Converts a raw API resource to a PurchaseOrder entity. */
    static toEntityFromResource(resource) {
        return new PurchaseOrder({ ...resource });
    }

    /** @summary Converts an Axios response to an array of PurchaseOrder entities. */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
