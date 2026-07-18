import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const loggedInUser = await login({ email: data.email, password: data.password });
      toast.success('Welcome back! 👋');
      if (loggedInUser?.role === 'delivery_partner') {
        navigate('/delivery-dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {/* Top accent */}
          <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />

          <div className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <span className="text-4xl">🍔</span>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-2">
                Welcome back to Feedme<span className="text-amber-500">-Now</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sign in to continue ordering</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email address</label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full h-11 px-4 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition ${errors.email ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 dark:focus:border-amber-400'}`}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                <input
                  {...register('password', { required: 'Password is required' })}
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full h-11 px-4 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition ${errors.password ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 dark:focus:border-amber-400'}`}
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-black rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md mt-1"
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-amber-600 font-bold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
