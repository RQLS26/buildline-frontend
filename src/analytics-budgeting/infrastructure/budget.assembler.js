/**
 * Budget Assembler
 * @description Maps API responses to Budget domain entities.
 * @author RQLS TEAM
 */
import { Budget } from "../domain/model/budget.entity.js";

export class BudgetAssembler {
    /** @summary Converts a raw API resource to a Budget entity. */
    static toEntityFromResource(resource) {
        return new Budget({ ...resource });
    }

    /** @summary Converts an Axios response to an array of Budget entities. */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
