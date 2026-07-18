import Order from '../models/Order.js';

export const getAvailableOrders = async (req, res) => {
  // Find orders that are preparing and don't have a delivery partner yet
  const orders = await Order.find({ 
    status: 'preparing',
    deliveryPartnerId: { $exists: false }
  }).sort({ createdAt: 1 }).populate('user', 'name phone');
  res.json({ orders });
};

export const getMyActiveOrder = async (req, res) => {
  const order = await Order.findOne({ 
    deliveryPartnerId: req.user._id,
    status: 'out_for_delivery'
  }).populate('user', 'name phone');
  res.json({ order });
};

export const acceptOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  
  if (order.deliveryPartnerId) {
    return res.status(400).json({ message: 'Order already accepted by another partner' });
  }

  order.deliveryPartnerId = req.user._id;
  order.status = 'out_for_delivery';
  order.deliveryPartner = {
    name: req.user.name,
    phone: req.user.phone,
    vehicle: req.user.vehicle,
    location: { lat: 19.0760, lng: 72.8777 } // Initial mock fallback (e.g. Restaurant location)
  };
  order.eta = new Date(Date.now() + 20 * 60000).toISOString();
  
  await order.save();

  const io = req.app.get('io');
  if (io) {
    io.to(`order_${order._id}`).emit('orderStatusUpdated', order);
  }

  res.json({ order });
};

export const markDelivered = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, deliveryPartnerId: req.user._id });
  if (!order) return res.status(404).json({ message: 'Order not found or not assigned to you' });

  order.status = 'delivered';
  order.eta = new Date().toISOString();
  await order.save();

  const io = req.app.get('io');
  if (io) {
    io.to(`order_${order._id}`).emit('orderStatusUpdated', order);
  }

  res.json({ order });
};
