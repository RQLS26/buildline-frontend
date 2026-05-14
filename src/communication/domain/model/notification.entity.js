export class Message {
    constructor(id, sender, subject, body, date, isRead) {
        this.id = id;
        this.sender = sender;
        this.subject = subject;
        this.body = body;
        this.date = date;
        this.isRead = isRead;
    }
}