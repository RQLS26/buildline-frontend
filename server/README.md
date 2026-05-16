# Buildline JSON Server

This folder is configured to be deployed as a standalone Web Service (e.g. on Render) to act as the mock backend for the production frontend.

## Local Development

```bash
npm install
npm run dev
```

Local frontend development expects this server at:
```txt
http://localhost:3000
```

## Hosted Service (Render)

Deploy this `server/` folder as a Node Web Service.

- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Suggested Name**: `buildline-json-server`

If deployed on Render, it will inject its own `$PORT` automatically thanks to the start script in `package.json`.

Make sure to update your frontend's `base-api.js` (or environment variables) to point to your new production URL (e.g., `https://buildline-json-server.onrender.com`) instead of localhost.
