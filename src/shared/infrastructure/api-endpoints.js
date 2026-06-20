/**
 * Backend endpoint catalog used by Buildline frontend infrastructure adapters.
 *
 * @module api-endpoints
 * @description
 * Centralizes backend route fragments so endpoint strings are not duplicated across
 * Pinia stores or Vue views. The values are relative to `platformApiBaseUrl`; they keep
 * the `/api/v1` prefix because the ASP.NET Core backend exposes versioned REST routes.
 *
 * When a backend route changes, update this catalog and the corresponding context adapter.
 * Application stores should continue calling semantic adapter methods such as
 * `getInventoryItems()` or `createQuotation()`.
 *
 * @author RQLS TEAM
 */

const productionApiBaseUrl = 'https://buildline-platform.up.railway.app/';
const legacyMockApiHosts = ['buildline-json-server.onrender.com'];

/**
 * Resolves the API host root while protecting production builds from stale mock-server
 * environment variables left over from the frontend sprint.
 *
 * @param {string|undefined} rawBaseUrl - Raw base URL injected by Vite.
 * @returns {string} Production backend URL when the environment value is empty or points to a legacy mock host.
 */
const resolveApiBaseUrl = (rawBaseUrl) => {
    const configuredBaseUrl = rawBaseUrl || productionApiBaseUrl;
    return legacyMockApiHosts.some(host => configuredBaseUrl.includes(host))
        ? productionApiBaseUrl
        : configuredBaseUrl;
};

/**
 * Normalizes API host roots so Axios can safely compose relative endpoint paths.
 *
 * @param {string|undefined} rawBaseUrl - Raw base URL from Vite environment variables.
 * @returns {string} Base URL ending with exactly one slash.
 * @example
 * normalizeApiBaseUrl('https://api.example.com') // 'https://api.example.com/'
 */
export const normalizeApiBaseUrl = (rawBaseUrl) => {
    const baseUrl = resolveApiBaseUrl(rawBaseUrl);
    return `${baseUrl.replace(/\/+$/, '')}/`;
};

/**
 * Runtime backend API host root resolved from Vite environment variables.
 *
 * @type {string}
 * @description Falls back to the Railway production API so production previews remain
 * usable even when the hosting provider does not inject a custom environment value.
 */
export const platformApiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

/**
 * Backend REST endpoint paths grouped by bounded context.
 *
 * @type {Readonly<Record<string, string>>}
 * @description These strings are consumed only by infrastructure adapters. They should
 * not be imported directly by stores or presentation views.
 */
export const apiEndpoints = Object.freeze({
    analyticsBudgets: 'api/v1/budgets',
    analyticsProjects: 'api/v1/projects',
    auth: 'api/v1/auth',
    categories: 'api/v1/categories',
    deliveries: 'api/v1/deliveries',
    incidents: 'api/v1/incidents',
    inventory: 'api/v1/inventory',
    materials: 'api/v1/materials',
    messages: 'api/v1/messages',
    profiles: 'api/v1/profiles',
    purchaseOrders: 'api/v1/purchaseOrders',
    quotations: 'api/v1/quotations',
    requisitions: 'api/v1/requisitions',
    suppliers: 'api/v1/suppliers',
    users: 'api/v1/users',
});
