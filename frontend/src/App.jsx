import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { loadUser } from './store/slices/authSlice';
import { fetchCart } from './store/slices/cartSlice';

// Global Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

// Pages
import Home from './features/home/Home';
import RestaurantDetails from './features/menu/RestaurantDetails';
import Checkout from './features/checkout/Checkout';
import OrderTracking from './features/order/OrderTracking';
import Profile from './features/profile/Profile';
import AdminDashboard from './features/admin/AdminDashboard';

import './App.css';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Attempt to load user profile on startup
    if (localStorage.getItem('token')) {
      dispatch(loadUser());
    }
    // Fetch cart (DB cart if authenticated, or localStorage guest cart)
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Navbar />

        {/* Global Slide-in Cart Drawer */}
        <CartDrawer />

        {/* Main Content Area */}
        <main className="flex-1 bg-surface">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmed/:id" element={<OrderTracking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Toast Alerts System */}
        <Toaster 
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#191c1d',
              color: '#ffffff',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              borderRadius: '8px',
            },
            success: {
              iconTheme: {
                primary: '#006d37',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ba1a1a',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}
