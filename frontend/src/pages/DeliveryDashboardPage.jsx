import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { MapPin, CheckCircle2 } from 'lucide-react';

export default function DeliveryDashboardPage() {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  const fetchDashboardData = async () => {
    try {
      const [availableRes, activeRes] = await Promise.all([
        api.get('/delivery/orders/available'),
        api.get('/delivery/orders/active')
      ]);
      setAvailableOrders(availableRes.data.orders);
      setActiveOrder(activeRes.data.order);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Location streaming logic when there is an active order
  useEffect(() => {
    let watchId;

    if (activeOrder) {
      const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
      socketRef.current = io(backendUrl, { withCredentials: true });

      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            socketRef.current.emit('updateDeliveryLocation', {
              orderId: activeOrder._id,
              lat: latitude,
              lng: longitude
            });
          },
          (error) => console.error("Error getting location:", error),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [activeOrder]);

  const handleAcceptOrder = async (orderId) => {
    try {
      const res = await api.post(`/delivery/orders/${orderId}/accept`);
      toast.success('Order accepted! You are now out for delivery.');
      setActiveOrder(res.data.order);
      setAvailableOrders(prev => prev.filter(o => o._id !== orderId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept order');
    }
  };

  const handleMarkDelivered = async () => {
    try {
      await api.post(`/delivery/orders/${activeOrder._id}/deliver`);
      toast.success('Order delivered successfully! 🎉');
      setActiveOrder(null);
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to mark delivered');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Delivery Dashboard</h1>

      {activeOrder ? (
        <div className="bg-amber-50 dark:bg-amber-900/10 rounded-3xl p-6 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Delivery</h2>
              <p className="text-sm text-gray-500">You are currently delivering this order</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-mono text-gray-400">#{activeOrder._id.slice(-8).toUpperCase()}</p>
                <p className="font-bold text-gray-900 dark:text-white mt-1">{activeOrder.user?.name}</p>
                <p className="text-sm text-gray-500">{activeOrder.user?.phone}</p>
              </div>
              <p className="font-black text-xl text-amber-600">₹{activeOrder.totalAmount}</p>
            </div>
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Delivery Address</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{activeOrder.deliveryAddress.formattedAddress}</p>
            </div>
          </div>

          <button 
            onClick={handleMarkDelivered}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <CheckCircle2 className="w-5 h-5" />
            Mark as Delivered
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Available Orders for Pickup</h2>
          
          {availableOrders.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
              <span className="text-5xl">😴</span>
              <p className="mt-4 text-gray-500 font-medium">No orders available right now.</p>
              <button onClick={fetchDashboardData} className="mt-4 text-amber-500 font-bold hover:underline">Refresh</button>
            </div>
          ) : (
            <div className="grid gap-4">
              {availableOrders.map(order => (
                <div key={order._id} className="bg-white dark:bg-gray-900 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-mono text-gray-400">#{order._id.slice(-8).toUpperCase()}</p>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">{order.status}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{order.deliveryAddress.formattedAddress}</p>
                    <p className="text-xs text-gray-500">{order.items.length} items • ₹{order.totalAmount}</p>
                  </div>
                  <button 
                    onClick={() => handleAcceptOrder(order._id)}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap"
                  >
                    Accept Order
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
