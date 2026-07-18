import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { MapPin, CheckCircle2, LogOut, Package, Navigation2 } from 'lucide-react';

export default function DeliveryDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  };

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
    let intervalId = null;

    if (activeOrder) {
      const backendUrl = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') : 'http://localhost:5000';
      socketRef.current = io(backendUrl, { withCredentials: true });

      const emitLocation = (lat, lng) => {
        if (socketRef.current) {
          socketRef.current.emit('updateDeliveryLocation', {
            orderId: activeOrder._id,
            lat,
            lng
          });
        }
      };

      const startFallback = () => {
        if (intervalId) return; // already started
        toast.error('GPS taking too long. Using simulated location...', { icon: '📡', id: 'gps-fallback' });
        let mockLat = 19.0760;
        let mockLng = 72.8777;
        intervalId = setInterval(() => {
          mockLat += 0.0001;
          mockLng += 0.0001;
          emitLocation(mockLat, mockLng);
        }, 3000);
      };

      const stopFallback = () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
          toast.success('Live GPS signal restored!', { id: 'gps-restored' });
        }
      };

      if (navigator.geolocation) {
        let hasLocation = false;

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            hasLocation = true;
            stopFallback();
            emitLocation(pos.coords.latitude, pos.coords.longitude);
          },
          (err) => {
            console.warn("GPS error:", err);
            startFallback();
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );

        // Fail-safe: if GPS takes more than 8 seconds, start fallback.
        // But if GPS kicks in later, stopFallback() will cancel this simulation.
        setTimeout(() => {
          if (!hasLocation) {
            startFallback();
          }
        }, 8000);

        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            hasLocation = true;
            stopFallback(); // If we get a real update, immediately kill the dummy simulator
            emitLocation(pos.coords.latitude, pos.coords.longitude);
          },
          (err) => {
            console.warn("Watch GPS error:", err);
            if (!hasLocation) startFallback();
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
        );
      } else {
        startFallback();
      }
    }

    return () => {
      if (watchId && navigator.geolocation) navigator.geolocation.clearWatch(watchId);
      if (intervalId) clearInterval(intervalId);
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
    // Add a confirmation dialog to prevent accidental "phantom double clicks" on touch screens
    // where tapping "Accept" might instantly tap "Deliver" when the UI swaps underneath the finger.
    if (!window.confirm('Confirm Delivery: Are you sure you have handed over the food to the customer?')) return;
    
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors flex flex-col">
      {/* Standalone Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-gray-900 dark:text-white leading-tight">DeliveryApp</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{user?.name}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 overflow-y-auto">
        {activeOrder ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-amber-500 text-white rounded-t-3xl p-6 pb-12 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 text-amber-400/30">
                <Navigation2 className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-4">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  LIVE TRACKING ON
                </div>
                <h2 className="text-3xl font-black mb-1">Active Delivery</h2>
                <p className="text-amber-100 font-medium text-sm">Please deliver this order to the customer</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800 -mt-8 relative z-10 mx-2">
              <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <p className="text-xs font-mono text-gray-400 mb-1">ORDER #{activeOrder._id.slice(-8).toUpperCase()}</p>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{activeOrder.user?.name}</p>
                  <a href={`tel:${activeOrder.user?.phone}`} className="text-sm font-semibold text-amber-500 flex items-center gap-1 mt-0.5">
                    📞 {activeOrder.user?.phone}
                  </a>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-xl text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5">To Collect</p>
                  <p className="font-black text-lg">₹{activeOrder.totalAmount}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-gray-100 dark:bg-gray-800 p-2 rounded-full text-gray-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Drop Location</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                      {activeOrder.deliveryAddress.formattedAddress}
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleMarkDelivered}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg"
              >
                <CheckCircle2 className="w-6 h-6" />
                Mark as Delivered
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 px-1">Orders Ready for Pickup</h2>
            
            {availableOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">😴</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">No orders available</h3>
                <p className="text-gray-500 text-sm mt-1 mb-6">Take a break, we'll refresh automatically.</p>
                <button 
                  onClick={fetchDashboardData} 
                  className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold px-6 py-2 rounded-full text-sm hover:bg-amber-200 transition-colors"
                >
                  Refresh Now
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {availableOrders.map(order => (
                  <div key={order._id} className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                            Ready
                          </span>
                          <span className="text-xs font-mono text-gray-400">#{order._id.slice(-8).toUpperCase()}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 pr-4">
                          {order.deliveryAddress.formattedAddress}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-black text-lg text-gray-900 dark:text-white">₹{order.totalAmount}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{order.items.length} items</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleAcceptOrder(order._id)}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-3.5 rounded-2xl transition-transform active:scale-[0.98] shadow-md shadow-amber-500/20"
                    >
                      Accept & Start Delivery
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
