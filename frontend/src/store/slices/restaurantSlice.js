import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchRestaurants = createAsyncThunk(
  'restaurant/fetchRestaurants',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/restaurants');
      return res.data.restaurants;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load restaurants');
    }
  }
);

export const fetchRestaurantDetails = createAsyncThunk(
  'restaurant/fetchRestaurantDetails',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/restaurants/${id}`);
      return res.data; // contains restaurant detail and its food array
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load restaurant details');
    }
  }
);

const initialState = {
  restaurants: [],
  activeRestaurant: null,
  activeMenu: [],
  loading: false,
  error: null
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    clearActiveRestaurant: (state) => {
      state.activeRestaurant = null;
      state.activeMenu = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Restaurants
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Details
      .addCase(fetchRestaurantDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.activeRestaurant = action.payload.restaurant;
        state.activeMenu = action.payload.foods;
      })
      .addCase(fetchRestaurantDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearActiveRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
