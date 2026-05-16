/**
 * Delivery Entity
 * @description Represents a shipment/delivery in the logistics tracking system.
 * @author RQLS TEAM
 */
export class Delivery {
    constructor({
        id = null,
        trackingId = '',
        purchaseOrder = '',
        supplier = '',
        origin = '',
        destination = '',
        status = 'Shipped',
        eta = '',
        dispatchDate = '',
        material = ''
    } = {}) {
        this.id = id;
        this.trackingId = trackingId;
        this.purchaseOrder = purchaseOrder;
        this.supplier = supplier;
        this.origin = origin;
        this.destination = destination;
        this.status = status;
        this.eta = eta;
        this.dispatchDate = dispatchDate;
        this.material = material;
    }
}
