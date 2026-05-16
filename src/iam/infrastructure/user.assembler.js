/**
 * User Assembler
 * @description Maps API responses to User domain entities.
 * @author RQLS TEAM
 */
import { User } from "../domain/model/user.entity.js";

export class UserAssembler {
    /** @summary Converts a raw API resource to a User entity. */
    static toEntityFromResource(resource) {
        return new User({ ...resource });
    }

    /** @summary Converts an Axios response to an array of User entities. */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
