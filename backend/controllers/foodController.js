import Food from '../models/Food.js';

// @desc    Get all foods (optional filters: restaurant, category, search)
// @route   GET /api/foods
// @access  Public
export const getFoods = async (req, res, next) => {
  const { restaurant, category, search, isVeg } = req.query;
  const query = {};

  if (restaurant) query.restaurant = restaurant;
  if (category) query.category = category;
  if (isVeg) query.isVeg = isVeg === 'true';
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  try {
    const foods = await Food.find(query)
      .populate('category', 'name image')
      .populate('restaurant', 'name address');
    res.json({ success: true, foods });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food
// @route   GET /api/foods/:id
// @access  Public
export const getFoodById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const food = await Food.findById(id)
      .populate('category', 'name image')
      .populate('restaurant', 'name address description rating deliveryTime deliveryFee');
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    res.json({ success: true, food });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a food item
// @route   POST /api/foods
// @access  Private/Admin
export const createFood = async (req, res, next) => {
  const { name, description, price, image, category, restaurant, isVeg, rating, status } = req.body;
  try {
    const food = await Food.create({
      name,
      description,
      price,
      image,
      category,
      restaurant,
      isVeg,
      rating,
      status
    });
    res.status(201).json({ success: true, food });
  } catch (error) {
    next(error);
  }
};
