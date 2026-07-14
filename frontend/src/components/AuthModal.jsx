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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm transition-opacity duration-300">
      {/* Backdrop click to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-md mx-4 rounded-xl shadow-2xl overflow-hidden border border-outline-variant/10 p-6 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container active:scale-95"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Modal Header */}
        <h2 className="font-display text-display-mobile text-primary mb-1">FreshBite</h2>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6">
          {isLoginMode ? 'Sign In to Your Account' : 'Create an Account'}
        </h3>

        {/* Auth form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Name Field (Register Mode Only) */}
          {!isLoginMode && (
            <div className="flex flex-col gap-1">
              <label className="font-label-lg text-label-sm text-on-surface-variant">Full Name</label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                placeholder="Enter your name"
                className="h-10 px-3 border border-outline-variant/50 rounded-lg text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
              {errors.name && <span className="text-error font-label-sm text-xs">{errors.name.message}</span>}
            </div>
          )}

          {/* Email Field */}
          <div className="flex flex-col gap-1">
            <label className="font-label-lg text-label-sm text-on-surface-variant">Email Address</label>
            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              placeholder="name@example.com"
              className="h-10 px-3 border border-outline-variant/50 rounded-lg text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
            {errors.email && <span className="text-error font-label-sm text-xs">{errors.email.message}</span>}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1">
            <label className="font-label-lg text-label-sm text-on-surface-variant">Password</label>
            <input
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              type="password"
              placeholder="••••••••"
              className="h-10 px-3 border border-outline-variant/50 rounded-lg text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
            {errors.password && <span className="text-error font-label-sm text-xs">{errors.password.message}</span>}
          </div>

          {/* Error Message from Redux */}
          {error && (
            <div className="p-3 bg-error-container text-on-error-container text-label-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary text-on-primary font-label-lg rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              isLoginMode ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Mode Switcher */}
        <div className="mt-6 text-center text-label-sm text-on-surface-variant">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={toggleMode}
            className="text-primary font-semibold hover:underline"
          >
            {isLoginMode ? 'Register Now' : 'Login Now'}
          </button>
        </div>

      </div>
    </div>
  );
}
