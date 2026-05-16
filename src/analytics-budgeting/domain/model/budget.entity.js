/**
 * Budget Entity
 * @description Represents a project budget allocation in the Analytics & Budgeting context.
 * @author RQLS TEAM
 */
export class Budget {
    constructor({ id = null, project = '', totalAmount = 0, spentAmount = 0, status = 'On Track' } = {}) {
        this.id = id;
        this.project = project;
        this.totalAmount = totalAmount;
        this.spentAmount = spentAmount;
        this.status = status;
    }
}
