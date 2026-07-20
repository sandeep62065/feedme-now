# Feedme-Now 🍔

A **full-stack food delivery application** built with the MERN stack (MongoDB, Express, React, Node.js). Features a complete ecosystem for Customers, Admins, and Delivery Partners, including real-time order tracking and live GPS map tracking.

## Features

### 🛒 Customer Features
- 🍽️ Browse a full restaurant menu with categories, search, and veg/non-veg filtering
- 🛒 Client-side cart that persists across page refreshes (localStorage)
- 📍 Set delivery address automatically using Geolocation API
- 📦 Place orders with **server-side price re-validation** to prevent tampering
- 📋 Real-time order tracking (Placed → Preparing → Out for Delivery → Delivered)
- 🗺️ **Live Map Tracking**: Watch the delivery partner approach your location in real-time on a live map (using Leaflet & Socket.io)

### 🛵 Delivery Partner Ecosystem
- 📱 Dedicated dashboard for delivery partners (`/delivery-dashboard`)
- 🔔 Live assignment of orders
- 📍 Real-time GPS broadcasting to update the customer's map
- ✅ Ability to mark orders as Delivered instantly

### 🛡️ Admin Features
- 📊 Admin dashboard to manage menu items (Create, Read, Update, Delete)
- 🔄 Update order statuses manually

### 🔐 Security & Auth
- 🛡️ JWT authentication with secure HTTP-only cookies
- 🔄 Silent token refresh logic (users stay logged in securely)
- 🚪 Protected routes for both frontend and backend APIs

---

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** Atlas connection string (or local MongoDB)

---

## Setup & Local Development

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGODB_URI and JWT secrets
npm install
npm run dev        # starts on http://localhost:5000
```

**Seed sample data** (requires MongoDB to be connected):
```bash
npm run seed
# Note: The server is also configured to auto-seed the database on the first API request if the menu is empty.
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env and ensure VITE_API_BASE_URL points to your backend (e.g. http://localhost:5000/api)
npm install
npm run dev        # starts on http://localhost:5173
```

---

## Environment Variables

### `backend/.env`

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens | *(required)* |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | *(required)* |
| `JWT_ACCESS_EXPIRY` | Access token lifetime | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token lifetime | `7d` |
| `NODE_ENV` | Environment | `development` |
| `CLIENT_URL` | Allowed CORS origin (Frontend URL) | `http://localhost:5173` |

### `frontend/.env`

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL |

*(For production, you can create a `.env.production` file to set `VITE_API_BASE_URL` to your live Vercel backend URL)*

---

## Deployment (Vercel)

The app is fully optimized for Vercel deployment:

1. **Backend**: 
   - Deploy the `backend` folder to Vercel as a Node.js project.
   - Configure `MONGODB_URI` and JWT secrets in Vercel Environment Variables.
   - The app uses serverless-friendly routing and CORS setups.

2. **Frontend**:
   - Deploy the `frontend` folder to Vercel as a Vite/React project.
   - The `vercel.json` file ensures proper SPA (Single Page Application) routing to prevent 404s on page refresh.
   - Set `VITE_API_BASE_URL` to point to your live backend domain.

> ⚠️ **Important Note for Vercel Deployments**: Ensure that Vercel's "Deployment Protection" (Vercel Authentication) is turned **OFF** in your project settings, otherwise the APIs and frontend assets will be blocked by Vercel's login screen.

---

## API Reference

### Auth — `/api/auth`
- `POST /signup` - Register new user
- `POST /login` - Login, returns access token + sets refresh cookie
- `POST /logout` - Clears refresh token
- `POST /refresh` - Get new access token
- `GET /me` - Get current user profile

### Menu — `/api/menu`
- `GET /` - All available items
- `GET /:id` - Single item
- `POST /` - Create item (Admin)
- `PUT /:id` - Update item (Admin)
- `DELETE /:id` - Delete item (Admin)

### Orders — `/api/orders`
- `POST /` - Place an order
- `GET /` - Get user's order history
- `GET /all` - Get all orders (Admin)
- `PATCH /:id/status` - Update order status (Admin)

### Delivery — `/api/delivery`
- `GET /available-orders` - Get orders marked as 'Preparing' or 'Out for delivery'
- `POST /accept-order` - Accept an order for delivery
- `POST /complete-order` - Mark order as 'Delivered'

---

## Admin Access

After running the seed script, you can log in as admin:
- **Email:** `admin@tastybite.com`
- **Password:** `admin123`

> ⚠️ Please change the admin credentials immediately in a production environment.
