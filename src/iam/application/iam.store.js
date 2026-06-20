import { defineStore } from 'pinia';
import { IamApi } from '../infrastructure/iam-api.js';
import { clearAuthSession, getAuthToken, getStoredAuthUser, hasAuthSession, persistAuthSession } from '../infrastructure/iam-session.js';

/**
 * Pinia store for IAM session state, authentication workflows and role-gated UI rules.
 *
 * @description
 * Coordinates user-facing IAM use cases with `IamApi`, persists the authenticated browser
 * session through `iam-session.js`, and exposes convenience getters used by the router,
 * layout and user-management screens.
 *
 * @returns {import('pinia').StoreDefinition} IAM store definition.
 * @author RQLS TEAM
 */
export const useIamStore = defineStore('iam', {
    state: () => ({
        currentUser: getStoredAuthUser(),
        isAuthenticated: hasAuthSession(),
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
        /**
         * Authenticates a user and persists the returned JWT session.
         *
         * @param {string} email - Email entered in the sign-in form.
         * @param {string} password - Password entered in the sign-in form.
         * @returns {Promise<boolean>} True when authentication succeeds; false when credentials or connectivity fail.
         * @sideeffect Updates `currentUser`, `isAuthenticated`, `error` and browser localStorage.
         */
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
                    twoFactorEnabled: data.twoFactorEnabled,
                    lastLogin: data.lastLogin,
                };
                this.isAuthenticated = true;
                persistAuthSession(this.currentUser, data.token);
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
        /**
         * Registers a user and immediately establishes the browser session.
         *
         * @param {Object} userData - Raw sign-up form data.
         * @returns {Promise<boolean>} True when the account is created and authenticated.
         * @sideeffect Persists the JWT session and normalizes optional account fields.
         */
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
                    twoFactorEnabled: data.twoFactorEnabled,
                    lastLogin: data.lastLogin,
                };
                this.isAuthenticated = true;
                persistAuthSession(this.currentUser, data.token);
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
        /**
         * Loads all users for the administration screen.
         *
         * @returns {Promise<void>} Resolves after the users list has been refreshed.
         * @sideeffect Replaces `allUsers` and toggles `isLoading`.
         */
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
        /**
         * Creates a viewer user from the admin users module.
         *
         * @param {Object} userData - Create-user payload built by the users management view.
         * @returns {Promise<boolean>} True when the backend creates the user and the list refreshes.
         */
        async createUser(userData) {
            if (!this.isAdmin) return false;
            try {
                const api = new IamApi();
                await api.createUser(userData);
                await this.fetchAllUsers();
                return true;
            } catch (error) {
                console.error("Error creating user:", error);
                return false;
            }
        },
        /**
         * Changes a user's role when the active account has admin privileges.
         *
         * @param {number|string} userId - User identifier.
         * @param {string} newRole - Target role value accepted by the backend.
         * @returns {Promise<boolean>} True when the role update succeeds.
         */
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
        /**
         * Updates whether a managed user can authenticate.
         *
         * @param {number|string} userId - User identifier.
         * @param {boolean} isActive - Target activation flag.
         * @returns {Promise<boolean>} True when the backend accepts the status change.
         */
        async updateUserStatus(userId, isActive) {
            if (!this.isAdmin) return false;
            try {
                const api = new IamApi();
                await api.updateUser(userId, { isActive });
                await this.fetchAllUsers();
                return true;
            } catch (error) {
                console.error("Error updating user status:", error);
                return false;
            }
        },
        /**
         * Updates the authenticated user's profile projection.
         *
         * @param {Object} updatedData - Partial profile data edited by the user.
         * @returns {Promise<boolean>} True when the backend accepts the update.
         * @sideeffect Refreshes the local authenticated user projection while preserving the JWT.
         */
        async updateUserProfile(updatedData) {
            if (!this.currentUser) return false;
            try {
                const api = new IamApi();
                const response = await api.updateUser(this.currentUser.id, updatedData);
                this.currentUser = { ...this.currentUser, ...response.data };
                const token = getAuthToken();
                if (token) persistAuthSession(this.currentUser, token);
                return true;
            } catch (error) {
                console.error("Error updating profile:", error);
                return false;
            }
        },
        /**
         * Changes the authenticated user's password through the backend IAM security endpoint.
         *
         * @param {Object} passwordData - Payload with currentPassword and newPassword.
         * @returns {Promise<boolean>} True when the password was changed.
         */
        async changePassword(passwordData) {
            if (!this.currentUser) return false;
            try {
                const api = new IamApi();
                await api.changePassword(this.currentUser.id, passwordData);
                return true;
            } catch (error) {
                console.error("Error changing password:", error);
                this.error = error.response?.data?.detail || "Could not change password.";
                return false;
            }
        },
        /**
         * Clears the active IAM session.
         *
         * @returns {void}
         * @sideeffect Clears in-memory user state and browser localStorage session artifacts.
         */
        logout() {
            this.currentUser = null;
            this.isAuthenticated = false;
            this.allUsers = [];
            clearAuthSession();
        },
        /**
         * Checks whether the active role can execute a named UI capability.
         *
         * @param {string} feature - Feature flag used by presentation components.
         * @returns {boolean} True when the active role can access the feature.
         */
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
        /**
         * Checks whether the active role can access a named route.
         *
         * @param {string} routeName - Vue Router route name.
         * @returns {boolean} True when the route is allowed for the current role.
         */
        canAccessRoute(routeName) {
            if (this.isAdmin) return true;
            const adminOnlyRoutes = ['users', 'settings'];
            return !adminOnlyRoutes.includes(routeName);
        }
    }
});
