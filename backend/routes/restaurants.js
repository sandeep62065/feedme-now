import express from 'express';
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant
} from '../controllers/restaurantController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getRestaurants)
  .post(protect, adminOnly, createRestaurant);

router.route('/:id')
  .get(getRestaurantById);

export default router;
