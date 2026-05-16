/**
 * Supplier Entity
 * @description Represents a supplier/vendor in the Suppliers Directory context.
 * @author RQLS TEAM
 */
export class Supplier {
    constructor({ id = null, ruc = '', companyName = '', contactEmail = '', category = '', rating = 0, isActive = true, deliveryRate = 0 } = {}) {
        this.id = id;
        this.ruc = ruc;
        this.companyName = companyName;
        this.contactEmail = contactEmail;
        this.category = category;
        this.rating = rating;
        this.isActive = isActive;
        this.deliveryRate = deliveryRate;
    }
}
