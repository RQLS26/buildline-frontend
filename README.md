# Buildline Frontend

Buildline Frontend is the Vue 3 single-page application for the Buildline construction logistics platform. It provides the Sprint 2/Sprint 3 web experience for IAM, company profiles, requisitions, procurement, inventory, delivery tracking, suppliers, analytics and communication.

The application follows the DDD-oriented structure used in the course reference project. Shared HTTP behavior is centralized in `BaseApi`, reusable CRUD operations are centralized in `BaseEndpoint`, and each bounded context exposes its own infrastructure API adapter so presentation views and Pinia stores do not duplicate backend routes.

## Architecture

- `iam`: sign-in, sign-up, browser session storage, route guard and users management.
- `profiles`: company profile lookup and update workflow.
- `requisition`: material requisition list, creation flow and material-reference consumption.
- `procurement`: purchase orders, quotations and approval workflows.
- `inventory`: stock listing, stock thresholds and item update workflows.
- `delivery`: delivery tracking and delivery-status transitions.
- `suppliers`: supplier directory, validation simulation and supplier incidents.
- `analytics-budgeting`: budget dashboard data and report views.
- `communication`: messages, read state and starred-message workflows.
- `shared`: layout, reusable UI, route shell, HTTP client infrastructure and endpoint utilities.

Layer responsibilities:

| Layer | Responsibility |
| --- | --- |
| `presentation` | Vue views, route modules and screen-level interaction handlers. |
| `application` | Pinia stores that coordinate UI use cases and state transitions. |
| `domain/model` | Frontend domain entities used to represent business concepts. |
| `infrastructure` | API adapters, assemblers, route guards, session helpers and shared HTTP plumbing. |
| `shared` | Cross-context infrastructure and shared presentation building blocks. |

Vue Single File Components intentionally keep `template`, `script setup` and `style scoped` in one `.vue` file. That is the expected Vue convention. A view should be split into child components only when a table, dialog, form or repeated UI block has an independent responsibility or is reused by more than one screen.

## Production Deployment

Production is deployed on Vercel as a static SPA:

- Production URL: `https://buildline-delta.vercel.app/`
- Repository: `https://github.com/RQLS26/buildline-frontend`
- Production branch: `main`
- Integration branch: `develop`
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing config: `vercel.json`

Vercel must define:

```env
VITE_API_BASE_URL=https://buildline-platform.up.railway.app/
```

Expected deployment behavior:

- Vite builds static assets into `dist/`.
- Vercel serves the SPA with history fallback through `vercel.json`.
- The deployed frontend consumes the Railway backend at `https://buildline-platform.up.railway.app/`.
- Protected API calls require a valid JWT created through the IAM flow.
- Backend CORS must allow the Vercel production origin.

## API Integration

The frontend consumes the Buildline backend API deployed on Railway:

- Base URL: `https://buildline-platform.up.railway.app/`
- Swagger UI: `https://buildline-platform.up.railway.app/swagger/index.html`
- Health check: `https://buildline-platform.up.railway.app/api/v1/health`

For local backend development, replace the Vercel environment value with:

```env
VITE_API_BASE_URL=http://localhost:5163/
```

`VITE_API_BASE_URL` must point to the API host root. Backend route fragments such as `api/v1/inventory` or `api/v1/auth/sign-in` are owned by `src/shared/infrastructure/api-endpoints.js` and by each bounded-context API adapter.

`BaseApi` is the generic shared Axios client. It centralizes backend base URL resolution, JSON headers, JWT Bearer attachment and protected-resource `401` session cleanup. Bounded-context adapters such as `InventoryApi`, `DeliveryApi`, `IamApi` and `SuppliersApi` extend `BaseApi` and expose feature-specific methods. Pinia stores should call those adapters instead of creating Axios clients or hard-coding `/api/v1/...` paths.

## Frontend Session Handling

The frontend keeps only the browser-side session state needed by the SPA:

- `src/iam/infrastructure/iam-session.js` owns the `auth_token` and `auth_user` storage keys.
- `src/iam/infrastructure/authentication.guard.js` protects private and admin-only routes.
- `BaseApi` attaches the stored token to protected API requests.
- A protected-resource `401` clears the browser session and redirects the user to sign-in.

Authorization remains a backend responsibility. Frontend route guards exist to improve user experience and avoid showing screens the current role should not use.

## Frontend Contract Coverage

| Frontend capability | Backend endpoint | Context adapter |
| --- | --- | --- |
| Sign-in / sign-up | `/api/v1/auth/*` | `IamApi` |
| Users | `/api/v1/companies/{companyId}/users` and `/api/v1/users/me` | `IamApi` |
| Company profile | `/api/v1/profiles` | `ProfilesApi` |
| Requisitions | `/api/v1/companies/{companyId}/requisitions` | `RequisitionApi` |
| Materials | `/api/v1/companies/{companyId}/materials` | `RequisitionApi` |
| Purchase orders | `/api/v1/companies/{companyId}/purchase-orders` | `ProcurementApi` |
| Quotations | `/api/v1/companies/{companyId}/quotations` | `ProcurementApi` |
| Inventory | `/api/v1/companies/{companyId}/inventory` | `InventoryApi` |
| Deliveries | `/api/v1/companies/{companyId}/deliveries` | `DeliveryApi` |
| Suppliers | `/api/v1/companies/{companyId}/suppliers` | `SuppliersApi` |
| Incidents | `/api/v1/companies/{companyId}/incidents` | `SuppliersApi` |
| Budgets | `/api/v1/companies/{companyId}/budgets` | `AnalyticsApi` |
| Messages | `/api/v1/companies/{companyId}/messages` | `CommunicationApi` |

## Development

Install dependencies:

```sh
npm install
```

Run the Vue development server against the configured backend:

```sh
npm run dev
```

Run the legacy JSON Server mock together with Vite:

```sh
npm run dev:mock
```

Build the production bundle:

```sh
npm run build
```

Preview the production bundle locally:

```sh
npm run preview
```

## Mock Server

The `server/` folder remains only as legacy mock-data evidence from the early frontend sprint. It is not the production API. Sprint 3 uses the ASP.NET Core backend deployed on Railway.

Use `npm run dev:mock` only when intentionally testing the UI without the real backend.

## Verification

Local build verification:

```sh
npm run build
```

Production API smoke check:

```powershell
Invoke-WebRequest -Uri 'https://buildline-platform.up.railway.app/api/v1/health' -UseBasicParsing
```

Expected backend health response:

```json
{"status":"Healthy","service":"Buildline Platform API"}
```

Known Vite build warning:

- Some generated chunks may exceed 500 kB because PrimeVue, PrimeIcons and dashboard dependencies are bundled into the SPA.
- This is a bundle-size optimization warning, not a build failure.
