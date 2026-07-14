import React from 'react';

export default function RatingStars({ rating, size = 16 }) {
  const roundedRating = Math.round(rating * 2) / 2; // round to nearest 0.5
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(
        <span 
          key={i} 
          className="material-symbols-outlined text-yellow-500 select-none"
          style={{ fontSize: `${size}px`, fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
      );
    } else if (i - 0.5 === roundedRating) {
      stars.push(
        <span 
          key={i} 
          className="material-symbols-outlined text-yellow-500 select-none"
          style={{ fontSize: `${size}px` }}
        >
          star_half
        </span>
      );
    } else {
      stars.push(
        <span 
          key={i} 
          className="material-symbols-outlined text-yellow-500/30 select-none"
          style={{ fontSize: `${size}px` }}
        >
          star
        </span>
      );
    }
  }

  return <div className="flex items-center">{stars}</div>;
}
