/**
 * PurchaseOrder Entity
 * @description Represents a purchase order in the Procurement context.
 * @author RQLS TEAM
 */
export class PurchaseOrder {
    constructor({ id = null, orderId = '', date = '', supplier = '', material = '', project = '', totalAmount = 0, status = 'Pending', quantity = 0, unit = '', unitPrice = 0 } = {}) {
        this.id = id;
        this.orderId = orderId;
        this.date = date;
        this.supplier = supplier;
        this.material = material;
        this.project = project;
        this.totalAmount = totalAmount;
        this.status = status;
        this.quantity = quantity;
        this.unit = unit;
        this.unitPrice = unitPrice;
    }
}
