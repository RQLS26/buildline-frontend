/**
 * IAM Store
 * @description Pinia store for authentication, user session, and role management.
 *              Uses real JWT-based authentication against the backend API.
 * @author RQLS TEAM
 */
import { defineStore } from 'pinia';
import { IamApi } from '../infrastructure/iam-api.js';

export const useIamStore = defineStore('iam', {
    state: () => ({
        currentUser: JSON.parse(localStorage.getItem('auth_user') || 'null'),
        isAuthenticated: !!localStorage.getItem('auth_token'),
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
                const api = new IamApi();
                const response = await api.signIn(email, password);
                const data = response.data;
                this.currentUser = {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    department: data.department,
                    phone: data.phone,
                    avatarColor: data.avatarColor,
                    isActive: data.isActive,
                    lastLogin: data.lastLogin,
                };
                this.isAuthenticated = true;
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('auth_user', JSON.stringify(this.currentUser));
                return true;
            } catch (error) {
                if (error.response?.status === 401) {
                    this.error = "Invalid email or password.";
                } else {
                    this.error = "Error connecting to server.";
                }
                return false;
            } finally {
                this.isLoading = false;
            }
        },
        async signUp(userData) {
            this.isLoading = true;
            this.error = null;
            try {
                const api = new IamApi();
                const payload = {
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    role: userData.role || 'viewer',
                    department: userData.department || 'General',
                    phone: userData.phone || '',
                    avatarColor: userData.avatarColor || '#3d63a1',
                };
                const response = await api.signUp(payload);
                const data = response.data;
                this.currentUser = {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    department: data.department,
                    phone: data.phone,
                    avatarColor: data.avatarColor,
                    isActive: data.isActive,
                    lastLogin: data.lastLogin,
                };
                this.isAuthenticated = true;
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('auth_user', JSON.stringify(this.currentUser));
                return true;
            } catch (error) {
                if (error.response?.status === 409) {
                    this.error = "This email is already registered.";
                } else {
                    this.error = "Error creating account.";
                }
                return false;
            } finally {
                this.isLoading = false;
            }
        },
        async fetchAllUsers() {
            this.isLoading = true;
            try {
                const api = new IamApi();
                const response = await api.getAllUsers();
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
                const api = new IamApi();
                await api.updateUser(userId, { role: newRole });
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
                const api = new IamApi();
                await api.updateUser(this.currentUser.id, updatedData);
                this.currentUser = { ...this.currentUser, ...updatedData };
                localStorage.setItem('auth_user', JSON.stringify(this.currentUser));
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
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
        },
        canAccess(feature) {
            if (this.isAdmin) return true;
            const restrictedForViewer = [
                'manage_users', 'change_roles', 'delete_data',
                'system_settings', 'create_po', 'create_quotation',
                'create_request', 'create_supplier', 'edit_supplier',
                'delete_supplier', 'report_incident', 'edit_inventory',
                'edit_budget', 'edit_profile'
            ];
            return !restrictedForViewer.includes(feature);
        },
        canAccessRoute(routeName) {
            if (this.isAdmin) return true;
            const adminOnlyRoutes = ['users', 'settings'];
            return !adminOnlyRoutes.includes(routeName);
        }
    }
});
