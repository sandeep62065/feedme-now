import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
  applyCoupon
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply protect middleware to all cart routes
router.use(protect);

router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.post('/merge', mergeCart);
router.post('/coupon', applyCoupon);

router.route('/:foodId')
  .patch(updateCartItem)
  .delete(removeCartItem);

export default router;
