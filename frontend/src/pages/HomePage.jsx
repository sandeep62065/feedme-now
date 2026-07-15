import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import MenuItemCard from '../components/MenuItemCard';

// ─── Static data ─────────────────────────────────────────────────────────────

const VALUE_PROPS = [
  {
    emoji: '🚀',
    title: 'Fast Delivery',
    desc: 'Your food, hot and fresh, in under 40 minutes',
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    border: 'border-orange-100 dark:border-orange-900/30',
    accent: 'text-orange-500',
  },
  {
    emoji: '🌿',
    title: 'Made Fresh Daily',
    desc: 'No shortcuts, no freezers — just real cooking',
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-100 dark:border-green-900/30',
    accent: 'text-green-600',
  },
  {
    emoji: '🛒',
    title: 'Order in Seconds',
    desc: 'Browse, add to cart, and checkout effortlessly',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-100 dark:border-amber-900/30',
    accent: 'text-amber-500',
  },
  {
    emoji: '📍',
    title: 'Track It Live',
    desc: 'Know exactly when Feedme-Now is at your door',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-100 dark:border-blue-900/30',
    accent: 'text-blue-500',
  },
];

const CATEGORIES = [
  { label: 'Starters', emoji: '🥗', to: '/menu?category=Starters', bg: 'from-green-400 to-emerald-500' },
  { label: 'Main Course', emoji: '🍛', to: '/menu?category=Main Course', bg: 'from-orange-400 to-amber-500' },
  { label: 'Burgers', emoji: '🍔', to: '/menu?category=Burgers', bg: 'from-yellow-400 to-orange-500' },
  { label: 'Pizza', emoji: '🍕', to: '/menu?category=Pizza', bg: 'from-red-400 to-rose-500' },
  { label: 'Desserts', emoji: '🍰', to: '/menu?category=Desserts', bg: 'from-pink-400 to-fuchsia-500' },
  { label: 'Beverages', emoji: '🧃', to: '/menu?category=Drinks', bg: 'from-sky-400 to-blue-500' },
];

const TESTIMONIALS = [
  {
    quote: 'Feedme-Now lives up to its name — ordered and it was at my door before I finished a Netflix episode.',
    name: 'Priya S.',
    avatar: '👩',
    stars: 5,
  },
  {
    quote: 'Finally an app that makes ordering food actually simple. The food is incredible too!',
    name: 'Rohan K.',
    avatar: '👨',
    stars: 5,
  },
  {
    quote: "Hot food, on time, every single time. I'm ordering three times a week now.",
    name: 'Ananya M.',
    avatar: '👩‍💼',
    stars: 5,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Main HomePage ────────────────────────────────────────────────────────────

export default function HomePage() {
  const [bestsellers, setBestsellers] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    api.get('/menu')
      .then(({ data }) => {
        const tagged = data.items.filter((i) => i.tags?.includes('bestseller'));
        setBestsellers(tagged.length >= 4 ? tagged.slice(0, 6) : data.items.slice(0, 6));
      })
      .finally(() => setLoadingItems(false));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">

      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-32">
          <div className="max-w-2xl">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Now delivering in 30–45 mins
            </span>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-none tracking-tight mb-5">
              Hungry?{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Feedme-Now.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
              Fresh, delicious meals delivered hot to your door — because good food shouldn't wait.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-gray-900 font-black text-base px-8 py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
              >
                Order Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold text-base px-6 py-4 rounded-2xl transition-all hover:bg-white/5"
              >
                Browse Menu
              </Link>
            </div>

            {/* Delivery note */}
            <p className="mt-6 text-sm text-gray-500 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Delivering across your city in 30–45 mins
            </p>
          </div>

          {/* Floating food cards — desktop only */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3 opacity-80 select-none pointer-events-none">
            {['🍔', '🍕', '🧃', '🍰'].map((emoji, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-3xl"
                style={{ transform: `translateX(${i % 2 === 0 ? '0' : '20px'})` }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          VALUE PROPS
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUE_PROPS.map((vp) => (
              <div
                key={vp.title}
                className={`${vp.bg} border ${vp.border} rounded-2xl p-6 flex flex-col gap-3`}
              >
                <span className="text-3xl">{vp.emoji}</span>
                <h3 className={`font-black text-gray-900 dark:text-white text-lg leading-tight`}>{vp.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{vp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          POPULAR DISHES
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-amber-500 text-sm font-bold uppercase tracking-widest">Most Loved</span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mt-1">
                What Everyone's Ordering
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Our most-loved dishes, ready when you are</p>
            </div>
            <Link
              to="/menu"
              className="shrink-0 inline-flex items-center gap-1 text-amber-600 font-bold text-sm hover:underline"
            >
              See full menu →
            </Link>
          </div>

          {/* Items grid */}
          {loadingItems ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {bestsellers.map((item) => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 active:scale-95 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-md"
            >
              View All Dishes
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-gray-950 py-20 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-amber-500 text-sm font-bold uppercase tracking-widest">Browse by Category</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mt-1">Find Your Craving</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">From starters to sweets, Feedme-Now has it covered</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                to={cat.to}
                className="group relative overflow-hidden rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm hover:shadow-md"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.bg} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <span className="relative text-4xl">{cat.emoji}</span>
                <span className="relative text-white font-black text-sm drop-shadow-sm">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ABOUT / STORY
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-gray-950 to-gray-900 text-white py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block bg-amber-500/20 text-amber-300 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 border border-amber-500/20">
              Our Story
            </span>
            <h2 className="text-3xl md:text-5xl font-black leading-tight mb-6">
              Good Food,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Right Now.
              </span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Feedme-Now was built on a simple idea — when hunger hits, food should show up fast, fresh, and full of flavor. Every order is made to order and delivered with care, so you can eat well without the wait.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-gray-900 font-black px-7 py-3.5 rounded-2xl transition-all shadow-lg shadow-amber-500/20"
            >
              Start Ordering
            </Link>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/10">
            {[
              { num: '10K+', label: 'Happy Customers' },
              { num: '30 min', label: 'Avg. Delivery' },
              { num: '100%', label: 'Fresh Every Day' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-amber-400">{s.num}</p>
                <p className="text-gray-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-amber-50 dark:bg-gray-900 py-20 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-amber-500 text-sm font-bold uppercase tracking-widest">Reviews</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mt-1">They Love Us. You Will Too.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-100 dark:border-gray-700 shadow-sm p-6 flex flex-col gap-4"
              >
                <StarRating count={t.stars} />
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm flex-1">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-gray-700 flex items-center justify-center text-lg">
                    {t.avatar}
                  </div>
                  <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">— {t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FINAL CTA STRIP
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-amber-500 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Ready to eat?</h2>
            <p className="text-gray-700 mt-1">Order in seconds. Eat in minutes.</p>
          </div>
          <Link
            to="/menu"
            className="shrink-0 inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 active:scale-95 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-lg text-base"
          >
            Order Now 🍔
          </Link>
        </div>
      </section>

    </div>
  );
}
