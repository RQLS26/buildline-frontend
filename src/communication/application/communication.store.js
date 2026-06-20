import { defineStore } from 'pinia';
import { CommunicationApi } from '../infrastructure/communication-api.js';

const api = new CommunicationApi();

/**
 * Pinia store for message inbox state.
 *
 * @description Loads messages and coordinates read/starred state transitions with the
 * backend communication API.
 *
 * @author RQLS TEAM
 */
export const useCommunicationStore = defineStore('communication', {
    state: () => ({
        messages: [],
        isLoading: false
    }),
    getters: {
        unreadMessages: (state) => state.messages.filter(m => !m.isRead),
        alertMessages: (state) => state.messages.filter(m => m.category === 'alerts'),
        updateMessages: (state) => state.messages.filter(m => m.category === 'updates'),
        starredMessages: (state) => state.messages.filter(m => m.starred),
        unreadCount: (state) => state.messages.filter(m => !m.isRead).length,
    },
    actions: {
        /**
         * Loads inbox messages ordered from newest to oldest.
         *
         * @returns {Promise<void>} Resolves after `messages` is refreshed.
         */
        async fetchMessages() {
            this.isLoading = true;
            try {
                const response = await api.getMessages();
                this.messages = response.data.sort((a, b) => b.id - a.id);
            } catch (error) {
                console.error('Error loading messages:', error);
            } finally {
                this.isLoading = false;
            }
        },
        /**
         * Marks one message as read and updates local state after backend success.
         *
         * @param {number|string} id - Message identifier.
         * @returns {Promise<void>} Resolves after the update attempt.
         */
        async markAsRead(id) {
            try {
                await api.updateMessage(id, { isRead: true });
                const msg = this.messages.find(m => m.id === id);
                if (msg) msg.isRead = true;
            } catch (error) {
                console.error('Error marking message as read:', error);
            }
        },
        /**
         * Toggles the starred flag for a message.
         *
         * @param {number|string} id - Message identifier.
         * @returns {Promise<void>} Resolves after the update attempt.
         */
        async toggleStar(id) {
            const msg = this.messages.find(m => m.id === id);
            if (!msg) return;
            try {
                await api.updateMessage(id, { starred: !msg.starred });
                msg.starred = !msg.starred;
            } catch (error) {
                console.error('Error toggling star:', error);
            }
        },
        /**
         * Archives a message by deleting it from the company inbox.
         *
         * @param {number|string} id - Message identifier.
         * @returns {Promise<boolean>} True when the backend removes the message.
         */
        async archiveMessage(id) {
            try {
                await api.deleteMessage(id);
                this.messages = this.messages.filter(message => message.id !== id);
                return true;
            } catch (error) {
                console.error('Error archiving message:', error);
                return false;
            }
        }
    }
});
