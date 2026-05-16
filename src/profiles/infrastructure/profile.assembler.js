/**
 * Profile Assembler
 * @description Maps API responses to Profile domain entities.
 * @author RQLS TEAM
 */
import { Profile } from "../domain/model/profile.entity.js";

export class ProfileAssembler {
    /** @summary Converts a raw API resource to a Profile entity. */
    static toEntityFromResource(resource) {
        return new Profile({ ...resource });
    }

    /** @summary Converts an Axios response to an array of Profile entities. */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
