import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import MenuItemCard from '../components/MenuItemCard';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  const activeCategory = searchParams.get('category') || '';
  const debouncedSearch = useDebounce(searchInput, 350);

  // Fetch categories once
  useEffect(() => {
    api.get('/menu/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  // Fetch items — re-runs when category or debounced search changes
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (debouncedSearch.trim()) {
        const res = await api.get(`/menu/search?q=${encodeURIComponent(debouncedSearch.trim())}`);
        data = res.data;
      } else {
        const params = activeCategory ? { category: activeCategory } : {};
        const res = await api.get('/menu', { params });
        data = res.data;
      }
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeCategory]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const setCategory = (cat) => {
    setSearchInput('');
    setSearchParams(cat ? { category: cat } : {});
  };

  const filteredItems = vegOnly ? items.filter((i) => i.isVeg) : items;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Page header */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Our Menu</h1>

          {/* Search bar */}
          <div className="relative max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7 7 0 1116.65 16.65z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for dishes, categories…"
              className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-0 flex gap-2 overflow-x-auto hide-scrollbar pb-px">
          <button
            onClick={() => setCategory('')}
            className={`shrink-0 px-4 py-2 text-sm font-bold rounded-t-lg border-b-2 transition-colors ${!activeCategory ? 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/20' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 py-2 text-sm font-bold rounded-t-lg border-b-2 transition-colors ${activeCategory === cat ? 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/20' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filters row */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border-2 transition-all ${vegOnly ? 'border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-500' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-300'}`}
        >
          <span className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center ${vegOnly ? 'border-green-600' : 'border-gray-400'}`}>
            {vegOnly && <span className="w-1.5 h-1.5 rounded-full bg-green-600 block" />}
          </span>
          Veg Only
        </button>
        <span className="text-sm text-gray-500">
          {loading ? 'Loading…' : `${filteredItems.length} item${filteredItems.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Items grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">🔍</span>
            <h3 className="font-bold text-gray-700 dark:text-gray-300 text-lg">No items found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <MenuItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
