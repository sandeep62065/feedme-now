import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';

/**
 * POST /api/orders   (protected)
 * Re-fetches real prices from DB — never trusts client-supplied prices.
 */
export const placeOrder = async (req, res) => {
  const { items, deliveryAddress, notes } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must contain at least one item.' });
  }
  if (!deliveryAddress?.formattedAddress) {
    return res.status(400).json({ message: 'Delivery address is required.' });
  }

  // Re-validate items and compute real total server-side
  const orderItems = [];
  let totalAmount = 0;

  for (const clientItem of items) {
    const menuItem = await MenuItem.findById(clientItem.menuItemId);
    if (!menuItem) {
      return res.status(400).json({ message: `Menu item not found: ${clientItem.menuItemId}` });
    }
    if (!menuItem.isAvailable) {
      return res.status(400).json({ message: `"${menuItem.name}" is currently unavailable.` });
    }
    const qty = Math.max(1, parseInt(clientItem.quantity) || 1);
    totalAmount += menuItem.price * qty;
    orderItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,        // server-fetched price
      image: menuItem.image,
      quantity: qty,
    });
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount: Math.round(totalAmount * 100) / 100,
    deliveryAddress,
    notes: notes || '',
  });

  res.status(201).json({ order });
};

/**
 * GET /api/orders   (protected — current user's orders)
 */
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ orders });
};

/**
 * GET /api/orders/:id   (protected — owner or admin)
 */
export const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found.' });

  const isOwner = order.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Access denied.' });
  }

  res.json({ order });
};

/**
 * PATCH /api/orders/:id/status   (admin only)
 */
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const valid = ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!valid.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Must be one of: ${valid.join(', ')}` });
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  res.json({ order });
};

/**
 * GET /api/orders/all   (admin only)
 */
export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(200);
  res.json({ orders });
};
