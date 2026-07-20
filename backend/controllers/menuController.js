import MenuItem from '../models/MenuItem.js';
import { menuItems } from '../data/menuItems.js';

/**
 * GET /api/menu
 * Optional query: ?category=Burgers
 */
export const getMenu = async (req, res) => {
  const filter = { isAvailable: true };
  if (req.query.category) {
    const escapedCategory = req.query.category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.category = { $regex: new RegExp(`^${escapedCategory}$`, 'i') };
  }
  
  // Auto-seed if empty (fixes Vercel serverless environment)
  const count = await MenuItem.countDocuments();
  if (count === 0) {
    console.log('Menu is empty, auto-seeding from controller...');
    await MenuItem.insertMany(menuItems);
  }

  const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
  res.json({ items });
};

/**
 * GET /api/menu/search?q=
 * Partial-word regex search across name, description, category.
 */
export const searchMenu = async (req, res) => {
  const q = req.query.q?.trim();
  if (!q) {
    return res.json({ items: [] });
  }
  const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedQ, 'i');
  const items = await MenuItem.find({
    isAvailable: true,
    $or: [{ name: regex }, { description: regex }, { category: regex }, { tags: regex }],
  }).limit(30);
  res.json({ items });
};

/**
 * GET /api/menu/categories
 * Returns distinct categories of available items.
 */
export const getCategories = async (req, res) => {
  const categories = await MenuItem.distinct('category', { isAvailable: true });
  res.json({ categories: categories.sort() });
};

/**
 * GET /api/menu/:id
 */
export const getMenuItem = async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Menu item not found.' });
  res.json({ item });
};

/**
 * POST /api/menu   (admin only)
 */
export const createMenuItem = async (req, res) => {
  const { name, description, price, category, image, isVeg, isAvailable, tags } = req.body;
  if (!name || price == null || !category) {
    return res.status(400).json({ message: 'name, price, and category are required.' });
  }
  const item = await MenuItem.create({ name, description, price, category, image, isVeg, isAvailable, tags });
  res.status(201).json({ item });
};

/**
 * PUT /api/menu/:id   (admin only)
 */
export const updateMenuItem = async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ message: 'Menu item not found.' });
  res.json({ item });
};

/**
 * DELETE /api/menu/:id   (admin only)
 */
export const deleteMenuItem = async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Menu item not found.' });
  res.json({ message: 'Menu item deleted.' });
};
