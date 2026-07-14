import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface mt-auto py-8 px-margin-mobile border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Information */}
        <div className="space-y-3">
          <Link to="/" className="font-display text-display-mobile font-extrabold text-primary-fixed tracking-tight text-2xl">
            FreshBite
          </Link>
          <p className="text-sm text-f0f1f2/70 max-w-xs leading-normal">
            Satisfy your high-velocity cravings instantly with premium wood-fired pizzas, gourmet double cheeseburgers, and traditional local cuisines.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-label-lg text-white mb-3 text-sm uppercase tracking-wider">Quick Navigation</h4>
          <ul className="space-y-2 text-sm text-f0f1f2/80">
            <li><Link to="/" className="hover:text-primary transition-colors">Restaurants</Link></li>
            <li><Link to="/profile" className="hover:text-primary transition-colors">My Profile</Link></li>
            <li><Link to="/profile?tab=orders" className="hover:text-primary transition-colors">Order History</Link></li>
          </ul>
        </div>

        {/* Contact and Info */}
        <div>
          <h4 className="font-label-lg text-white mb-3 text-sm uppercase tracking-wider">Contact & Help</h4>
          <ul className="space-y-2 text-sm text-f0f1f2/80">
            <li className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs">mail</span>
              support@freshbite.com
            </li>
            <li className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs">call</span>
              +1 (800) 555-BITE
            </li>
            <li className="text-[11px] text-f0f1f2/50 pt-2 border-t border-white/10 mt-3">
              &copy; {new Date().getFullYear()} FreshBite Food Delivery. All rights reserved.
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
