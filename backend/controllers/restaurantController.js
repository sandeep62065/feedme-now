import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
export const getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find();
    res.json({ success: true, restaurants });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single restaurant & its menu (foods)
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurantById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    // Get foods for this restaurant and populate category details
    const foods = await Food.find({ restaurant: id }).populate('category', 'name image');

    res.json({
      success: true,
      restaurant,
      foods
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a restaurant
// @route   POST /api/restaurants
// @access  Private/Admin
export const createRestaurant = async (req, res, next) => {
  const { name, description, image, cuisineType, deliveryTime, deliveryFee, address } = req.body;
  try {
    const restaurant = await Restaurant.create({
      name,
      description,
      image,
      cuisineType,
      deliveryTime,
      deliveryFee,
      address
    });
    res.status(201).json({ success: true, restaurant });
  } catch (error) {
    next(error);
  }
};
