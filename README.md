# Buildline Digital Construction Logistics - Frontend

Welcome to the frontend repository for **Buildline v1.0.0**. This project is a comprehensive enterprise dashboard built to manage digital construction logistics, procurement, material requisitions, deliveries, and analytics.

It is built adhering to **Domain-Driven Design (DDD)** principles.

## 🚀 Tech Stack
- **Framework:** Vue 3
- **Build Tool:** Vite
- **State Management:** Pinia
- **HTTP Client:** Axios
- **Mock Backend:** JSON Server (REST API)

## 📁 Project Structure (DDD)
The project is strictly separated into Bounded Contexts to maintain scalability and clean architecture:
- `/iam` - Identity and Access Management
- `/procurement` - Purchase Orders and Procurement logic
- `/requisition` - Material Requests and Inventory needs
- `/inventory` - Stock Control
- `/analytics-budgeting` - Project Budgets and Reports
- `/suppliers` - Suppliers Directory and Incident Management
- `/delivery` - Delivery and Tracking
- `/communication` - Internal Messaging and Notifications
- `/shared` - Core Infrastructure, Layouts, and Common UI Components

## ⚙️ Local Development Setup

1. **Install Dependencies**
   ```sh
   npm install
   ```

2. **Run the Development Server**
   To run both the Vite frontend and the mock JSON server simultaneously:
   ```sh
   npm run dev
   ```

   *Note: By default, the application connects to the local JSON Server (`localhost:3000`). If you wish to connect your local environment to the production backend, create an `.env` file at the root with `VITE_API_BASE_URL=https://<your-render-url>/`.*

3. **Build for Production**
   ```sh
   npm run build
   ```

## ☁️ Deployment

- **Frontend:** Deployed as a Single Page Application (SPA) on **Vercel**.
- **Backend (Mock):** The `server/db.json` is deployed separately as a Node.js web service on **Render**. See `server/README.md` for more details.

## 🏷️ Release v1.0.0
This marks the first stable production release integrating all core operational modules, responsive dashboards, and cloud deployment ready for final presentation.
