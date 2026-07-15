import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchRestaurants } from '../../store/slices/restaurantSlice';
import { fetchFoods, fetchCategories, setSelectedCategory, toggleVegOnly } from '../../store/slices/foodSlice';
import toast from 'react-hot-toast';
import RestaurantCard from '../../components/RestaurantCard';
import FoodCard from '../../components/FoodCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { restaurants, loading: restaurantsLoading } = useSelector((state) => state.restaurant);
  const { categories } = useSelector((state) => state.food);
  const { selectedCategory, searchQuery, isVegOnly, foods } = useSelector((state) => state.food);

  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'time', 'default'
  const [foodsLoading, setFoodsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchRestaurants());
    dispatch(fetchCategories());
    
    // Fetch all foods for the Best Sellers section
    setFoodsLoading(true);
    dispatch(fetchFoods()).finally(() => setFoodsLoading(false));
  }, [dispatch]);

  // Handle category toggle
  const handleCategoryClick = (categoryName) => {
    if (selectedCategory === categoryName) {
      dispatch(setSelectedCategory(null));
    } else {
      dispatch(setSelectedCategory(categoryName));
    }
  };

  // Filter restaurants based on UI criteria
  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchName = restaurant.name.toLowerCase().includes(query);
      const matchCuisine = restaurant.cuisineType.some((c) => c.toLowerCase().includes(query));
      if (!matchName && !matchCuisine) return false;
    }

    if (selectedCategory) {
      const categoryMatch = restaurant.cuisineType.some(
        (cuisine) => cuisine.toLowerCase() === selectedCategory.toLowerCase()
      );
      if (!categoryMatch && selectedCategory !== 'Desserts') {
        return false;
      }
    }

    return true;
  });

  // Sort restaurants
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    if (sortBy === 'time') {
      const timeA = parseInt(a.deliveryTime) || 0;
      const timeB = parseInt(b.deliveryTime) || 0;
      return timeA - timeB;
    }
    return 0; // default
  });

  // Filter foods for the Best Sellers grid (matches veggie selection and search)
  const filteredFoods = foods.filter((food) => {
    if (isVegOnly && !food.isVeg) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return food.name.toLowerCase().includes(query) || food.description.toLowerCase().includes(query);
    }
    if (selectedCategory) {
      return food.category?.name?.toLowerCase() === selectedCategory.toLowerCase();
    }
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto pt-32 pb-24 animate-in fade-in duration-300">
      
      {/* 1. Hero Promotion Banner Carousel */}
      <section className="px-margin-mobile mb-xl overflow-hidden relative">
        <div className="relative w-full aspect-[21/9] md:aspect-[24/8] rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] group border border-outline-variant/10">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-10 flex flex-col justify-center px-6 md:px-12">
            <span className="bg-primary text-on-primary font-label-sm text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full w-fit mb-2 font-bold">
              LIMITED OFFER
            </span>
            <h2 className="text-white font-display text-display-mobile md:text-4xl mb-1 font-extrabold tracking-tight">
              50% Off Pepperoni Pizza
            </h2>
            <p className="text-white/80 font-body-md text-xs md:text-sm max-w-xs md:max-w-md">
              Grab the hottest, wood-fired crispy slices in town before they sell out.
            </p>
          </div>
          <div 
            className="w-full h-full animate-zoom bg-cover bg-center" 
            style={{ 
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD3qAUcITXkYBCysPAPDyYD-1G0_0tjT-4RYqMRZD18inuDtytsbEZl3JRiOXKKVYAC_QURLPOA8W_-qsPKbQedePAsUcQkvkFdPDDVmUafGJswICD_wSJeAdfoe4XniBg7m-cS1iuT3ZMpGEwcV7kXnVPKH0lvMEVHBtGTixjk-oWLZiN3RMrF4s9IGF2SIz29wPUATLbTpbZEU2VzftTdPiGTuCsd4zo_TOffntIIxLm8c2VWZ0G2')" 
            }}
          />
        </div>
      </section>

      {/* 2. Cravings Categories Carousel */}
      <section className="mb-xl">
        <div className="flex items-center justify-between px-margin-mobile mb-md">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Cravings</h3>
          {selectedCategory && (
            <button 
              onClick={() => dispatch(setSelectedCategory(null))}
              className="text-primary font-label-lg text-sm hover:underline cursor-pointer font-semibold"
            >
              Clear Filter
            </button>
          )}
        </div>
        <div className="flex overflow-x-auto hide-scrollbar gap-gutter px-margin-mobile py-2">
          {categories.map((cat) => (
            <button 
              key={cat._id}
              onClick={() => handleCategoryClick(cat.name)}
              className="flex flex-col items-center gap-2 shrink-0 group active:scale-95 transition-all text-left focus:outline-none cursor-pointer"
            >
              <div 
                className={`w-16 h-16 rounded-full shadow-sm flex items-center justify-center p-2.5 overflow-hidden transition-colors border ${selectedCategory === cat.name ? 'bg-primary-container/10 border-primary shadow' : 'bg-surface-container border-outline-variant/10'}`}
              >
                <img 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                  src={cat.image} 
                  alt={cat.name}
                />
              </div>
              <span className={`font-label-sm text-xs font-semibold ${selectedCategory === cat.name ? 'text-primary font-bold' : 'text-on-surface'}`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Popular Near You (Horizontal Scrollable list of restaurants) */}
      <section className="mb-xl">
        <div className="flex items-center justify-between px-margin-mobile mb-md">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Popular near you</h3>
          <button className="text-primary font-label-lg text-sm font-semibold hover:underline">
            See {sortedRestaurants.length} more
          </button>
        </div>

        {restaurantsLoading ? (
          <div className="flex overflow-x-auto hide-scrollbar gap-gutter px-margin-mobile py-2">
            <LoadingSkeleton type="restaurant" count={3} />
          </div>
        ) : sortedRestaurants.length > 0 ? (
          <div className="flex overflow-x-auto hide-scrollbar gap-gutter px-margin-mobile py-2">
            {sortedRestaurants.map((restaurant) => (
              <div key={restaurant._id} className="w-72 shrink-0">
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-on-surface-variant text-sm font-semibold">
            No restaurants found in this area.
          </div>
        )}
      </section>

      {/* Filter and Sort controls for Food Grid */}
      <section className="px-margin-mobile mb-lg flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/10 pb-4">
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Best Sellers'}
        </h3>
        
        {/* Filters Group */}
        <div className="flex items-center gap-2 text-label-sm">
          {/* Veg Toggle */}
          <button 
            onClick={() => dispatch(toggleVegOnly())}
            className={`px-3 py-1.5 rounded-full border transition-all active:scale-95 flex items-center gap-1 cursor-pointer font-semibold ${isVegOnly ? 'bg-secondary text-on-secondary border-secondary' : 'bg-white text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'}`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Veg Only
          </button>

          {/* Sort by Ratings */}
          <button 
            onClick={() => setSortBy(sortBy === 'rating' ? 'default' : 'rating')}
            className={`px-3 py-1.5 rounded-full border transition-all active:scale-95 flex items-center gap-0.5 cursor-pointer font-semibold ${sortBy === 'rating' ? 'bg-primary text-on-primary border-primary' : 'bg-white text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'}`}
          >
            Sort by Rating
            <span className="material-symbols-outlined text-xs">star</span>
          </button>
        </div>
      </section>

      {/* 4. Best Sellers (Grid of Food Cards from Database) */}
      <section className="px-margin-mobile mb-xl">
        {foodsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <LoadingSkeleton type="menu" count={6} />
          </div>
        ) : filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFoods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-on-surface-variant text-sm font-semibold">
            No dishes match your active criteria.
          </div>
        )}
      </section>

      {/* 5. Bento Grid Highlight Banners */}
      <section className="px-margin-mobile mb-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-auto md:h-[240px]">
          {/* Win-Win Weekends */}
          <div className="bg-tertiary-container/10 rounded-2xl p-5 flex flex-col justify-between overflow-hidden relative border border-tertiary-container/20 min-h-[140px] md:min-h-0">
            <div className="z-10">
              <h4 className="font-headline-sm text-headline-sm font-extrabold text-tertiary-container">Win-Win Weekends</h4>
              <p className="font-body-md text-xs text-on-surface-variant mt-1">Double rewards on all pizza orders today!</p>
            </div>
            <button 
              onClick={() => toast.success('Joined Weekend Pizza Rewards!')}
              className="z-10 w-fit bg-tertiary-container text-white px-4 py-1.5 rounded-full text-xs font-bold active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              Join Now
            </button>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl text-tertiary-container/10 rotate-12 select-none">
              local_pizza
            </span>
          </div>

          {/* Flash Sale */}
          <div className="bg-secondary-container/10 rounded-2xl p-5 flex items-center justify-between border border-secondary-container/30 min-h-[100px] md:min-h-0">
            <div className="text-left">
              <h4 className="font-label-lg font-bold text-secondary">Flash Sale</h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5 font-medium">Burgers starting from only ₹99</p>
              <button 
                onClick={() => dispatch(setSelectedCategory('Burgers'))}
                className="mt-3 text-secondary font-bold text-xs hover:underline flex items-center gap-0.5"
              >
                Order Now <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
            <span className="material-symbols-outlined text-secondary text-5xl opacity-30 select-none animate-pulse">
              bolt
            </span>
          </div>

          {/* New Arrivals */}
          <div className="bg-primary-container/5 rounded-2xl p-5 flex items-center justify-between border border-primary-container/10 min-h-[100px] md:min-h-0">
            <div className="text-left">
              <h4 className="font-label-lg font-bold text-primary">New Arrivals</h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5 font-medium">Explore newly listed restaurant spots</p>
              <button 
                onClick={() => setSortBy('default')}
                className="mt-3 text-primary font-bold text-xs hover:underline flex items-center gap-0.5"
              >
                Check Stores <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
            <span className="material-symbols-outlined text-primary text-5xl opacity-20 select-none">
              restaurant
            </span>
          </div>
        </div>
      </section>

      {/* 6. Mobile Bottom Navigation Sticky Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-45 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)] rounded-t-2xl border-t border-outline-variant/10 md:hidden animate-in slide-in-from-bottom duration-250">
        <div className="flex justify-around items-center px-4 py-2 pb-safe">
          <Link to="/" className="flex flex-col items-center justify-center text-primary font-semibold text-[10px] py-1 px-3 bg-primary/10 rounded-xl">
            <span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
            <span>Home</span>
          </Link>
          
          <button 
            onClick={() => {
              // Focus on search input inside navbar
              document.querySelector("input[placeholder*='Search']")?.focus();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary text-[10px]"
          >
            <span className="material-symbols-outlined">search</span>
            <span>Search</span>
          </button>

          <Link to="/profile" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary text-[10px]">
            <span className="material-symbols-outlined">receipt_long</span>
            <span>Orders</span>
          </Link>

          <Link to="/profile" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary text-[10px]">
            <span className="material-symbols-outlined">person</span>
            <span>Profile</span>
          </Link>
        </div>
      </nav>

    </div>
  );
}
