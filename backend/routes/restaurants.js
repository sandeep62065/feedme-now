import express from 'express';
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant
} from '../controllers/restaurantController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getRestaurants)
  .post(protect, admin, createRestaurant);

router.route('/:id')
  .get(getRestaurantById);

export default router;
