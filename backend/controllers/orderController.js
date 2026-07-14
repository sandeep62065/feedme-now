import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Food from '../models/Food.js';
import Restaurant from '../models/Restaurant.js';
import Coupon from '../models/Coupon.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  const { deliveryAddress, paymentMethod, couponCode } = req.body;

  try {
    // 1. Get the user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.food');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // 2. Group items by restaurant to ensure we check restaurant details
    // For simplicity, we assume single order comes from one restaurant at a time.
    // If cart contains multiple restaurants, we can resolve delivery details from the first item's restaurant.
    const firstItem = cart.items[0];
    const restaurantId = firstItem.food.restaurant;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    // 3. Recalculate subtotal on server based on current database prices (never trust client)
    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const foodItem = await Food.findById(item.food._id);
      if (!foodItem || foodItem.status !== 'available') {
        return res.status(400).json({
          success: false,
          message: `Food item "${item.food.name}" is no longer available.`
        });
      }
      
      const itemPrice = foodItem.price;
      subtotal += itemPrice * item.quantity;

      orderItems.push({
        food: foodItem._id,
        quantity: item.quantity,
        priceAtOrder: itemPrice,
        nameAtOrder: foodItem.name,
        imageAtOrder: foodItem.image
      });
    }

    // 4. Calculate Taxes and Delivery Fee
    const gst = Math.round((subtotal * 0.05) * 100) / 100; // 5% GST
    let deliveryFee = restaurant.deliveryFee || 0;
    if (subtotal > 500) {
      deliveryFee = 0; // Free delivery over 500
    }

    let finalTotal = subtotal + gst + deliveryFee;

    // 5. Apply coupon code if provided
    let appliedDiscount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, active: true });
      if (coupon && (!coupon.expiryDate || new Date() <= new Date(coupon.expiryDate))) {
        if (subtotal >= coupon.minOrderValue) {
          if (coupon.discountType === 'percentage') {
            appliedDiscount = subtotal * (coupon.discountValue / 100);
            if (coupon.maxDiscountAmount && appliedDiscount > coupon.maxDiscountAmount) {
              appliedDiscount = coupon.maxDiscountAmount;
            }
          } else {
            appliedDiscount = coupon.discountValue;
          }
          finalTotal -= appliedDiscount;
        }
      }
    }

    finalTotal = Math.max(0, Math.round(finalTotal * 100) / 100);

    // 6. Create the order
    const order = await Order.create({
      user: req.user._id,
      restaurant: restaurantId,
      items: orderItems,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'Card' ? 'Paid' : 'Pending',
      orderStatus: 'Placed',
      subtotal,
      deliveryFee,
      gst,
      total: finalTotal
    });

    // 7. Clear the user's cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('restaurant', 'name image address')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id)
      .populate('restaurant', 'name image address deliveryTime')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if the order belongs to the user or the user is an admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
