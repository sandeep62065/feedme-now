import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await signup({ name: data.name, email: data.email, password: data.password, phone: data.phone });
      toast.success('Account created! Welcome to Feedme-Now 🎉');
      navigate('/menu');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />

          <div className="p-8">
            <div className="text-center mb-8">
              <span className="text-4xl">🎉</span>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-2">
                Join Feedme<span className="text-amber-500">-Now</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Create your account and start ordering</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full name</label>
                <input
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })}
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  className={`w-full h-11 px-4 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition ${errors.name ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 dark:focus:border-amber-400'}`}
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>

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

              {/* Phone (optional) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Phone <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 dark:focus:border-amber-400 transition"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' },
                  })}
                  type="password"
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className={`w-full h-11 px-4 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition ${errors.password ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 dark:focus:border-amber-400'}`}
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm password</label>
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (v) => v === password || 'Passwords do not match',
                  })}
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full h-11 px-4 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 dark:focus:border-amber-400'}`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-black rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md mt-2"
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-600 font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
