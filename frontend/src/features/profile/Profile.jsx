import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { logoutUser, addAddress, deleteAddress } from '../../store/slices/authSlice';
import { fetchMyOrders } from '../../store/slices/ordersSlice';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);
  const { orders, loading: ordersLoading } = useSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'addresses'
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    dispatch(fetchMyOrders());
  }, [dispatch, isAuthenticated, navigate]);

  if (authLoading || !user) {
    return (
      <div className="w-full max-w-xl mx-auto px-margin-mobile pt-32 pb-16 space-y-6">
        <LoadingSkeleton type="list" count={4} />
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      const resultAction = await dispatch(logoutUser());
      if (logoutUser.fulfilled.match(resultAction)) {
        toast.success('Logged out successfully');
        navigate('/');
      }
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const handleAddAddress = async (data) => {
    try {
      const resultAction = await dispatch(addAddress({
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        isDefault: data.isDefault || false
      }));

      if (addAddress.fulfilled.match(resultAction)) {
        toast.success('New delivery address saved!');
        setIsAddingAddress(false);
        reset();
      } else {
        toast.error(resultAction.payload || 'Failed to add address');
      }
    } catch (err) {
      toast.error('Address creation failed');
    }
  };

  const handleDeleteAddress = (id) => {
    dispatch(deleteAddress(id));
    toast.success('Address removed');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-margin-mobile pt-32 pb-16 animate-in fade-in duration-300 grid grid-cols-1 md:grid-cols-4 gap-8">
      
      {/* User Information Panel (Sidebar) */}
      <section className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-5 flex flex-col items-center text-center h-fit md:col-span-1 space-y-4">
        <div className="w-16 h-16 bg-primary-container/20 text-primary border border-primary-container rounded-full flex items-center justify-center font-extrabold text-2xl uppercase">
          {user.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-headline-sm text-sm font-bold text-on-surface line-clamp-1">{user.name}</h3>
          <p className="text-xs text-on-surface-variant line-clamp-1">{user.email}</p>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary capitalize">
            {user.role}
          </span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full py-2 bg-error/10 hover:bg-error/20 text-error text-xs font-bold rounded-lg transition-colors cursor-pointer"
        >
          Logout Account
        </button>
      </section>

      {/* Main Account Tabs Content Panel */}
      <section className="md:col-span-3 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-outline-variant/20 gap-4">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-2.5 text-sm font-bold relative active:scale-95 transition-all cursor-pointer ${
              activeTab === 'orders' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant'
            }`}
          >
            My Orders
          </button>
          <button 
            onClick={() => setActiveTab('addresses')}
            className={`pb-2.5 text-sm font-bold relative active:scale-95 transition-all cursor-pointer ${
              activeTab === 'addresses' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant'
            }`}
          >
            Addresses
          </button>
        </div>

        {/* Tab 1: Orders History List */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {ordersLoading ? (
              <LoadingSkeleton type="menu" count={3} />
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <div 
                  key={order._id} 
                  className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200"
                >
                  <div className="flex gap-3">
                    {/* Restaurant Logo */}
                    <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-outline-variant/10">
                      <img 
                        src={order.restaurant?.image} 
                        alt={order.restaurant?.name || 'Chef'} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-on-surface line-clamp-1">{order.restaurant?.name}</h4>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-on-surface-variant font-medium mt-1 leading-normal">
                        {order.items.map((i) => `${i.nameAtOrder} (${i.quantity})`).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-outline-variant/10 pt-3 md:pt-0 gap-2 shrink-0">
                    <div className="text-left md:text-right">
                      <p className="font-bold text-sm text-primary">₹{order.total.toFixed(2)}</p>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase mt-1 ${
                        order.orderStatus === 'Delivered' 
                          ? 'bg-secondary/15 text-secondary' 
                          : order.orderStatus === 'Cancelled' 
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-primary-container/10 text-primary-container'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <button 
                      onClick={() => navigate(`/order-confirmed/${order._id}`)}
                      className="px-3.5 py-1.5 bg-primary text-on-primary hover:bg-primary-container font-label-lg text-xs rounded-lg active:scale-95 transition-all shadow-sm cursor-pointer"
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-on-surface-variant space-y-2">
                <span className="material-symbols-outlined text-5xl">history</span>
                <p className="font-semibold text-sm">No orders placed yet.</p>
                <button onClick={() => navigate('/')} className="text-primary hover:underline text-xs font-semibold">Start your first order</button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Addresses List Management */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            
            {/* Show Add Address Trigger Button */}
            {!isAddingAddress && (
              <button 
                onClick={() => setIsAddingAddress(true)}
                className="w-full py-3 border-2 border-dashed border-outline-variant/40 rounded-xl hover:border-primary text-primary font-semibold text-sm flex items-center justify-center gap-1 cursor-pointer active:scale-[0.99] transition-transform"
              >
                <span className="material-symbols-outlined text-base">add</span>
                Add New Delivery Location
              </button>
            )}

            {/* Address Edit Form */}
            {isAddingAddress && (
              <form onSubmit={handleSubmit(handleAddAddress)} className="bg-white border border-outline-variant/15 p-4 rounded-xl space-y-4 animate-in fade-in duration-150">
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="font-bold text-sm text-on-surface">New Address Book Details</h4>
                  <button type="button" onClick={() => setIsAddingAddress(false)} className="text-on-surface-variant hover:text-primary p-0.5">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-xs font-semibold text-on-surface-variant">Street address</label>
                    <input 
                      {...register('street', { required: 'Street is required' })}
                      type="text" 
                      placeholder="e.g. 123 Maple St"
                      className="h-9 px-3 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                    />
                    {errors.street && <span className="text-error text-[10px] font-semibold">{errors.street.message}</span>}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-on-surface-variant">City</label>
                    <input 
                      {...register('city', { required: 'City is required' })}
                      type="text" 
                      placeholder="e.g. New York"
                      className="h-9 px-3 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                    />
                    {errors.city && <span className="text-error text-[10px] font-semibold">{errors.city.message}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-on-surface-variant">State</label>
                    <input 
                      {...register('state', { required: 'State is required' })}
                      type="text" 
                      placeholder="e.g. NY"
                      className="h-9 px-3 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                    />
                    {errors.state && <span className="text-error text-[10px] font-semibold">{errors.state.message}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-on-surface-variant">Zip Code</label>
                    <input 
                      {...register('zipCode', { required: 'Postal code is required' })}
                      type="text" 
                      placeholder="e.g. 10001"
                      className="h-9 px-3 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                    />
                    {errors.zipCode && <span className="text-error text-[10px] font-semibold">{errors.zipCode.message}</span>}
                  </div>

                  <div className="flex items-center gap-1.5 md:col-span-2 pt-1">
                    <input 
                      {...register('isDefault')}
                      type="checkbox" 
                      id="isDefaultProfile"
                      className="rounded text-primary border-outline-variant/50"
                    />
                    <label htmlFor="isDefaultProfile" className="text-xs font-semibold text-on-surface-variant cursor-pointer">
                      Mark as default delivery address
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 justify-end border-t border-outline-variant/10 pt-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAddingAddress(false)}
                    className="px-4 py-1.5 border border-outline-variant/50 hover:bg-surface-container rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:shadow-sm cursor-pointer"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* List saved addresses */}
            {user.addresses && user.addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div 
                    key={addr._id} 
                    className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-4 flex justify-between items-start"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="font-bold text-sm text-on-surface">Saved Location</span>
                        {addr.isDefault && (
                          <span className="text-[9px] bg-secondary/15 text-secondary font-bold px-2 py-0.5 rounded uppercase">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant">{addr.street}</p>
                      <p className="text-xs text-on-surface-variant">{addr.city}, {addr.state} - {addr.zipCode}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteAddress(addr._id)}
                      className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-full hover:bg-error/5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              !isAddingAddress && (
                <div className="py-8 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl">location_off</span>
                  <p className="text-xs font-semibold mt-1">No addresses saved. Add one to checkout quicker.</p>
                </div>
              )
            )}

          </div>
        )}

      </section>

    </div>
  );
}
