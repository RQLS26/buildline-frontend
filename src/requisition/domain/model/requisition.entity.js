/**
 * Requisition Entities
 * @description Domain entities for the Material Requisition bounded context.
 * @author RQLS TEAM
 */

/**
 * MaterialItem Entity
 * @description Represents a single material line item within a requisition.
 */
export class MaterialItem {
    constructor({ id = null, name = '', quantity = 0, unit = '' } = {}) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
    }
}

/**
 * Requisition Entity
 * @description Represents a material requisition request.
 */
export class Requisition {
    constructor({ id = null, projectId = null, residentName = '', date = '', status = 'Pending', items = [] } = {}) {
        this.id = id;
        this.projectId = projectId;
        this.residentName = residentName;
        this.date = date;
        this.status = status;
        this.items = items;
    }
}
