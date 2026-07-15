import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { loginUser, registerUser } from '../store/slices/authSlice';
import { mergeGuestCart, fetchCart } from '../store/slices/cartSlice';

export default function AuthModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      let resultAction;
      if (isLoginMode) {
        resultAction = await dispatch(loginUser({ email: data.email, password: data.password }));
      } else {
        resultAction = await dispatch(registerUser({ name: data.name, email: data.email, password: data.password }));
      }

      if (loginUser.fulfilled.match(resultAction) || registerUser.fulfilled.match(resultAction)) {
        toast.success(isLoginMode ? 'Welcome back!' : 'Account registered successfully!');
        
        // Immediately merge guest cart into database
        await dispatch(mergeGuestCart());
        // Reload cart
        await dispatch(fetchCart());
        
        onClose();
        reset();
      } else {
        toast.error(resultAction.payload || 'Authentication failed');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Backdrop click to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-sm mx-4 rounded-2xl shadow-2xl border border-gray-100 z-10 animate-in zoom-in-95 duration-200 overflow-hidden">

        {/* Coloured top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary-container to-primary" />

        <div className="p-7">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-primary transition-colors p-1 rounded-full hover:bg-gray-100 active:scale-95"
          >
            <span className="material-symbols-outlined text-xl leading-none">close</span>
          </button>

          {/* Modal Header — centred */}
          <div className="text-center mb-6">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
              FreshBite
            </span>
            <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
              {isLoginMode ? 'Welcome back!' : 'Create your account'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isLoginMode
                ? 'Sign in to continue ordering'
                : 'Join us and start ordering today'}
            </p>
          </div>

          {/* Auth form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            {/* Name Field (Register Mode Only) */}
            {!isLoginMode && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
                />
                {errors.name && (
                  <span className="text-red-500 text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">error</span>
                    {errors.name.message}
                  </span>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                placeholder="name@example.com"
                className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
              />
              {errors.email && (
                <span className="text-red-500 text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">error</span>
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                type="password"
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition"
              />
              {errors.password && (
                <span className="text-red-500 text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">error</span>
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Redux Error Banner */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg">
                <span className="material-symbols-outlined text-sm">warning</span>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-1 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isLoginMode ? 'login' : 'person_add'}
                  </span>
                  {isLoginMode ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-5 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
            {isLoginMode ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={toggleMode}
              className="text-primary font-bold hover:underline"
            >
              {isLoginMode ? 'Register Now' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
