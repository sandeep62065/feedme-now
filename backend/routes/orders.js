import express from 'express';
import {
  placeOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/', protect, getMyOrders);
router.get('/all', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrder);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
