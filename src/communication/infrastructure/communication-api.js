import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";
import { apiEndpoints } from "../../shared/infrastructure/api-endpoints.js";

/**
 * Infrastructure API adapter for communication messages.
 *
 * @class CommunicationApi
 * @extends BaseApi
 * @description Wraps the company-scoped message backend contract used by the inbox view.
 * @author RQLS TEAM
 */
export class CommunicationApi extends BaseApi {
    #messagesEndpoint;

    constructor() {
        super();
        this.#messagesEndpoint = new BaseEndpoint(this, apiEndpoints.messages);
    }

    /**
     * Retrieves inbox messages.
     *
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>>>} Response containing message resources.
     */
    getMessages() {
        return this.#messagesEndpoint.getAll();
    }

    /**
     * Creates a message.
     *
     * @param {Object} messageData - Message creation payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the created message.
     */
    sendMessage(messageData) {
        return this.#messagesEndpoint.create(messageData);
    }

    /**
     * Partially updates read/starred state or message metadata.
     *
     * @param {number|string} id - Message identifier.
     * @param {Object} messageData - Partial message update payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Response containing the updated message.
     */
    updateMessage(id, messageData) {
        return this.#messagesEndpoint.patch(id, messageData);
    }

    /**
     * Deletes a message from the inbox.
     *
     * @param {number|string} id - Message identifier.
     * @returns {Promise<import('axios').AxiosResponse<void|Object>>} Backend delete response.
     */
    deleteMessage(id) {
        return this.#messagesEndpoint.delete(id);
    }
}
