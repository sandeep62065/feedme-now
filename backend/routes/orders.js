import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getMyOrders);

router.route('/:id')
  .get(getOrderById);

export default router;
