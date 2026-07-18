# TastyBite 🍔

A **single-restaurant food ordering web app** built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- 🍽️ Browse a full restaurant menu with categories, search, and veg/non-veg filtering
- 🛒 Client-side cart that persists across page refreshes (localStorage)
- 🔐 JWT auth with short-lived access tokens (15 min) + long-lived refresh tokens (7 days, httpOnly cookie)
- 🔄 Silent token refresh via Axios interceptor — users stay logged in without re-entering their password
- 📍 Delivery address with Google Places Autocomplete + "Use my current location" (Geolocation API)
- 📦 Order placement with **server-side price re-validation** — client prices are never trusted
- 📋 Real-time order tracking (placed → preparing → out for delivery → delivered) via **Socket.io** WebSockets
- 🗺️ Live Delivery Map and Delivery Partner details integration
- 🛡️ Admin dashboard to manage menu items (CRUD) and update order statuses

---

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** running locally (`mongod`) or a MongoDB Atlas connection string
- (Optional) A **Google Maps API key** for address autocomplete

---

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
npm install
npm run dev        # starts on http://localhost:5000
```

**Seed sample data** (requires MongoDB to be running):
```bash
npm run seed
# Creates 16 menu items + admin user: admin@tastybite.com / admin123
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# Add your VITE_GOOGLE_MAPS_API_KEY if available (optional)
npm install
npm run dev        # starts on http://localhost:5173
```

---

## Environment Variables

### `backend/.env`

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/tastybite` |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens | *(required)* |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | *(required)* |
| `JWT_ACCESS_EXPIRY` | Access token lifetime | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token lifetime | `7d` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |

### `frontend/.env`

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `http://localhost:5000/api`) |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key (optional — falls back to plain text input) |

---

## Getting a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable these three APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**
4. Go to **Credentials → Create API Key**
5. (Recommended) Add HTTP referrer restrictions: `http://localhost:5173/*`
6. Copy the key into `frontend/.env` as `VITE_GOOGLE_MAPS_API_KEY`

---

## API Reference

### Auth — `/api/auth`
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/signup` | — | Register new user |
| POST | `/login` | — | Login, returns access token + sets refresh cookie |
| POST | `/logout` | — | Clears refresh token |
| POST | `/refresh` | Cookie | Get new access token |
| GET | `/me` | ✅ | Get current user profile |
| GET | `/addresses` | ✅ | List saved addresses |
| POST | `/addresses` | ✅ | Add a saved address |
| DELETE | `/addresses/:id` | ✅ | Remove a saved address |

### Menu — `/api/menu`
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | — | All available items (optional `?category=`) |
| GET | `/search?q=` | — | Regex search across name/description/category |
| GET | `/categories` | — | Distinct category list |
| GET | `/:id` | — | Single item |
| POST | `/` | 🛡️ Admin | Create item |
| PUT | `/:id` | 🛡️ Admin | Update item |
| DELETE | `/:id` | 🛡️ Admin | Delete item |

### Orders — `/api/orders`
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Place order (re-validates prices server-side) |
| GET | `/` | ✅ | Current user's order history |
| GET | `/all` | 🛡️ Admin | All orders |
| GET | `/:id` | ✅ | Single order (owner or admin) |
| PATCH | `/:id/status` | 🛡️ Admin | Update order status |

---

## Project Structure

```
food ordering/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # authController, menuController, orderController
│   ├── middleware/       # protect, adminOnly, errorHandler
│   ├── models/          # User, MenuItem, Order
│   ├── routes/          # auth.js, menu.js, orders.js
│   ├── seed.js          # Sample data seed script
│   └── server.js
└── frontend/
    └── src/
        ├── context/     # AuthContext, CartContext
        ├── services/    # api.js (Axios + token refresh interceptor)
        ├── components/  # Navbar, MenuItemCard, CartItemRow, AddressAutocomplete, guards
        └── pages/       # Home, Menu, Cart, Login, Signup, Checkout, Orders, Admin
```

---

## Admin Access

After running the seed script:
- **Email:** `admin@tastybite.com`
- **Password:** `admin123`

> ⚠️ Change the admin password immediately in a production environment.
