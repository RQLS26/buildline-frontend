/**
 * Requisition Assembler
 * @description Maps API responses to Requisition domain entities.
 * @author RQLS TEAM
 */
import { Requisition } from "../domain/model/requisition.entity.js";

export class RequisitionAssembler {
    /** @summary Converts a raw API resource to a Requisition entity. */
    static toEntityFromResource(resource) {
        return new Requisition({ ...resource });
    }

    /** @summary Converts an Axios response to an array of Requisition entities. */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
