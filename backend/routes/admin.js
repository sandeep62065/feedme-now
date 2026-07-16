import express from 'express';
import {
  getAllOrders,
  updateOrderStatus,
  getAdminStats,
  getAllUsers
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);

export default router;
