import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchFoods = createAsyncThunk(
  'food/fetchFoods',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { category, search, isVeg } = filters;
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      if (isVeg !== undefined) params.isVeg = isVeg;

      const res = await api.get('/foods', { params });
      return res.data.foods;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch foods');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'food/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/categories');
      return res.data.categories;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

const initialState = {
  foods: [],
  categories: [],
  selectedCategory: null,
  searchQuery: '',
  isVegOnly: false,
  loading: false,
  error: null
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleVegOnly: (state) => {
      state.isVegOnly = !state.isVegOnly;
    },
    resetFilters: (state) => {
      state.selectedCategory = null;
      state.searchQuery = '';
      state.isVegOnly = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Foods
      .addCase(fetchFoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.foods = action.payload;
      })
      .addCase(fetchFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  }
});

export const { setSelectedCategory, setSearchQuery, toggleVegOnly, resetFilters } = foodSlice.actions;
export default foodSlice.reducer;
