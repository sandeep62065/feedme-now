import express from 'express';
import {
  getAllOrders,
  updateOrderStatus,
  getAdminStats,
  getAllUsers
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);

export default router;
