/**
 * IAM Store
 * @description Pinia store for authentication, user session, and role management.
 * @author RQLS TEAM
 */
import { defineStore } from 'pinia';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000' });

export const useIamStore = defineStore('iam', {
    state: () => ({
        currentUser: null,
        isAuthenticated: false,
        allUsers: [],
        isLoading: false,
        error: null
    }),
    getters: {
        isAdmin: (state) => state.currentUser?.role === 'admin' || state.currentUser?.role === 'owner',
        isViewer: (state) => state.currentUser?.role === 'viewer',
        userRole: (state) => state.currentUser?.role || 'viewer',
        userName: (state) => state.currentUser?.name || 'User',
        userEmail: (state) => state.currentUser?.email || '',
        userDepartment: (state) => state.currentUser?.department || '',
        userPhone: (state) => state.currentUser?.phone || '',
        userAvatarColor: (state) => state.currentUser?.avatarColor || '#3d63a1',
    },
    actions: {
        async signIn(email, password) {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await api.get('/users');
                if (!response.data) {
                    this.error = "Database error.";
                    return false;
                }
                const user = response.data.find(u => u.email === email && u.password === password);
                if (user) {
                    this.currentUser = user;
                    this.isAuthenticated = true;
                    return true;
                } else {
                    this.error = "Invalid email or password.";
                    return false;
                }
            } catch (error) {
                this.error = "Error connecting to server.";
                return false;
            } finally {
                this.isLoading = false;
            }
        },
        async signUp(userData) {
            this.isLoading = true;
            this.error = null;
            try {
                const newUser = { ...userData, role: 'viewer', isActive: true, lastLogin: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
                const response = await api.post('/users', newUser);
                this.currentUser = response.data;
                this.isAuthenticated = true;
                return true;
            } catch (error) {
                this.error = "Error creating account.";
                return false;
            } finally {
                this.isLoading = false;
            }
        },
        async fetchAllUsers() {
            this.isLoading = true;
            try {
                const response = await api.get('/users');
                this.allUsers = response.data;
            } catch (error) {
                console.error("Error loading users:", error);
            } finally {
                this.isLoading = false;
            }
        },
        async updateUserRole(userId, newRole) {
            if (!this.isAdmin) return false;
            try {
                await api.patch(`/users/${userId}`, { role: newRole });
                await this.fetchAllUsers();
                return true;
            } catch (error) {
                console.error("Error updating role:", error);
                return false;
            }
        },
        async updateUserProfile(updatedData) {
            if (!this.currentUser) return false;
            try {
                await api.patch(`/users/${this.currentUser.id}`, updatedData);
                this.currentUser = { ...this.currentUser, ...updatedData };
                return true;
            } catch (error) {
                console.error("Error updating profile:", error);
                return false;
            }
        },
        logout() {
            this.currentUser = null;
            this.isAuthenticated = false;
            this.allUsers = [];
        },
        // Granular permission checks
        canAccess(feature) {
            if (this.isAdmin) return true;
            // Viewers cannot: create/edit/delete data, manage users, change settings
            const restrictedForViewer = [
                'manage_users', 'change_roles', 'delete_data',
                'system_settings', 'create_po', 'create_quotation',
                'create_request', 'create_supplier', 'edit_supplier',
                'delete_supplier', 'report_incident', 'edit_inventory',
                'edit_budget', 'edit_profile'
            ];
            return !restrictedForViewer.includes(feature);
        },
        // Check if current user can access a route
        canAccessRoute(routeName) {
            if (this.isAdmin) return true;
            // Routes completely restricted for viewers
            const adminOnlyRoutes = ['users', 'settings'];
            return !adminOnlyRoutes.includes(routeName);
        }
    }
});
