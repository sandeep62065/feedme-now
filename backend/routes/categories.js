import express from 'express';
import { getCategories, createCategory } from '../controllers/categoryController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, adminOnly, createCategory);

export default router;
