import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'restaurants', 'foods', 'categories', 'stats'
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  
  const [loading, setLoading] = useState(false);

  // Form states for CRUD additions
  const [newRestaurant, setNewRestaurant] = useState({ name: '', description: '', image: '', address: '', cuisineType: '', deliveryTime: '', deliveryFee: 0 });
  const [newCategory, setNewCategory] = useState({ name: '', image: '' });
  const [newFood, setNewFood] = useState({ name: '', description: '', price: 0, image: '', category: '', restaurant: '', isVeg: true });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Access Denied. Admins only.');
      navigate('/');
      return;
    }
    loadAllData();
  }, [isAuthenticated, user, navigate]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [ordersRes, restRes, foodRes, catRes, statsRes] = await Promise.all([
        api.get('/admin/orders'),
        api.get('/restaurants'),
        api.get('/foods'),
        api.get('/categories'),
        api.get('/admin/stats')
      ]);

      setOrders(ordersRes.data.orders);
      setRestaurants(restRes.data.restaurants);
      setFoods(foodRes.data.foods);
      setCategories(catRes.data.categories);
      setStats(statsRes.data.stats);
    } catch (err) {
      toast.error('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/admin/orders/${orderId}/status`, { orderStatus: newStatus });
      if (res.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders(orders.map(order => order._id === orderId ? { ...order, orderStatus: newStatus } : order));
        // Reload stats to reflect revenue changes if delivered
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      const cuisines = newRestaurant.cuisineType.split(',').map(c => c.trim());
      const res = await api.post('/restaurants', {
        ...newRestaurant,
        cuisineType: cuisines
      });
      if (res.data.success) {
        toast.success('Restaurant created successfully!');
        setRestaurants([...restaurants, res.data.restaurant]);
        setNewRestaurant({ name: '', description: '', image: '', address: '', cuisineType: '', deliveryTime: '', deliveryFee: 0 });
      }
    } catch (err) {
      toast.error('Failed to add restaurant');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/categories', newCategory);
      if (res.data.success) {
        toast.success('Category created successfully!');
        setCategories([...categories, res.data.category]);
        setNewCategory({ name: '', image: '' });
      }
    } catch (err) {
      toast.error('Failed to add category');
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/foods', newFood);
      if (res.data.success) {
        toast.success('Food menu item created successfully!');
        setFoods([...foods, res.data.food]);
        setNewFood({ name: '', description: '', price: 0, image: '', category: '', restaurant: '', isVeg: true });
      }
    } catch (err) {
      toast.error('Failed to add food item');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-margin-mobile pt-32 pb-16 animate-in fade-in duration-300 space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b pb-3 border-outline-variant/10">
        <div>
          <h2 className="font-display text-display-mobile font-bold text-on-surface">Admin Control Room</h2>
          <p className="text-xs text-on-surface-variant">Manage food items, restaurants, categorizations, and check sales.</p>
        </div>
        <button 
          onClick={loadAllData}
          className="p-2 bg-surface-container rounded-full text-on-surface hover:text-primary active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg block">refresh</span>
        </button>
      </div>

      {/* Stats Summary Cards Row */}
      {stats && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
          <div className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-4 text-center">
            <span className="material-symbols-outlined text-primary text-2xl">payments</span>
            <p className="text-xl font-extrabold text-on-surface mt-1">₹{stats.totalRevenue?.toFixed(2)}</p>
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mt-0.5">Total Revenue</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-4 text-center">
            <span className="material-symbols-outlined text-secondary text-2xl">shopping_bag</span>
            <p className="text-xl font-extrabold text-on-surface mt-1">{stats.totalOrders}</p>
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mt-0.5">Orders Placed</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-4 text-center">
            <span className="material-symbols-outlined text-yellow-600 text-2xl">storefront</span>
            <p className="text-xl font-extrabold text-on-surface mt-1">{stats.totalRestaurants}</p>
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mt-0.5">Restaurants</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-4 text-center">
            <span className="material-symbols-outlined text-teal-600 text-2xl">groups</span>
            <p className="text-xl font-extrabold text-on-surface mt-1">{stats.totalUsers}</p>
            <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mt-0.5">Customers</p>
          </div>
        </section>
      )}

      {/* Tab Navigation links */}
      <section className="flex border-b border-outline-variant/20 gap-4 overflow-x-auto hide-scrollbar">
        {['orders', 'restaurants', 'foods', 'categories'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 text-xs font-bold relative active:scale-95 transition-all cursor-pointer capitalize whitespace-nowrap ${
              activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant'
            }`}
          >
            Manage {tab}
          </button>
        ))}
      </section>

      {/* Loading state indicator */}
      {loading && (
        <div className="py-12 text-center">
          <span className="animate-spin inline-block h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      {/* Tab Panels */}
      {!loading && (
        <section className="space-y-6">
          
          {/* Panel 1: Orders Dispatch Tracker */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm border border-outline-variant/15 overflow-hidden">
              <h3 className="font-headline-sm text-sm font-bold text-on-surface p-4 border-b border-outline-variant/10 bg-surface/50">
                Dispatched Orders Dispatcher
              </h3>
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant/15 text-on-surface-variant font-bold">
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Restaurant</th>
                        <th className="p-3">Total Paid</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Order Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-surface-container/10">
                          <td className="p-3 font-mono text-[10px] text-primary">{order._id}</td>
                          <td className="p-3">{order.user?.name || 'Guest'}</td>
                          <td className="p-3">{order.restaurant?.name || 'Deleted'}</td>
                          <td className="p-3 font-semibold">₹{order.total.toFixed(2)}</td>
                          <td className="p-3 text-[10px]">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="p-3">
                            <select 
                              value={order.orderStatus}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className="text-[11px] font-semibold bg-white border border-outline-variant/50 rounded px-2 py-1 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                            >
                              <option value="Placed">Placed</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="p-8 text-center text-on-surface-variant text-sm font-semibold">No orders listed on the system yet.</p>
              )}
            </div>
          )}

          {/* Panel 2: Manage Restaurants CRUD */}
          {activeTab === 'restaurants' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form to Add Restaurant */}
              <div className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-4 h-fit">
                <h3 className="font-bold text-sm text-on-surface mb-3 border-b pb-2">Add New Restaurant</h3>
                <form onSubmit={handleAddRestaurant} className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Restaurant Name</label>
                    <input 
                      type="text" 
                      value={newRestaurant.name}
                      onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                      placeholder="e.g. Burger Blast" 
                      className="h-8 px-2.5 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Description</label>
                    <input 
                      type="text" 
                      value={newRestaurant.description}
                      onChange={(e) => setNewRestaurant({ ...newRestaurant, description: e.target.value })}
                      placeholder="Gourmet burgers and crispy sides" 
                      className="h-8 px-2.5 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Cover Image URL</label>
                    <input 
                      type="text" 
                      value={newRestaurant.image}
                      onChange={(e) => setNewRestaurant({ ...newRestaurant, image: e.target.value })}
                      placeholder="Paste image URL (e.g. https://...)" 
                      className="h-8 px-2.5 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Cuisines (comma separated)</label>
                    <input 
                      type="text" 
                      value={newRestaurant.cuisineType}
                      onChange={(e) => setNewRestaurant({ ...newRestaurant, cuisineType: e.target.value })}
                      placeholder="e.g. Fast Food, Burgers" 
                      className="h-8 px-2.5 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Address</label>
                    <input 
                      type="text" 
                      value={newRestaurant.address}
                      onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
                      placeholder="456 Burger Avenue, Food District" 
                      className="h-8 px-2.5 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Delivery Time</label>
                    <input 
                      type="text" 
                      value={newRestaurant.deliveryTime}
                      onChange={(e) => setNewRestaurant({ ...newRestaurant, deliveryTime: e.target.value })}
                      placeholder="e.g. 20-30 mins" 
                      className="h-8 px-2.5 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Delivery Fee (₹)</label>
                    <input 
                      type="number" 
                      value={newRestaurant.deliveryFee}
                      onChange={(e) => setNewRestaurant({ ...newRestaurant, deliveryFee: Number(e.target.value) })}
                      className="h-8 px-2.5 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  
                  <button type="submit" className="w-full py-2 bg-primary text-on-primary text-xs font-bold rounded-lg cursor-pointer hover:shadow-sm">
                    Save Restaurant
                  </button>
                </form>
              </div>

              {/* View Restaurants List */}
              <div className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-4 lg:col-span-2">
                <h3 className="font-bold text-sm text-on-surface mb-3 border-b pb-2">Active Outlets</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {restaurants.map((rest) => (
                    <div key={rest._id} className="flex items-center gap-3 p-2 bg-surface-container-low rounded-lg border border-outline-variant/10 text-xs">
                      <img src={rest.image} alt={rest.name} className="w-12 h-12 object-cover rounded-md shrink-0 bg-surface-container" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-on-surface truncate">{rest.name}</p>
                        <p className="text-on-surface-variant/80 truncate">{rest.cuisineType.join(', ')}</p>
                        <p className="text-[10px] text-on-surface-variant/60 truncate">{rest.address}</p>
                      </div>
                      <span className="bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded font-bold border border-yellow-200">
                        {rest.rating} ★
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Panel 3: Manage Foods CRUD */}
          {activeTab === 'foods' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form to Add Food Menu Item */}
              <div className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-4 h-fit">
                <h3 className="font-bold text-sm text-on-surface mb-3 border-b pb-2">Add Dish</h3>
                <form onSubmit={handleAddFood} className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Dish Name</label>
                    <input 
                      type="text" 
                      value={newFood.name}
                      onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                      placeholder="e.g. Margherita Pizza" 
                      className="h-8 px-2.5 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Description</label>
                    <input 
                      type="text" 
                      value={newFood.description}
                      onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
                      placeholder="Wood-fired crispy mozzarella pizza" 
                      className="h-8 px-2.5 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Price (₹)</label>
                    <input 
                      type="number" 
                      value={newFood.price}
                      onChange={(e) => setNewFood({ ...newFood, price: Number(e.target.value) })}
                      className="h-8 px-2.5 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Food Image URL</label>
                    <input 
                      type="text" 
                      value={newFood.image}
                      onChange={(e) => setNewFood({ ...newFood, image: e.target.value })}
                      placeholder="Paste image URL (e.g. https://...)" 
                      className="h-8 px-2.5 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  {/* Dropdown selectors */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Category</label>
                    <select
                      value={newFood.category}
                      onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                      className="h-8 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Restaurant</label>
                    <select
                      value={newFood.restaurant}
                      onChange={(e) => setNewFood({ ...newFood, restaurant: e.target.value })}
                      className="h-8 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                      required
                    >
                      <option value="">Select Restaurant</option>
                      {restaurants.map(r => (
                        <option key={r._id} value={r._id}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <input 
                      type="checkbox" 
                      id="isVeg"
                      checked={newFood.isVeg}
                      onChange={(e) => setNewFood({ ...newFood, isVeg: e.target.checked })}
                      className="rounded text-primary border-outline-variant/50"
                    />
                    <label htmlFor="isVeg" className="text-xs font-semibold text-on-surface-variant cursor-pointer">
                      Is Vegetarian dish
                    </label>
                  </div>

                  <button type="submit" className="w-full py-2 bg-primary text-on-primary text-xs font-bold rounded-lg cursor-pointer hover:shadow-sm">
                    Save Dish
                  </button>
                </form>
              </div>

              {/* View Foods List */}
              <div className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-4 lg:col-span-2">
                <h3 className="font-bold text-sm text-on-surface mb-3 border-b pb-2">Active Menu Dishes</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {foods.map((food) => (
                    <div key={food._id} className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg border border-outline-variant/10 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={food.image} alt={food.name} className="w-12 h-12 object-cover rounded-md shrink-0 bg-surface-container" />
                        <div>
                          <p className="font-bold text-on-surface">{food.name} <span className={`inline-block h-2 w-2 rounded-full ml-1 ${food.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} /></p>
                          <p className="text-on-surface-variant/80">Restaurant: {food.restaurant?.name || 'Menu List'}</p>
                        </div>
                      </div>
                      <span className="font-bold text-primary mr-1 text-sm">
                        ₹{food.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Panel 4: Manage Categories CRUD */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form to Add Category */}
              <div className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-4 h-fit">
                <h3 className="font-bold text-sm text-on-surface mb-3 border-b pb-2">Add Category</h3>
                <form onSubmit={handleAddCategory} className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Category Name</label>
                    <input 
                      type="text" 
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="e.g. Pizza" 
                      className="h-8 px-2.5 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Icon Image URL</label>
                    <input 
                      type="text" 
                      value={newCategory.image}
                      onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                      placeholder="Paste image URL (e.g. https://...)" 
                      className="h-8 px-2.5 border border-outline-variant/50 rounded-lg text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  
                  <button type="submit" className="w-full py-2 bg-primary text-on-primary text-xs font-bold rounded-lg cursor-pointer hover:shadow-sm">
                    Save Category
                  </button>
                </form>
              </div>

              {/* View Categories List */}
              <div className="bg-white rounded-xl shadow-sm border border-outline-variant/15 p-4 lg:col-span-2">
                <h3 className="font-bold text-sm text-on-surface mb-3 border-b pb-2">Seeded Categories</h3>
                <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <div key={cat._id} className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/10 flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1.5 overflow-hidden">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                      </div>
                      <p className="font-bold text-xs text-on-surface mt-2">{cat.name}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </section>
      )}

    </div>
  );
}
