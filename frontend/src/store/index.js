import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import restaurantReducer from './slices/restaurantSlice';
import foodReducer from './slices/foodSlice';
import ordersReducer from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    restaurant: restaurantReducer,
    food: foodReducer,
    orders: ordersReducer
  }
});

export default store;
