# FreshBite - Full-Stack Food Ordering Web App

FreshBite is a full-stack, mobile-first food delivery application built using the MERN stack (MongoDB, Express, React 19, Node.js) with a modern UI inspired by Swiggy, Zomato, and Uber Eats. 

---

## Key Features

1. **Persisted Shopping Cart:** User carts are stored in MongoDB and synced across logins. Anonymous guest carts are cached in `localStorage` and automatically merged into the database upon user registration or sign-in.
2. **Dynamic UI:** Rounded layouts, custom typography scales, appetite-stimulating Cravet Red themes, micro-animations, and glassmorphism headers.
3. **Menu Categorization:** Sticky category links that scroll directly to sections in restaurant menu views.
4. **Interactive Stepper:** Food items select inline stepper widgets directly inside food cards when added, mimicking premium delivery apps.
5. **Simulated Live Tracking:** Real-time progress tracker (Placed -> Preparing -> Out for Delivery -> Delivered) using automated database status synchronization.
6. **Admin Dispatch Center:** Integrated dashboard containing analytics summary stats (revenue, customers, active stores), dropdown status modification, and CRUD capabilities for categories, restaurants, and menu foods.

---

## Seeding & Test Credentials

The database contains default seeded accounts to jumpstart testing immediately. Run `npm run seed` in the backend folder to populate the database.

*   **Customer Account:**
    *   **Email:** `user@freshbite.com`
    *   **Password:** `user123`
    *   **Preset Addresses:** 123 Maple St, NY.
*   **Admin Account:**
    *   **Email:** `admin@freshbite.com`
    *   **Password:** `admin123`
*   **Active Coupons:**
    *   `FRESH50` (50% Off, min order ₹200, max discount ₹150)
    *   `BITE100` (Flat ₹100 Off, min order ₹300)

---

## Setup Instructions

### Prerequisites
- Node.js installed locally
- Local MongoDB instance running at `mongodb://127.0.0.1:27017`

### Step 1: Clone & Install Dependencies
1. Navigate to the project root:
   ```bash
   cd "c:\Users\ps061\OneDrive\Desktop\food ordering"
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Step 2: Configure Environment Variables
Copy the `.env.example` files to `.env` in both folders. The preconfigured defaults are ready for local use:
- **Backend (`backend/.env`):**
  ```env
  PORT=5000
  MONGODB_URI=mongodb://127.0.0.1:27017/freshbite
  JWT_SECRET=super_secret_freshbite_token_key_123!
  NODE_ENV=development
  FRONTEND_URL=http://localhost:5173
  ```
- **Frontend (`frontend/.env`):**
  ```env
  VITE_API_URL=http://localhost:5000/api
  ```

### Step 3: Populate Mock Database
Seed the local MongoDB database:
```bash
cd backend
npm run seed
```

### Step 4: Run the Application
1. Start the backend Express server:
   ```bash
   cd backend
   npm run dev
   ```
2. Start the frontend Vite development server in another terminal window:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.
