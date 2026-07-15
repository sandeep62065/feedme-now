import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
              <Navbar />
              <main className="flex-1">
              <Routes>
                {/* Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected — must be logged in */}
                <Route
                  path="/checkout"
                  element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}
                />
                <Route
                  path="/orders"
                  element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>}
                />
                <Route
                  path="/orders/:id"
                  element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>}
                />

                {/* Admin only */}
                <Route
                  path="/admin"
                  element={<AdminRoute><AdminPage /></AdminRoute>}
                />

                {/* 404 */}
                <Route path="*" element={
                  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <span className="text-7xl">😕</span>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">Page not found</h2>
                    <a href="/" className="text-amber-600 font-bold hover:underline">← Go home</a>
                  </div>
                } />
              </Routes>
            </main>

            {/* ── Footer ─────────────────────────────────────────────── */}
            <footer className="bg-gray-950 text-gray-400">
              {/* Top grid */}
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                {/* Brand */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🍔</span>
                    <span className="text-xl font-black text-white">
                      Feedme<span className="text-amber-500">-Now</span>
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-500">
                    "Hungry? We've got you."
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <svg className="w-4 h-4 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500">Open Daily: 11:00 AM – 11:00 PM</span>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider">Quick Links</h4>
                  <nav className="flex flex-col gap-2 text-sm">
                    {[
                      { label: 'Menu', to: '/menu' },
                      { label: 'Cart', to: '/cart' },
                      { label: 'My Orders', to: '/orders' },
                      { label: 'About', to: '/#about' },
                      { label: 'Terms & Privacy', to: '#' },
                    ].map((l) => (
                      <a
                        key={l.label}
                        href={l.to}
                        className="text-gray-500 hover:text-amber-400 transition-colors"
                      >
                        {l.label}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Contact */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider">Contact</h4>
                  <div className="flex flex-col gap-3 text-sm">
                    <a href="tel:+916206551548" className="flex items-center gap-2 text-gray-500 hover:text-amber-400 transition-colors">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +91 6206551548
                    </a>
                    <a href="mailto:sidhartsingh4455@gmail.com" className="flex items-center gap-2 text-gray-500 hover:text-amber-400 transition-colors">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      sidhartsingh4455@gmail.com
                    </a>
                  </div>
                </div>

                {/* Social */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider">Follow Us</h4>
                  <div className="flex gap-3">
                    {[
                      {
                        label: 'Instagram',
                        href: '#',
                        icon: (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                        ),
                      },
                      {
                        label: 'Facebook',
                        href: '#',
                        icon: (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        ),
                      },
                      {
                        label: 'Twitter / X',
                        href: '#',
                        icon: (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        ),
                      },
                    ].map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        aria-label={s.label}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-amber-500 text-gray-400 hover:text-white flex items-center justify-center transition-all"
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom bar */}
              <div className="border-t border-white/5">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
                  <span>© {new Date().getFullYear()} Feedme-Now. All rights reserved.</span>
                  <div className="flex gap-4">
                    <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
                    <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-gray-400 transition-colors">Contact</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>

            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 3000,
                style: { background: '#1f2937', color: '#fff', fontSize: '13px', fontFamily: 'Inter, sans-serif', borderRadius: '12px' },
                success: { iconTheme: { primary: '#f59e0b', secondary: '#fff' } },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
