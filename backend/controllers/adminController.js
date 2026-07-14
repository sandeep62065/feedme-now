import Order from '../models/Order.js';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';

// @desc    Get all orders (admin only)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin only)
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  const { id } = req.params;
  const { orderStatus, paymentStatus } = req.body;

  const validStatuses = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  if (orderStatus && !validStatuses.includes(orderStatus)) {
    return res.status(400).json({ success: false, message: 'Invalid order status' });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    // Automatically set payment status to Paid if Delivered
    if (orderStatus === 'Delivered' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'Paid';
    }

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${order.orderStatus}`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Stats & dashboard summary (admin only)
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalRestaurants = await Restaurant.countDocuments();
    const totalFoods = await Food.countDocuments();
    
    const orders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const totalOrders = orders.length;

    const revenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);

    // Group sales by month / day (mocking date grouping for charts)
    // We will do a basic aggregation of orders by date to populate the admin charts
    const salesOverTime = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$total" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalRestaurants,
        totalFoods,
        totalOrders,
        totalRevenue: Math.round(revenue * 100) / 100
      },
      salesOverTime
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'customer' }).select('-password');
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};
