import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { placeOrder } from '../../store/slices/ordersSlice';
import { addAddress } from '../../store/slices/authSlice';
import { fetchCart } from '../../store/slices/cartSlice';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { items, subtotal, deliveryFee, gst, total, appliedCoupon } = useSelector((state) => state.cart);
  const { loading: orderLoading } = useSelector((state) => state.orders);

  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD', 'Card'
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Set default selected address
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setSelectedAddressId(defaultAddr._id);
    } else {
      setIsAddingAddress(true);
    }
  }, [user]);

  // Redirect if cart is empty
  if (items.length === 0 && !orderLoading) {
    return (
      <div className="w-full max-w-md mx-auto pt-32 pb-16 text-center space-y-4">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">shopping_cart</span>
        <h3 className="font-headline-sm text-on-surface">Your Cart is Empty</h3>
        <p className="text-body-md text-on-surface-variant/60">Add items to your cart before checking out.</p>
        <button onClick={() => navigate('/')} className="bg-primary text-on-primary font-label-lg px-6 py-2 rounded-lg cursor-pointer">
          Go Back Home
        </button>
      </div>
    );
  }

  const handleAddNewAddress = async (data) => {
    try {
      const resultAction = await dispatch(addAddress({
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        isDefault: data.isDefault || false
      }));

      if (addAddress.fulfilled.match(resultAction)) {
        toast.success('Address added successfully!');
        setIsAddingAddress(false);
        reset();
      } else {
        toast.error(resultAction.payload || 'Failed to add address');
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }

    const selectedAddrObj = user.addresses.find(a => a._id === selectedAddressId);
    if (!selectedAddrObj) {
      toast.error('Selected address is invalid');
      return;
    }

    const orderData = {
      deliveryAddress: {
        street: selectedAddrObj.street,
        city: selectedAddrObj.city,
        state: selectedAddrObj.state,
        zipCode: selectedAddrObj.zipCode
      },
      paymentMethod,
      couponCode: appliedCoupon ? appliedCoupon.code : null
    };

    try {
      const resultAction = await dispatch(placeOrder(orderData));
      if (placeOrder.fulfilled.match(resultAction)) {
        const placedOrder = resultAction.payload;
        toast.success('Order placed successfully!');
        navigate(`/order-confirmed/${placedOrder._id}`);
      } else {
        toast.error(resultAction.payload || 'Failed to place order');
      }
    } catch (err) {
      toast.error('Failed to process order');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-margin-mobile pt-32 pb-16 animate-in fade-in duration-300">
      <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-6 border-b border-outline-variant/10 pb-2">
        Secure Checkout
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Address & Payments */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Address Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3">
              <h3 className="font-headline-sm text-label-lg font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                Delivery Address
              </h3>
              {user?.addresses && user.addresses.length > 0 && (
                <button 
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="text-primary font-semibold text-xs hover:underline cursor-pointer"
                >
                  {isAddingAddress ? 'Cancel' : '+ Add Address'}
                </button>
              )}
            </div>

            {/* Address Selection List */}
            {!isAddingAddress && user?.addresses && user.addresses.length > 0 && (
              <div className="space-y-3">
                {user.addresses.map((addr) => (
                  <div 
                    key={addr._id}
                    onClick={() => setSelectedAddressId(addr._id)}
                    className={`p-3 rounded-lg border-2 text-left text-sm cursor-pointer transition-all ${
                      selectedAddressId === addr._id 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-outline-variant/30 hover:border-outline-variant/60'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-on-surface">
                        Address {addr.isDefault && <span className="text-[10px] bg-secondary/10 text-secondary font-bold px-1.5 py-0.5 rounded ml-1.5 uppercase">Default</span>}
                      </span>
                      {selectedAddressId === addr._id && (
                        <span className="material-symbols-outlined text-primary text-base font-bold">check_circle</span>
                      )}
                    </div>
                    <p className="text-on-surface-variant">{addr.street}</p>
                    <p className="text-on-surface-variant">{addr.city}, {addr.state} - {addr.zipCode}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Address Form */}
            {isAddingAddress && (
              <form onSubmit={handleSubmit(handleAddNewAddress)} className="space-y-3 p-3 bg-surface-container-low rounded-lg animate-in fade-in duration-150">
                <h4 className="font-semibold text-sm text-on-surface mb-2">New Address Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-xs font-semibold text-on-surface-variant">Street address</label>
                    <input 
                      {...register('street', { required: 'Street is required' })}
                      type="text" 
                      placeholder="Flat, House no., Apartment, Street"
                      className="h-9 px-3 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                    />
                    {errors.street && <span className="text-error text-[10px] font-semibold">{errors.street.message}</span>}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-on-surface-variant">City</label>
                    <input 
                      {...register('city', { required: 'City is required' })}
                      type="text" 
                      placeholder="e.g. Mumbai"
                      className="h-9 px-3 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                    />
                    {errors.city && <span className="text-error text-[10px] font-semibold">{errors.city.message}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-on-surface-variant">State</label>
                    <input 
                      {...register('state', { required: 'State is required' })}
                      type="text" 
                      placeholder="e.g. MH"
                      className="h-9 px-3 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                    />
                    {errors.state && <span className="text-error text-[10px] font-semibold">{errors.state.message}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-on-surface-variant">Postal code (Zip)</label>
                    <input 
                      {...register('zipCode', { required: 'Postal code is required' })}
                      type="text" 
                      placeholder="e.g. 400001"
                      className="h-9 px-3 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                    />
                    {errors.zipCode && <span className="text-error text-[10px] font-semibold">{errors.zipCode.message}</span>}
                  </div>

                  <div className="flex items-center gap-1.5 md:col-span-2 pt-1.5">
                    <input 
                      {...register('isDefault')}
                      type="checkbox" 
                      id="isDefault"
                      className="rounded text-primary border-outline-variant/50"
                    />
                    <label htmlFor="isDefault" className="text-xs font-semibold text-on-surface-variant cursor-pointer">
                      Mark as default delivery address
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-outline-variant/10">
                  {user?.addresses && user.addresses.length > 0 && (
                    <button 
                      type="button" 
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-1.5 border border-outline-variant/50 hover:bg-surface-container rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="px-4 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:shadow-sm cursor-pointer"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Section 2: Payment Choices */}
          <div className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-5 space-y-4">
            <h3 className="font-headline-sm text-label-lg font-bold text-on-surface border-b border-outline-variant/10 pb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-lg">payment</span>
              Choose Payment Method
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Cash On Delivery Option */}
              <div 
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'COD' 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-outline-variant/30 hover:border-outline-variant/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant">local_atm</span>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-on-surface">Cash on Delivery</p>
                    <p className="text-xs text-on-surface-variant/80">Pay with cash when order arrives</p>
                  </div>
                </div>
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-primary' : 'border-outline-variant/60'}`}>
                  {paymentMethod === 'COD' && <div className="h-2 w-2 rounded-full bg-primary" />}
                </div>
              </div>

              {/* Online Payment Card Placeholder */}
              <div 
                onClick={() => {
                  setPaymentMethod('Card');
                  toast.success('Selected Credit/Debit Card via Online gateway placeholder.');
                }}
                className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'Card' 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-outline-variant/30 hover:border-outline-variant/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant">credit_card</span>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-on-surface">Online Card Payment</p>
                    <p className="text-xs text-on-surface-variant/80">Mock Stripe / Razorpay gateway</p>
                  </div>
                </div>
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Card' ? 'border-primary' : 'border-outline-variant/60'}`}>
                  {paymentMethod === 'Card' && <div className="h-2 w-2 rounded-full bg-primary" />}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Bill Summary Receipt */}
        <div className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-5 h-fit flex flex-col space-y-4 self-start">
          <h3 className="font-headline-sm text-label-lg font-bold text-on-surface border-b border-outline-variant/10 pb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-lg">receipt_long</span>
            Order Summary
          </h3>

          {/* List items snapshot */}
          <div className="divide-y divide-outline-variant/10 max-h-56 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.food._id} className="py-2.5 flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded border border-outline-variant/20 flex items-center justify-center text-[10px] shrink-0 text-center font-bold text-on-surface-variant">
                    {item.quantity}x
                  </span>
                  <span className="font-medium text-on-surface line-clamp-1">{item.food.name}</span>
                </div>
                <span className="font-semibold text-on-surface-variant shrink-0">
                  ₹{(item.food.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Applied Coupon Info if any */}
          {appliedCoupon && (
            <div className="p-3 bg-secondary-container/10 border border-secondary-container rounded-lg flex items-center justify-between text-xs text-secondary">
              <span className="font-bold">PROMO: {appliedCoupon.code}</span>
              <span className="font-semibold">-₹{appliedCoupon.discountAmount.toFixed(2)}</span>
            </div>
          )}

          {/* Pricing Breakdowns */}
          <div className="space-y-2 text-xs font-semibold text-on-surface-variant pt-2 border-t border-outline-variant/15">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            
            {appliedCoupon && (
              <div className="flex justify-between text-secondary">
                <span>Coupon discount</span>
                <span>-₹{appliedCoupon.discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Delivery partner charges</span>
              <span>{deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : 'FREE'}</span>
            </div>

            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-headline-sm text-sm font-extrabold text-on-surface pt-2 border-t border-outline-variant/10">
              <span>Grand Total</span>
              <span className="text-primary text-base">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Submit Trigger */}
          <button 
            onClick={handlePlaceOrder}
            disabled={orderLoading || isAddingAddress}
            className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-label-lg rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer font-bold uppercase disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {orderLoading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                Confirm & Place Order
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
