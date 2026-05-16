/**
 * Inventory Item Assembler
 * @description Maps API responses to InventoryItem domain entities.
 * @author RQLS TEAM
 */
import { InventoryItem } from "../domain/model/inventory-item.entity.js";

export class InventoryItemAssembler {
    /** @summary Converts a raw API resource to an InventoryItem entity. */
    static toEntityFromResource(resource) {
        return new InventoryItem({ ...resource });
    }

    /** @summary Converts an Axios response to an array of InventoryItem entities. */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
