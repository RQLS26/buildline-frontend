/**
 * InventoryItem Entity
 * @description Represents a material inventory item in the warehouse system.
 * @author RQLS TEAM
 */
export class InventoryItem {
    constructor({ id = null, sku = '', name = '', category = '', project = '', currentStock = 0, minStock = 0, maxStock = 100, date = '' } = {}) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.category = category;
        this.project = project;
        this.currentStock = currentStock;
        this.minStock = minStock;
        this.maxStock = maxStock;
        this.date = date;
    }
}
