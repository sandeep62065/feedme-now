import { useState } from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function MenuItemCard({ item }) {
  const { addItem, items, updateQty, removeItem } = useCart();
  const [imgError, setImgError] = useState(false);

  const cartEntry = items.find((i) => i.menuItemId === item._id);
  const qty = cartEntry?.quantity || 0;

  const handleAdd = () => {
    addItem(item, 1);
    toast.success(`${item.name} added to cart!`, { duration: 1500 });
  };

  const handleIncrease = () => updateQty(item._id, qty + 1);
  const handleDecrease = () => {
    if (qty === 1) {
      removeItem(item._id);
    } else {
      updateQty(item._id, qty - 1);
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col">
      {/* Image */}
      <div className="relative h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {!imgError && item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-amber-50">
            🍽️
          </div>
        )}
        {/* Veg / Non-veg badge */}
        <div className={`absolute top-2 left-2 w-5 h-5 rounded-sm border-2 flex items-center justify-center ${item.isVeg ? 'border-green-600 bg-white dark:bg-gray-900' : 'border-red-600 bg-white dark:bg-gray-900'}`}>
          <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
        </div>
        {/* Tags */}
        {item.tags?.includes('bestseller') && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Bestseller
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight">{item.name}</h3>
          {item.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-lg font-black text-gray-900 dark:text-white">₹{item.price}</span>

          {qty === 0 ? (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-gray-800 border border-amber-200 dark:border-gray-700 rounded-xl px-1 py-1">
              <button
                onClick={handleDecrease}
                className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center active:scale-95 transition-all"
              >
                −
              </button>
              <span className="w-5 text-center font-bold text-gray-900 dark:text-white text-sm">{qty}</span>
              <button
                onClick={handleIncrease}
                className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center active:scale-95 transition-all"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
