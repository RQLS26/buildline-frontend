/**
 * Delivery Assembler
 * @description Maps API responses to Delivery domain entities.
 * @author RQLS TEAM
 */
import { Delivery } from "../domain/model/delivery.entity.js";

export class DeliveryAssembler {

    /**
     * @summary Converts a single API resource to a Delivery entity.
     * @param {Object} resource - Raw API resource object.
     * @returns {Delivery}
     */
    static toEntityFromResource(resource) {
        return new Delivery({ ...resource });
    }

    /**
     * @summary Converts an API response to an array of Delivery entities.
     * @param {Object} response - Axios response object.
     * @returns {Delivery[]}
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
