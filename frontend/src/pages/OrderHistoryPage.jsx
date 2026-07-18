import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { io } from 'socket.io-client';
import confetti from 'canvas-confetti';
import OrderTracker from '../components/OrderTracker';
import DeliveryMap from '../components/DeliveryMap';
import { Phone } from 'lucide-react';

const STATUS_STEPS = ['placed', 'preparing', 'out_for_delivery', 'delivered'];
const STATUS_LABELS = {
  placed: 'Order Placed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};
const STATUS_EMOJI = { placed: '✅', preparing: '👨‍🍳', out_for_delivery: '🛵', delivered: '🎉', cancelled: '❌' };

function StatusBadge({ status }) {
  const colors = {
    placed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-yellow-100 text-yellow-700',
    out_for_delivery: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${colors[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>
      {STATUS_EMOJI[status]} {STATUS_LABELS[status] || status}
    </span>
  );
}

function OrderCard({ order }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-400 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
          <p className="text-xs text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-1 mb-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
            <span>{item.name} × {item.quantity}</span>
            <span className="font-semibold">₹{(item.price * item.quantity).toFixed(0)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 truncate max-w-[200px]">📍 {order.deliveryAddress.formattedAddress}</p>
        </div>
        <p className="font-black text-gray-900 dark:text-white">₹{order.totalAmount.toFixed(0)}</p>
      </div>
    </div>
  );
}

// ── Single order detail view (when :id in URL) ──────────────────────────────

function OrderDetailView({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial order data
    api.get(`/orders/${orderId}`)
      .then(({ data }) => setOrder(data.order))
      .finally(() => setLoading(false));

    // Initialize socket connection
    const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    const socket = io(backendUrl, { withCredentials: true });

    socket.emit('joinOrderRoom', orderId);

    socket.on('orderStatusUpdated', (updatedOrder) => {
      setOrder(prev => ({ ...prev, ...updatedOrder }));
      if (updatedOrder.status === 'delivered') {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    });

    return () => socket.disconnect();
  }, [orderId]);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!order) return <p className="text-center py-16 text-gray-500">Order not found.</p>;

  const stepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/orders" className="text-amber-600 text-sm font-semibold hover:underline flex items-center gap-1 mb-6">
        ← Back to orders
      </Link>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-black text-gray-900 dark:text-white text-xl">Order Details</h2>
            <p className="text-xs font-mono text-gray-400 mt-0.5">#{order._id.slice(-8).toUpperCase()}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Progress Tracker */}
        <OrderTracker currentStatus={order.status} />

        {/* ETA & Delivery Info */}
        {order.status === 'out_for_delivery' && (
          <div className="mb-6 space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-800 flex justify-between items-center">
              <div>
                <p className="text-xs text-amber-700 dark:text-amber-500 font-bold uppercase tracking-wider">Estimated Arrival</p>
                <p className="text-xl font-black text-amber-900 dark:text-amber-400">
                  {order.eta ? new Date(order.eta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Soon'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Delivery Partner</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{order.deliveryPartner?.name || 'Assigned Soon'}</p>
              </div>
            </div>

            {order.deliveryPartner && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xl">
                    🛵
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{order.deliveryPartner.name}</p>
                    <p className="text-xs text-gray-500">{order.deliveryPartner.vehicle}</p>
                  </div>
                </div>
                <a 
                  href={`tel:${order.deliveryPartner.phone}`}
                  className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            )}

            <DeliveryMap 
              partnerLocation={order.deliveryPartner?.location} 
              deliveryAddress={order.deliveryAddress} 
            />
          </div>
        )}

        {/* Items */}
        <div className="space-y-2 mb-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-800" />}
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</p>
                <p className="text-xs text-gray-500">× {item.quantity} @ ₹{item.price}</p>
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">₹{(item.price * item.quantity).toFixed(0)}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-1">
          <div className="flex justify-between font-black text-gray-900 dark:text-white">
            <span>Total Paid</span><span>₹{order.totalAmount.toFixed(0)}</span>
          </div>
          <p className="text-xs text-gray-500 pt-1">📍 {order.deliveryAddress.formattedAddress}</p>
          {order.notes && <p className="text-xs text-gray-500">📝 {order.notes}</p>}
        </div>
      </div>
    </div>
  );
}

// ── Order history list ────────────────────────────────────────────────────────

export default function OrderHistoryPage() {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      api.get('/orders')
        .then(({ data }) => setOrders(data.orders))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (id) return <OrderDetailView orderId={id} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-36 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">📋</span>
            <h3 className="font-bold text-gray-700 dark:text-gray-300 text-lg">No orders yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-6">Place your first order and it will appear here</p>
            <Link to="/menu" className="bg-amber-500 text-white font-bold px-6 py-3 rounded-2xl hover:bg-amber-600 transition-colors">
              Order Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order._id} to={`/orders/${order._id}`} className="block hover:scale-[1.01] transition-transform">
                <OrderCard order={order} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
