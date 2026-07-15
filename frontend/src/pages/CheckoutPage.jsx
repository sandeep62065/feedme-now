import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AddressAutocomplete from '../components/AddressAutocomplete';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(null);
  const [addressError, setAddressError] = useState('');
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);

  // Show saved addresses
  const savedAddresses = user?.addresses || [];

  const deliveryFee = subtotal > 0 && subtotal < 300 ? 40 : 0;
  const gst = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + deliveryFee + gst;

  const handleSelectSavedAddress = (addr) => {
    setAddress({ formattedAddress: addr.formattedAddress, lat: addr.lat, lng: addr.lng, placeId: addr.placeId });
    setAddressError('');
  };

  const handlePlaceOrder = async () => {
    if (!address?.formattedAddress?.trim()) {
      setAddressError('Please enter a delivery address.');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }
    setPlacing(true);
    try {
      const payload = {
        items: items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
        deliveryAddress: address,
        notes,
      };
      const { data } = await api.post('/orders', payload);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">🛒</span>
        <p className="text-gray-600 dark:text-gray-400 font-semibold">Nothing in your cart to checkout.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left — address + notes */}
          <div className="flex-1 space-y-5">
            {/* Delivery address */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <h2 className="font-black text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                <span>📍</span> Delivery Address
              </h2>

              {/* Saved addresses */}
              {savedAddresses.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Saved addresses</p>
                  <div className="space-y-2">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr._id}
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={`w-full text-left p-3 rounded-xl border-2 transition-all text-sm ${address?.formattedAddress === addr.formattedAddress ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20' : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-400'}`}
                      >
                        <span className="font-semibold text-gray-700 dark:text-gray-200">{addr.label} — </span>
                        <span className="text-gray-500 dark:text-gray-400">{addr.formattedAddress}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3 mb-2">Or enter a new address:</p>
                </div>
              )}

              <AddressAutocomplete
                value={address?.formattedAddress || ''}
                onChange={(val) => { setAddress(val); setAddressError(''); }}
                error={addressError}
              />
            </div>

            {/* Notes */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <h2 className="font-black text-gray-900 dark:text-white text-lg mb-3 flex items-center gap-2">
                <span>📝</span> Order Notes
                <span className="text-xs font-normal text-gray-400">(optional)</span>
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="E.g. No onions, extra spicy, ring the bell…"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 dark:focus:border-amber-400 transition resize-none"
              />
            </div>
          </div>

          {/* Right — order summary */}
          <div className="lg:w-80 space-y-4 h-fit">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <h2 className="font-black text-gray-900 dark:text-white text-lg mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm mb-4">
                {items.map((item) => (
                  <div key={item.menuItemId} className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span className="truncate max-w-[140px]">{item.name} × {item.quantity}</span>
                    <span className="font-semibold text-gray-900 dark:text-white shrink-0 ml-2">₹{(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span><span className="font-semibold text-gray-900 dark:text-white">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>GST (5%)</span><span className="font-semibold text-gray-900 dark:text-white">₹{gst.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between font-black text-gray-900 dark:text-white text-base pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span>Total</span><span>₹{total.toFixed(0)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full h-14 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-black text-base rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
            >
              {placing ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Place Order</span>
                  <span className="text-lg">🎉</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400">
              Payment collected at delivery. No online payment required for v1.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
