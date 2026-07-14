import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderDetails } from '../../store/slices/ordersSlice';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function OrderTracking() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  // Status simulation: For demo purposes, we automatically simulate state changes
  // to show off the dynamic status timeline!
  useEffect(() => {
    if (!currentOrder || currentOrder.orderStatus === 'Delivered' || currentOrder.orderStatus === 'Cancelled') return;

    const timer = setInterval(() => {
      // Typically, we would poll the backend or use Socket.io.
      // We will fetch updated order status from the DB to see if the admin updated it,
      // which acts as a robust fallback.
      dispatch(fetchOrderDetails(id));
    }, 8000); // Poll database every 8s

    return () => clearInterval(timer);
  }, [dispatch, id, currentOrder]);

  if (loading && !currentOrder) {
    return (
      <div className="w-full max-w-xl mx-auto px-margin-mobile pt-32 pb-16 space-y-6">
        <LoadingSkeleton type="list" count={4} />
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="w-full max-w-md mx-auto pt-32 pb-16 text-center space-y-4">
        <span className="material-symbols-outlined text-5xl text-error">warning</span>
        <h3 className="font-headline-sm text-on-surface">Order Not Found</h3>
        <p className="text-body-md text-on-surface-variant/60">Could not retrieve order details.</p>
        <Link to="/profile" className="inline-block bg-primary text-on-primary font-label-lg px-6 py-2 rounded-lg">
          View Order History
        </Link>
      </div>
    );
  }

  // Get index of the current status for progress bar
  const statuses = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentStatusIndex = statuses.indexOf(currentOrder.orderStatus);

  const getStepStatus = (index) => {
    if (currentOrder.orderStatus === 'Cancelled') return 'cancelled';
    if (index < currentStatusIndex) return 'completed';
    if (index === currentStatusIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full max-w-xl mx-auto px-margin-mobile pt-32 pb-16 animate-in fade-in duration-300 space-y-6">
      
      {/* Header Banner */}
      <section className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-5 text-center space-y-3 relative overflow-hidden">
        {/* Success badge */}
        <div className="mx-auto w-12 h-12 bg-secondary-container/20 text-secondary rounded-full flex items-center justify-center border border-secondary-container/40">
          <span className="material-symbols-outlined text-2xl font-bold animate-bounce">check</span>
        </div>
        <div>
          <h2 className="font-headline-md text-xl font-extrabold text-on-surface">
            {currentOrder.orderStatus === 'Delivered' ? 'Order Delivered!' : 'Tracking Your Order'}
          </h2>
          <p className="text-xs text-on-surface-variant">Order ID: #{currentOrder._id}</p>
        </div>

        <div className="border-t border-outline-variant/10 pt-3 flex justify-around text-label-sm text-on-surface-variant">
          <div>
            <p className="font-semibold text-on-surface-variant/60 uppercase text-[9px] tracking-wider">Estimated Time</p>
            <p className="text-sm font-bold text-on-surface">
              {currentOrder.orderStatus === 'Delivered' ? 'Arrived' : currentOrder.restaurant?.deliveryTime || '25-35 mins'}
            </p>
          </div>
          <div className="w-px bg-outline-variant/20 h-8" />
          <div>
            <p className="font-semibold text-on-surface-variant/60 uppercase text-[9px] tracking-wider">Restaurant</p>
            <p className="text-sm font-bold text-on-surface line-clamp-1">{currentOrder.restaurant?.name}</p>
          </div>
        </div>
      </section>

      {/* Progress Tracker Timeline */}
      <section className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-5 space-y-6">
        <h3 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-1">
          <span className="material-symbols-outlined text-primary text-base">delivery_dining</span>
          Live Delivery Status
        </h3>

        {currentOrder.orderStatus === 'Cancelled' ? (
          <div className="p-4 bg-error-container text-on-error-container rounded-lg flex items-center gap-2 text-sm font-medium">
            <span className="material-symbols-outlined">cancel</span>
            This order has been cancelled.
          </div>
        ) : (
          <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container-high">
            {statuses.map((status, index) => {
              const stepStatus = getStepStatus(index);
              return (
                <div key={status} className="relative flex justify-between items-start text-sm">
                  {/* Circle Indicator */}
                  <div className={`absolute -left-[27px] top-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all ${
                    stepStatus === 'completed' 
                      ? 'border-secondary bg-secondary text-white' 
                      : stepStatus === 'active' 
                      ? 'border-primary bg-white text-primary ring-4 ring-primary/10'
                      : 'border-outline-variant/40 bg-white'
                  }`}>
                    {stepStatus === 'completed' && (
                      <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                    )}
                    {stepStatus === 'active' && (
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                    )}
                  </div>

                  {/* Status label details */}
                  <div className="text-left">
                    <p className={`font-bold ${
                      stepStatus === 'completed' 
                        ? 'text-secondary' 
                        : stepStatus === 'active' 
                        ? 'text-primary font-extrabold' 
                        : 'text-on-surface-variant/60'
                    }`}>
                      {status === 'Placed' && 'Order Placed'}
                      {status === 'Preparing' && 'Preparing in Kitchen'}
                      {status === 'Out for Delivery' && 'Out for Delivery'}
                      {status === 'Delivered' && 'Order Delivered'}
                    </p>
                    <p className="text-xs text-on-surface-variant/80 mt-0.5">
                      {status === 'Placed' && 'The restaurant has accepted your order request.'}
                      {status === 'Preparing' && 'Chef is cooking your fresh ingredients.'}
                      {status === 'Out for Delivery' && 'Our delivery executive is heading to your address.'}
                      {status === 'Delivered' && 'Delicious food delivered at your doorstep.'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bill details list */}
      <section className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-5 space-y-4">
        <h3 className="font-headline-sm text-sm font-bold text-on-surface border-b border-outline-variant/10 pb-2">
          Items Ordered
        </h3>
        <div className="divide-y divide-outline-variant/10 text-sm">
          {currentOrder.items.map((item) => (
            <div key={item._id} className="py-2.5 flex justify-between items-center">
              <div>
                <p className="font-semibold text-on-surface">{item.nameAtOrder}</p>
                <p className="text-xs text-on-surface-variant">Qty: {item.quantity} x ₹{item.priceAtOrder.toFixed(2)}</p>
              </div>
              <span className="font-bold text-on-surface-variant">
                ₹{(item.priceAtOrder * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          
          <div className="pt-3 text-xs font-semibold text-on-surface-variant space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{currentOrder.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery partner Fee</span>
              <span>{currentOrder.deliveryFee > 0 ? `₹${currentOrder.deliveryFee.toFixed(2)}` : 'FREE'}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>₹{currentOrder.gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-headline-sm text-sm font-extrabold text-on-surface pt-2 text-base">
              <span>Total Paid</span>
              <span className="text-primary">₹{currentOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex gap-4">
        <Link 
          to="/" 
          className="flex-1 text-center bg-surface-container border border-outline-variant/20 font-label-lg text-label-sm py-2.5 rounded-lg text-on-surface active:scale-95 transition-transform"
        >
          Order Something Else
        </Link>
        <Link 
          to="/profile" 
          className="flex-1 text-center bg-primary font-label-lg text-label-sm py-2.5 rounded-lg text-on-primary active:scale-95 transition-transform shadow-sm"
        >
          View Order History
        </Link>
      </div>

    </div>
  );
}
