/**
 * Browser-side IAM session persistence helpers.
 *
 * @module iam-session
 * @description
 * Encapsulates the localStorage keys used by the Buildline frontend session. This module
 * is the single place that knows the storage names for JWT tokens and authenticated user
 * projections. Stores, route guards and HTTP interceptors use these helpers so key names
 * cannot drift between layers.
 *
 * The stored user object is a frontend projection returned by the backend authentication
 * contract. It is not treated as an authorization source of truth; protected backend
 * endpoints still validate the JWT token.
 *
 * @author RQLS TEAM
 */

const authTokenKey = 'auth_token';
const authUserKey = 'auth_user';

/**
 * Reads the current JWT access token from browser storage.
 *
 * @returns {string|null} Stored JWT token or null when the session is anonymous.
 */
export const getAuthToken = () => localStorage.getItem(authTokenKey);

/**
 * Reads the stored authenticated user resource.
 *
 * @returns {Object|null} Stored user object or null when the value is missing or corrupted.
 * @sideeffect Clears the session when the stored JSON cannot be parsed.
 */
export const getStoredAuthUser = () => {
    try {
        return JSON.parse(localStorage.getItem(authUserKey) || 'null');
    } catch {
        clearAuthSession();
        return null;
    }
};

/**
 * Persists the authenticated user projection and its JWT access token.
 *
 * @param {Object} user - Authenticated user projection used by the UI.
 * @param {string} token - JWT returned by the backend IAM API.
 * @returns {void}
 * @sideeffect Writes `auth_token` and `auth_user` into browser localStorage.
 */
export const persistAuthSession = (user, token) => {
    localStorage.setItem(authTokenKey, token);
    localStorage.setItem(authUserKey, JSON.stringify(user));
};

/**
 * Removes all browser-side IAM session artifacts.
 *
 * @returns {void}
 * @sideeffect Removes `auth_token` and `auth_user` from browser localStorage.
 */
export const clearAuthSession = () => {
    localStorage.removeItem(authTokenKey);
    localStorage.removeItem(authUserKey);
};

/**
 * Indicates whether a JWT token is currently available.
 *
 * @returns {boolean} True when a token exists in browser storage.
 */
export const hasAuthSession = () => !!getAuthToken();
