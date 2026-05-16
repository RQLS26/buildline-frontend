/**
 * Notification Assembler
 * @description Maps API responses to Notification domain entities.
 * @author RQLS TEAM
 */
import { Notification } from "../domain/model/notification.entity.js";

export class NotificationAssembler {
    /** @summary Converts a raw API resource to a Notification entity. */
    static toEntityFromResource(resource) {
        return new Notification({ ...resource });
    }

    /** @summary Converts an Axios response to an array of Notification entities. */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
