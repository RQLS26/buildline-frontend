/**
 * Notification Entity
 * @description Represents a notification/message in the Communication context.
 * @author RQLS TEAM
 */
export class Notification {
    constructor({ id = null, sender = '', subject = '', body = '', date = '', isRead = false, type = 'info' } = {}) {
        this.id = id;
        this.sender = sender;
        this.subject = subject;
        this.body = body;
        this.date = date;
        this.isRead = isRead;
        this.type = type;
    }
}
