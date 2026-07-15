import { useCart } from '../context/CartContext';

export default function CartItemRow({ item }) {
  const { updateQty, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
      {/* Image */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{item.name}</p>
        <p className="text-amber-600 font-bold text-sm">₹{item.price}</p>
      </div>

      {/* Qty stepper */}
      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-1 py-1 shrink-0">
        <button
          onClick={() => updateQty(item.menuItemId, item.quantity - 1)}
          className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center active:scale-95 transition-all"
        >
          −
        </button>
        <span className="w-5 text-center font-bold text-gray-900 dark:text-white text-sm">{item.quantity}</span>
        <button
          onClick={() => updateQty(item.menuItemId, item.quantity + 1)}
          className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center active:scale-95 transition-all"
        >
          +
        </button>
      </div>

      {/* Subtotal + remove */}
      <div className="text-right shrink-0">
        <p className="font-bold text-gray-900 dark:text-white text-sm">₹{(item.price * item.quantity).toFixed(0)}</p>
        <button
          onClick={() => removeItem(item.menuItemId)}
          className="text-xs text-red-400 hover:text-red-600 transition-colors mt-0.5"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
