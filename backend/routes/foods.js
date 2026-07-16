import express from 'express';
import {
  getFoods,
  getFoodById,
  createFood
} from '../controllers/foodController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getFoods)
  .post(protect, adminOnly, createFood);

router.route('/:id')
  .get(getFoodById);

export default router;
