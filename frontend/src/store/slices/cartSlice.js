import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Helper to calculate totals locally for guest cart
const calculateLocalTotals = (items, deliveryFee = 40) => {
  const subtotal = items.reduce((acc, item) => {
    const price = item.food ? item.food.price : 0;
    return acc + (price * item.quantity);
  }, 0);
  const gst = Math.round((subtotal * 0.05) * 100) / 100;
  const finalDeliveryFee = subtotal > 500 || subtotal === 0 ? 0 : deliveryFee;
  const total = subtotal + gst + finalDeliveryFee;

  return {
    subtotal,
    deliveryFee: finalDeliveryFee,
    gst,
    total
  };
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (auth.isAuthenticated) {
      try {
        const res = await api.get('/cart');
        return res.data.cart;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
      }
    } else {
      // Load from localStorage for guest
      const localCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
      const totals = calculateLocalTotals(localCart);
      return {
        items: localCart,
        ...totals
      };
    }
  }
);

export const addCartItem = createAsyncThunk(
  'cart/addCartItem',
  async ({ food, quantity = 1 }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (auth.isAuthenticated) {
      try {
        const res = await api.post('/cart', { foodId: food._id, quantity });
        return res.data.cart;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add item');
      }
    } else {
      // Manage local storage for guest
      const localCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
      const itemIndex = localCart.findIndex(item => item.food._id === food._id);

      if (itemIndex > -1) {
        localCart[itemIndex].quantity += quantity;
      } else {
        localCart.push({ food, quantity });
      }

      localStorage.setItem('guest_cart', JSON.stringify(localCart));
      const totals = calculateLocalTotals(localCart);
      return {
        items: localCart,
        ...totals
      };
    }
  }
);

export const updateCartItemQty = createAsyncThunk(
  'cart/updateCartItemQty',
  async ({ foodId, quantity }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (auth.isAuthenticated) {
      try {
        const res = await api.patch(`/cart/${foodId}`, { quantity });
        return res.data.cart;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
      }
    } else {
      // Guest
      const localCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
      const itemIndex = localCart.findIndex(item => item.food._id === foodId);

      if (itemIndex > -1) {
        localCart[itemIndex].quantity = quantity;
      }

      localStorage.setItem('guest_cart', JSON.stringify(localCart));
      const totals = calculateLocalTotals(localCart);
      return {
        items: localCart,
        ...totals
      };
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (foodId, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (auth.isAuthenticated) {
      try {
        const res = await api.delete(`/cart/${foodId}`);
        return res.data.cart;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
      }
    } else {
      // Guest
      let localCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
      localCart = localCart.filter(item => item.food._id !== foodId);

      localStorage.setItem('guest_cart', JSON.stringify(localCart));
      const totals = calculateLocalTotals(localCart);
      return {
        items: localCart,
        ...totals
      };
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (auth.isAuthenticated) {
      try {
        const res = await api.delete('/cart');
        return res.data.cart;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
      }
    } else {
      localStorage.removeItem('guest_cart');
      return {
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        gst: 0,
        total: 0
      };
    }
  }
);

export const mergeGuestCart = createAsyncThunk(
  'cart/mergeGuestCart',
  async (_, { rejectWithValue }) => {
    try {
      const localCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
      if (localCart.length === 0) return null;

      // Transform items for backend merge endpoint
      const itemsToMerge = localCart.map(item => ({
        foodId: item.food._id,
        quantity: item.quantity
      }));

      const res = await api.post('/cart/merge', { items: itemsToMerge });
      localStorage.removeItem('guest_cart');
      return res.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to merge cart');
    }
  }
);

export const applyPromoCoupon = createAsyncThunk(
  'cart/applyPromoCoupon',
  async (couponCode, { rejectWithValue }) => {
    try {
      const res = await api.post('/cart/coupon', { code: couponCode });
      return res.data.coupon;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid coupon code');
    }
  }
);

const initialState = {
  items: [],
  subtotal: 0,
  deliveryFee: 0,
  gst: 0,
  total: 0,
  appliedCoupon: null,
  isCartDrawerOpen: false,
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      // Recalculating without coupon
      state.total = state.subtotal + state.gst + state.deliveryFee;
    },
    clearCartLocal: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.deliveryFee = 0;
      state.gst = 0;
      state.total = 0;
      state.appliedCoupon = null;
    },
    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
    setCartDrawerOpen: (state, action) => {
      state.isCartDrawerOpen = action.payload;
    }
  },
  extraReducers: (builder) => {
    const handleCartFulfilled = (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.items = action.payload.items || [];
        state.subtotal = action.payload.subtotal || 0;
        state.deliveryFee = action.payload.deliveryFee || 0;
        state.gst = action.payload.gst || 0;
        state.total = action.payload.total || 0;
      }
    };

    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, handleCartFulfilled)
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCartItem.fulfilled, handleCartFulfilled)
      .addCase(updateCartItemQty.fulfilled, handleCartFulfilled)
      .addCase(removeCartItem.fulfilled, handleCartFulfilled)
      .addCase(clearCart.fulfilled, handleCartFulfilled)
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload.items;
          state.subtotal = action.payload.subtotal;
          state.deliveryFee = action.payload.deliveryFee;
          state.gst = action.payload.gst;
          state.total = action.payload.total;
        }
      })
      .addCase(applyPromoCoupon.fulfilled, (state, action) => {
        state.appliedCoupon = action.payload;
        // Deduct discount from total
        const discount = action.payload.discountAmount;
        state.total = Math.max(0, state.subtotal + state.gst + state.deliveryFee - discount);
      });
  }
});

export const { removeCoupon, clearCartLocal, toggleCartDrawer, setCartDrawerOpen } = cartSlice.actions;
export default cartSlice.reducer;
