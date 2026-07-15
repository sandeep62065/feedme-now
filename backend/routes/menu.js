import express from 'express';
import {
  getMenu,
  searchMenu,
  getCategories,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getMenu);
router.get('/search', searchMenu);
router.get('/categories', getCategories);
router.get('/:id', getMenuItem);

// Admin only
router.post('/', protect, adminOnly, createMenuItem);
router.put('/:id', protect, adminOnly, updateMenuItem);
router.delete('/:id', protect, adminOnly, deleteMenuItem);

export default router;
