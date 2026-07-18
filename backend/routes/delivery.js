import express from 'express';
import { protect, deliveryPartnerOnly } from '../middleware/auth.js';
import { getAvailableOrders, getMyActiveOrder, acceptOrder, markDelivered } from '../controllers/deliveryController.js';

const router = express.Router();

router.use(protect, deliveryPartnerOnly);

router.get('/orders/available', getAvailableOrders);
router.get('/orders/active', getMyActiveOrder);
router.post('/orders/:id/accept', acceptOrder);
router.post('/orders/:id/deliver', markDelivered);

export default router;
