export class PurchaseOrder {
    constructor(id, date, supplierName, totalAmount, status) {
        this.id = id;
        this.date = date;
        this.supplierName = supplierName;
        this.totalAmount = totalAmount;
        this.status = status; // Pendiente, Aprobada, Rechazada
    }
}