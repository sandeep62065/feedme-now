import React from 'react';
import { Link } from 'react-router-dom';

export default function RestaurantCard({ restaurant }) {
  const { _id, name, description, image, rating, cuisineType, deliveryTime, deliveryFee } = restaurant;

  return (
    <Link 
      to={`/restaurant/${_id}`}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.98] duration-150 border border-outline-variant/10 group flex flex-col h-full"
    >
      {/* Restaurant Image Wrapper */}
      <div className="relative aspect-video w-full overflow-hidden bg-surface-container">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Rating Badge Overlay */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center shadow-sm">
          <span className="material-symbols-outlined text-[14px] text-yellow-500 mr-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
          <span className="font-label-sm text-xs font-bold text-on-surface">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Info details */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-headline-sm text-label-lg text-on-surface group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="text-on-surface-variant font-label-sm text-xs line-clamp-1 mt-0.5">
            {cuisineType.join(', ')}
          </p>
          <p className="text-on-surface-variant/70 font-body-md text-xs line-clamp-2 mt-1 leading-normal">
            {description}
          </p>
        </div>

        {/* Spacing rhythms */}
        <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-[11px] border-t border-outline-variant/10 pt-2 mt-3 uppercase tracking-wider font-semibold">
          <span className="flex items-center gap-0.5">
            <span className="material-symbols-outlined text-xs">schedule</span>
            {deliveryTime}
          </span>
          <span className="flex items-center gap-0.5">
            <span className="material-symbols-outlined text-xs">delivery_dining</span>
            {deliveryFee === 0 ? 'Free Delivery' : `₹${deliveryFee}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
