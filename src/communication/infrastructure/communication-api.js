import { BaseApi } from "../../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../../shared/infrastructure/base-endpoint.js";

const messagesEndpoint = "/messages";

export class CommunicationApi extends BaseApi {
    #messagesEndpoint;

    constructor() {
        super();
        this.#messagesEndpoint = new BaseEndpoint(this, messagesEndpoint);
    }

    getMessages() {
        return this.#messagesEndpoint.getAll();
    }

    sendMessage(messageData) {
        return this.#messagesEndpoint.create(messageData);
    }

    deleteMessage(id) {
        return this.#messagesEndpoint.delete(id);
    }
}