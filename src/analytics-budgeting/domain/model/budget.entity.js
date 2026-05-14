export class Budget {
    constructor(id, project, totalAmount, spentAmount, status) {
        this.id = id;
        this.project = project;
        this.totalAmount = totalAmount;
        this.spentAmount = spentAmount;
        this.status = status;
    }
}