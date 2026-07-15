import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItemRow from '../components/CartItemRow';

export default function CartPage() {
  const { items, itemCount, subtotal, clearCart } = useCart();

  const deliveryFee = subtotal > 0 && subtotal < 300 ? 40 : 0;
  const gst = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + deliveryFee + gst;

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors flex flex-col items-center justify-center py-24 px-4">
        <span className="text-7xl mb-6">🛒</span>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Add some delicious items from our menu!</p>
        <Link
          to="/menu"
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-2xl transition-colors shadow-md"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Your Cart</h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-400 hover:text-red-600 font-semibold transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Items */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
            {items.map((item) => (
              <CartItemRow key={item.menuItemId} item={item} />
            ))}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Link to="/menu" className="text-amber-600 hover:text-amber-700 font-semibold text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Add more items
              </Link>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 h-fit">
            <h2 className="font-black text-gray-900 dark:text-white text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>GST (5%)</span>
                <span className="font-semibold text-gray-900 dark:text-white">₹{gst.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery fee</span>
                <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-gray-400">Free delivery on orders over ₹300</p>
              )}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between font-black text-gray-900 dark:text-white text-base">
                <span>Total</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-6 w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-black text-base py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              Proceed to Checkout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
