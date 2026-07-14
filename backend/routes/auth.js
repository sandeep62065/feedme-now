import express from 'express';
import { body } from 'express-validator';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  addAddress,
  deleteAddress
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty().trim(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    validateRequest
  ],
  registerUser
);

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is required').notEmpty(),
    validateRequest
  ],
  loginUser
);

router.post('/logout', protect, logoutUser);
router.get('/me', protect, getUserProfile);

router.post(
  '/me/address',
  protect,
  [
    body('street', 'Street is required').notEmpty().trim(),
    body('city', 'City is required').notEmpty().trim(),
    body('state', 'State is required').notEmpty().trim(),
    body('zipCode', 'Zip code is required').notEmpty().trim(),
    validateRequest
  ],
  addAddress
);

router.delete('/me/address/:addressId', protect, deleteAddress);

export default router;
