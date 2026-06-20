# Buildline Legacy Mock Server

This folder keeps the original `json-server` data used during the early frontend sprint. It is retained as reference material for UI demos and isolated frontend experiments, but it is no longer the active Sprint 3 integration target.

The active API contract is the ASP.NET Core backend deployed at:

```txt
https://buildline-platform.up.railway.app/
```

## Optional Mock Mode

Install dependencies from the frontend root and run:

```sh
npm run dev:mock
```

This starts Vite and the local JSON Server together. Use it only when intentionally testing screens without the real backend.

The mock server runs at:

```txt
http://localhost:3000
```

## Production Mode

Do not deploy this folder as the production API. Production frontend builds should use:

```env
VITE_API_BASE_URL=https://buildline-platform.up.railway.app/
```
