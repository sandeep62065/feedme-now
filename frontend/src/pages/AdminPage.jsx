import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  placed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  preparing: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  out_for_delivery: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  delivered: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

// ── Menu Management ───────────────────────────────────────────────────────────

function MenuManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', image: '', isVeg: false, isAvailable: true, tags: '' });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = () => {
    api.get('/menu?all=1').then(({ data }) => setItems(data.items)).finally(() => setLoading(false));
  };
  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', category: '', image: '', isVeg: false, isAvailable: true, tags: '' });
    setEditId(null);
  };

  const handleEdit = (item) => {
    setForm({ ...item, price: String(item.price), tags: item.tags?.join(', ') || '' });
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await api.delete(`/menu/${id}`);
      toast.success('Item deleted');
      fetchItems();
    } catch { toast.error('Failed to delete'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };
    try {
      if (editId) {
        await api.put(`/menu/${editId}`, payload);
        toast.success('Item updated');
      } else {
        await api.post('/menu', payload);
        toast.success('Item created');
      }
      resetForm();
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">{editId ? 'Edit Item' : 'Add Menu Item'}</h2>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[['name', 'Name *'], ['category', 'Category *'], ['price', 'Price (₹) *'], ['image', 'Image URL']].map(([key, label]) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">{label}</label>
            <input
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required={label.includes('*')}
              type={key === 'price' ? 'number' : 'text'}
              min={key === 'price' ? 0 : undefined}
              step={key === 'price' ? '0.01' : undefined}
              className="h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-500/50"
            />
          </div>
        ))}
        <div className="sm:col-span-2 flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-500/50 resize-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Tags (comma-separated)</label>
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="bestseller, spicy" className="h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-500/50" />
        </div>
        <div className="flex items-center gap-6 pt-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 dark:text-gray-300">
            <input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} className="accent-green-500" />
            Vegetarian
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 dark:text-gray-300">
            <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="accent-amber-500" />
            Available
          </label>
        </div>
        <div className="sm:col-span-2 flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors disabled:opacity-60">
            {saving ? 'Saving…' : editId ? 'Update Item' : 'Add Item'}
          </button>
          {editId && <button type="button" onClick={resetForm} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-semibold">Cancel</button>}
        </div>
      </form>

      <h2 className="text-xl font-black text-gray-900 dark:text-white mb-3">Menu Items ({items.length})</h2>
      {loading ? <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" /> : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item._id} className={`bg-white dark:bg-gray-900 rounded-xl border p-4 flex items-center gap-4 ${!item.isAvailable ? 'opacity-60' : 'border-gray-100 dark:border-gray-800'}`}>
              {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-gray-800 shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.category} · ₹{item.price} · {item.isVeg ? '🟢 Veg' : '🔴 Non-veg'} · {item.isAvailable ? 'Available' : 'Unavailable'}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleEdit(item)} className="text-xs font-bold text-amber-600 hover:text-amber-700 px-3 py-1 rounded-lg border border-amber-200 dark:border-amber-900/50 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="text-xs font-bold text-red-500 hover:text-red-700 px-3 py-1 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Order Management ──────────────────────────────────────────────────────────

function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    api.get('/orders/all').then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  };
  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      toast.success('Status updated');
      fetchOrders();
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <div>
      <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">All Orders ({orders.length})</h2>
      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-gray-400">#{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{order.user?.name} — ₹{order.totalAmount.toFixed(0)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(order.createdAt).toLocaleString()} · {order.items.length} item(s)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">📍 {order.deliveryAddress.formattedAddress}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AdminPage ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [tab, setTab] = useState('menu');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🛡️</span>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Admin Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[['menu', '🍔 Menu Items'], ['orders', '📦 Orders']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === key ? 'bg-amber-500 text-white shadow-md' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'menu' ? <MenuManager /> : <OrderManager />}
      </div>
    </div>
  );
}
