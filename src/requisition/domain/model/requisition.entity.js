export class MaterialItem {
    constructor(id, name, quantity, unit) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
    }
}

export class Requisition {
    constructor(id, projectId, residentName, date, status, items) {
        this.id = id;
        this.projectId = projectId;
        this.residentName = residentName;
        this.date = date;
        this.status = status; // Pendiente, Aprobado, Rechazado
        this.items = items;   // Array de MaterialItem
    }
}