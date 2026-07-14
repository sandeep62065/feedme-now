import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toggleCartDrawer } from '../store/slices/cartSlice';
import { setSearchQuery } from '../store/slices/foodSlice';
import AuthModal from './AuthModal';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const { searchQuery } = useSelector((state) => state.food);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  // Total items quantity inside cart
  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Get active address
  const activeAddress = user?.addresses?.find((addr) => addr.isDefault) || user?.addresses?.[0];

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
    // If not on home page, navigate to home to show search results
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-surface/85 backdrop-blur-xl shadow-sm border-b border-outline-variant/10">
        <div className="flex flex-col w-full max-w-7xl mx-auto px-margin-mobile py-sm gap-2">
          <div className="flex justify-between items-center w-full">
            
            {/* Delivery Location Section */}
            <div className="flex items-center gap-2 relative">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                location_on
              </span>
              <button 
                onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                className="flex flex-col text-left active:scale-95 transition-transform"
              >
                <span className="font-label-sm text-[10px] text-on-surface-variant leading-none uppercase tracking-wider">
                  Deliver to
                </span>
                <span className="font-label-lg text-label-lg flex items-center gap-0.5 text-on-surface hover:text-primary transition-colors">
                  {activeAddress 
                    ? `${activeAddress.street}, ${activeAddress.city}` 
                    : 'Select Address'} 
                  <span className="material-symbols-outlined text-xs">expand_more</span>
                </span>
              </button>

              {/* Address dropdown list */}
              {showAddressDropdown && isAuthenticated && (
                <div className="absolute top-12 left-0 w-64 bg-white rounded-xl shadow-xl border border-outline-variant/10 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <h4 className="font-label-lg text-on-surface border-b pb-2 mb-2">My Addresses</h4>
                  {user?.addresses && user.addresses.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {user.addresses.map((addr) => (
                        <div 
                          key={addr._id}
                          className={`p-2 rounded-lg text-label-sm cursor-pointer hover:bg-surface-container transition-colors ${addr.isDefault ? 'border border-primary-container bg-primary-container/5' : ''}`}
                          onClick={() => {
                            // We can build an address switcher or just link to profile
                            navigate('/profile');
                            setShowAddressDropdown(false);
                          }}
                        >
                          <p className="font-semibold">{addr.street}</p>
                          <p className="text-on-surface-variant">{addr.city}, {addr.state} - {addr.zipCode}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-on-surface-variant text-label-sm">No addresses saved. Add one in profile.</p>
                  )}
                  <Link 
                    to="/profile" 
                    onClick={() => setShowAddressDropdown(false)}
                    className="block text-center mt-3 text-primary font-label-lg text-label-sm hover:underline"
                  >
                    Manage Addresses
                  </Link>
                </div>
              )}
            </div>

            {/* Brand Logo */}
            <Link to="/" className="font-display text-display-mobile font-extrabold text-primary tracking-tight md:text-2xl active:scale-[0.98] transition-transform">
              FreshBite
            </Link>

            {/* User Profile and Cart drawer trigger */}
            <div className="flex items-center gap-4">
              
              {/* Admin Link if role is admin */}
              {isAuthenticated && user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="bg-secondary text-on-secondary font-label-lg text-label-sm px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-shadow active:scale-95"
                >
                  Admin
                </Link>
              )}

              {/* Profile Avatar Button */}
              <button 
                onClick={handleProfileClick}
                className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-[24px]">
                  account_circle
                </span>
                <span className="font-label-lg text-label-lg hidden sm:inline">
                  {isAuthenticated ? user.name.split(' ')[0] : 'Sign In'}
                </span>
              </button>

              {/* Cart Drawer Trigger */}
              <button 
                onClick={() => dispatch(toggleCartDrawer())}
                className="relative p-2 rounded-full hover:bg-surface-container active:scale-95 transition-all text-on-surface flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-on-surface text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                  shopping_cart
                </span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-on-primary text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white animate-pulse">
                    {cartItemsCount}
                  </span>
                )}
              </button>

            </div>
          </div>

          {/* Search bar inside header */}
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm select-none pointer-events-none">
              search
            </span>
            <input 
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-10 pl-10 pr-4 bg-surface-container-low rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md placeholder:text-on-surface-variant/50 transition-shadow shadow-sm" 
              placeholder="Search for food, cuisines, restaurants..." 
              type="text"
            />
          </div>
        </div>
      </header>

      {/* Auth Modal for Login/Registration */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
