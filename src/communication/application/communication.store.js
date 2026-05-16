/**
 * Communication Store
 * @description Pinia store for notifications, messages, and alerts management.
 * @author RQLS TEAM
 */
import { defineStore } from 'pinia';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000' });

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
        async fetchMessages() {
            this.isLoading = true;
            try {
                const response = await api.get('/messages');
                this.messages = response.data.sort((a, b) => b.id - a.id);
            } catch (error) {
                console.error('Error loading messages:', error);
            } finally {
                this.isLoading = false;
            }
        },
        async markAsRead(id) {
            try {
                await api.patch(`/messages/${id}`, { isRead: true });
                const msg = this.messages.find(m => m.id === id);
                if (msg) msg.isRead = true;
            } catch (error) {
                console.error('Error marking message as read:', error);
            }
        },
        async toggleStar(id) {
            const msg = this.messages.find(m => m.id === id);
            if (!msg) return;
            try {
                await api.patch(`/messages/${id}`, { starred: !msg.starred });
                msg.starred = !msg.starred;
            } catch (error) {
                console.error('Error toggling star:', error);
            }
        }
    }
});
