import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  setCartDrawerOpen,
  updateCartItemQty,
  removeCartItem,
  applyPromoCoupon,
  removeCoupon
} from '../store/slices/cartSlice';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCartDrawerOpen, items, subtotal, deliveryFee, gst, total, appliedCoupon } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleClose = () => {
    dispatch(setCartDrawerOpen(false));
  };

  const handleQtyChange = (foodId, currentQty, increment) => {
    const newQty = currentQty + (increment ? 1 : -1);
    if (newQty < 1) {
      dispatch(removeCartItem(foodId));
      toast.success('Item removed from cart');
    } else {
      dispatch(updateCartItemQty({ foodId, quantity: newQty }));
    }
  };

  const handleRemoveItem = (foodId) => {
    dispatch(removeCartItem(foodId));
    toast.success('Item removed from cart');
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (!isAuthenticated) {
      toast.error('Please sign in to apply coupons');
      return;
    }

    setCouponLoading(true);
    try {
      const resultAction = await dispatch(applyPromoCoupon(couponCode));
      if (applyPromoCoupon.fulfilled.match(resultAction)) {
        toast.success(`Coupon "${couponCode.toUpperCase()}" applied!`);
        setCouponCode('');
      } else {
        toast.error(resultAction.payload || 'Invalid coupon code');
      }
    } catch (err) {
      toast.error('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    toast.success('Coupon removed');
  };

  const handleCheckout = () => {
    dispatch(setCartDrawerOpen(false));
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      toast.error('Please sign in to complete your checkout');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={handleClose}
        className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-40 transition-opacity duration-300 animate-in fade-in"
      />

      {/* Slide-in Drawer Container */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col border-l border-outline-variant/10 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <header className="flex items-center justify-between px-lg py-lg border-b border-outline-variant/20 bg-surface/50">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="font-headline-md text-headline-md text-on-surface">Your Cart</h2>
          </div>
          <span className="bg-primary-container text-on-primary-container font-label-lg text-label-lg px-3 py-1 rounded-full">
            {items.reduce((acc, item) => acc + item.quantity, 0)} Items
          </span>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-lg py-xl space-y-lg">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.food._id} className="flex gap-md group animate-in fade-in slide-in-from-bottom-2 duration-200">
                
                {/* Item Image */}
                <div className="relative h-24 w-24 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                  <img 
                    className="w-full h-full object-cover" 
                    src={item.food.image} 
                    alt={item.food.name}
                  />
                  {!item.food.isVeg && (
                    <span className="absolute top-1 left-1 bg-red-600 h-2.5 w-2.5 rounded-full border border-white" />
                  )}
                  {item.food.isVeg && (
                    <span className="absolute top-1 left-1 bg-emerald-600 h-2.5 w-2.5 rounded-full border border-white" />
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline-sm text-label-lg text-on-surface line-clamp-1">{item.food.name}</h3>
                      <p className="font-label-sm text-[11px] text-on-surface-variant line-clamp-1">
                        {item.food.restaurant?.name || 'FreshBite Chef'}
                      </p>
                    </div>
                    <span className="font-headline-sm text-label-lg text-primary font-bold">
                      ₹{(item.food.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Stepper and Delete button */}
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center bg-surface-container rounded-full p-0.5 border border-outline-variant/20 shadow-sm">
                      <button 
                        onClick={() => handleQtyChange(item.food._id, item.quantity, false)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">remove</span>
                      </button>
                      <span className="px-3 font-label-lg text-label-sm text-on-surface font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => handleQtyChange(item.food._id, item.quantity, true)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">add</span>
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleRemoveItem(item.food._id)}
                      className="text-on-surface-variant hover:text-error transition-colors p-1.5 active:scale-90 rounded-full hover:bg-error/5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>

              </div>
            ))
          ) : (
            // Empty State
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">
                shopping_cart
              </span>
              <div>
                <h3 className="font-headline-sm text-on-surface">Your cart is empty</h3>
                <p className="text-body-md text-on-surface-variant/60 mt-1 max-w-[240px] mx-auto text-sm">
                  Explore top restaurants to find delicious dishes and fill your cart!
                </p>
              </div>
              <button 
                onClick={handleClose}
                className="bg-primary text-on-primary font-label-lg text-label-sm px-5 py-2 rounded-lg active:scale-95 transition-transform shadow-sm hover:shadow-md cursor-pointer"
              >
                Start Browsing
              </button>
            </div>
          )}
        </div>

        {/* Footer Billing Details */}
        {items.length > 0 && (
          <footer className="border-t border-outline-variant/30 p-lg bg-surface/40 space-y-4">
            
            {/* Promo Coupon Form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input 
                type="text" 
                value={couponCode}
                disabled={appliedCoupon || couponLoading}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder={appliedCoupon ? `Coupon ${appliedCoupon.code} Applied` : "Enter coupon code (e.g. FRESH50)"}
                className="flex-1 h-9 px-3 bg-white rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary text-label-sm uppercase placeholder:normal-case disabled:bg-surface-container disabled:text-on-surface-variant/60"
              />
              {appliedCoupon ? (
                <button 
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="bg-error/10 hover:bg-error/20 text-error font-label-lg text-label-sm px-4 rounded-lg active:scale-95 transition-all cursor-pointer"
                >
                  Remove
                </button>
              ) : (
                <button 
                  type="submit"
                  disabled={couponLoading || !couponCode.trim()}
                  className="bg-primary text-on-primary font-label-lg text-label-sm px-4 rounded-lg hover:shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              )}
            </form>

            {/* Bill Summary */}
            <div className="space-y-2 text-label-sm text-on-surface-variant font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-on-surface">₹{subtotal.toFixed(2)}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-secondary">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-₹{appliedCoupon.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span className="text-on-surface">
                  {deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : 'FREE'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="text-on-surface">₹{gst.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-headline-sm text-on-surface font-bold border-t border-outline-variant/20 pt-2 text-base">
                <span>Total Pay</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Trigger Button */}
            <button 
              onClick={handleCheckout}
              className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-label-lg rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer font-semibold uppercase tracking-wider"
            >
              Proceed to Checkout
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
