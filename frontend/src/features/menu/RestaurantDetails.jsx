import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { fetchRestaurantDetails, clearActiveRestaurant } from '../../store/slices/restaurantSlice';
import FoodCard from '../../components/FoodCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeRestaurant, activeMenu, loading, error } = useSelector((state) => state.restaurant);

  useEffect(() => {
    dispatch(fetchRestaurantDetails(id));
    return () => {
      dispatch(clearActiveRestaurant());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto px-margin-mobile pt-32 pb-16 space-y-6">
        <LoadingSkeleton type="banner" />
        <div className="space-y-4">
          <LoadingSkeleton type="menu" count={4} />
        </div>
      </div>
    );
  }

  if (error || !activeRestaurant) {
    return (
      <div className="w-full max-w-md mx-auto pt-32 pb-16 text-center space-y-4">
        <span className="material-symbols-outlined text-5xl text-error">warning</span>
        <h3 className="font-headline-sm text-on-surface">Restaurant Not Found</h3>
        <p className="text-body-md text-on-surface-variant/60">{error || 'Could not fetch restaurant.'}</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-on-primary font-label-lg px-6 py-2 rounded-lg cursor-pointer"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  // Dynamically group menu foods by category name
  const groupedMenu = activeMenu.reduce((acc, food) => {
    const catName = food.category?.name || 'Other';
    if (!acc[catName]) {
      acc[catName] = [];
    }
    acc[catName].push(food);
    return acc;
  }, {});

  const categories = Object.keys(groupedMenu);

  return (
    <div className="w-full animate-in fade-in duration-300">
      
      {/* Top sticky app header bar */}
      <header className="fixed top-0 w-full z-30 bg-surface/85 backdrop-blur-xl shadow-sm">
        <div className="flex justify-between items-center px-margin-mobile py-sm w-full max-w-7xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center hover:bg-white active:scale-95 transition-transform duration-200 shadow-sm text-primary cursor-pointer border border-outline-variant/10"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-display text-lg font-extrabold text-primary tracking-tight">
            {activeRestaurant.name}
          </h1>
          <button 
            onClick={() => toast.success('Added to favorites!')}
            className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center hover:bg-white active:scale-95 transition-transform duration-200 shadow-sm text-primary cursor-pointer border border-outline-variant/10"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
              favorite
            </span>
          </button>
        </div>
      </header>

      {/* Main Banner Hero Cover */}
      <main className="pt-[50px] pb-32">
        <section className="relative h-64 w-full bg-surface-container">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url('${activeRestaurant.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-margin-mobile text-white max-w-7xl mx-auto">
            
            {/* Top Badges */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-primary text-on-primary px-2.5 py-0.5 rounded-lg font-label-sm text-[10px] uppercase font-bold tracking-wider">
                Top Rated
              </span>
              <div className="flex items-center bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg font-label-sm text-xs">
                <span className="material-symbols-outlined text-[13px] text-yellow-400 mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                {activeRestaurant.rating.toFixed(1)} (1.2k+ reviews)
              </div>
            </div>

            {/* Restaurant Info */}
            <h2 className="font-headline-lg text-headline-lg md:text-3xl mb-1.5 font-extrabold">{activeRestaurant.name}</h2>
            <div className="flex items-center gap-4 text-white/90 font-label-sm text-[11px] md:text-xs flex-wrap">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">restaurant</span>
                {activeRestaurant.cuisineType.join(', ')}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {activeRestaurant.deliveryTime}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">delivery_dining</span>
                {activeRestaurant.deliveryFee === 0 ? 'Free Delivery' : `₹${activeRestaurant.deliveryFee} Delivery`}
              </span>
            </div>
          </div>
        </section>

        {/* Category Navigation Tabs */}
        {categories.length > 0 && (
          <nav className="sticky top-[50px] z-20 bg-white/90 backdrop-blur-md border-b border-outline-variant/20 px-margin-mobile overflow-x-auto custom-scrollbar shadow-sm">
            <div className="flex items-center gap-6 h-14 max-w-3xl mx-auto">
              {categories.map((catName) => (
                <a 
                  key={catName}
                  href={`#${catName.toLowerCase()}`}
                  className="whitespace-nowrap font-label-lg text-label-sm text-on-surface-variant hover:text-primary py-4 active:scale-95 transition-transform"
                >
                  {catName}
                </a>
              ))}
            </div>
          </nav>
        )}

        {/* Menu Items List */}
        <div className="px-margin-mobile mt-lg space-y-xl max-w-3xl mx-auto">
          {categories.length > 0 ? (
            categories.map((catName) => (
              <section key={catName} id={catName.toLowerCase()} className="scroll-mt-32">
                <h3 className="font-headline-md text-headline-md mb-md flex items-center gap-2 font-bold text-on-surface">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  {catName}
                </h3>
                <div className="space-y-md">
                  {groupedMenu[catName].map((food) => (
                    <FoodCard key={food._id} food={food} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="py-16 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl">no_food</span>
              <p className="mt-2 text-sm font-semibold">No food items listed for this restaurant menu yet.</p>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
