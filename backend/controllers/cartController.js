import Cart from '../models/Cart.js';
import Food from '../models/Food.js';
import Coupon from '../models/Coupon.js';

// Helper to calculate cart totals based on items
const calculateCartTotals = (items, deliveryFee = 40) => {
  const subtotal = items.reduce((acc, item) => {
    const price = item.food ? item.food.price : 0;
    return acc + (price * item.quantity);
  }, 0);
  
  const gst = Math.round((subtotal * 0.05) * 100) / 100; // 5% GST
  const finalDeliveryFee = subtotal > 500 ? 0 : deliveryFee; // Free delivery above $500/Rs.500
  const total = subtotal + gst + finalDeliveryFee;

  return {
    subtotal,
    deliveryFee: finalDeliveryFee,
    gst,
    total
  };
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.food',
      populate: { path: 'restaurant', select: 'name deliveryFee' }
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const totals = calculateCartTotals(cart.items);

    res.json({
      success: true,
      cart: {
        _id: cart._id,
        items: cart.items,
        ...totals
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
  const { foodId, quantity = 1 } = req.body;
  try {
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if food already in cart
    const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({ food: foodId, quantity: Number(quantity) });
    }

    await cart.save();

    // Populate food details for response
    await cart.populate({
      path: 'items.food',
      populate: { path: 'restaurant', select: 'name deliveryFee' }
    });

    const totals = calculateCartTotals(cart.items);

    res.json({
      success: true,
      cart: {
        _id: cart._id,
        items: cart.items,
        ...totals
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PATCH /api/cart/:foodId
// @access  Private
export const updateCartItem = async (req, res, next) => {
  const { foodId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
  }

  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = Number(quantity);
    await cart.save();

    await cart.populate({
      path: 'items.food',
      populate: { path: 'restaurant', select: 'name deliveryFee' }
    });

    const totals = calculateCartTotals(cart.items);

    res.json({
      success: true,
      cart: {
        _id: cart._id,
        items: cart.items,
        ...totals
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:foodId
// @access  Private
export const removeCartItem = async (req, res, next) => {
  const { foodId } = req.params;
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.food.toString() !== foodId);
    await cart.save();

    await cart.populate({
      path: 'items.food',
      populate: { path: 'restaurant', select: 'name deliveryFee' }
    });

    const totals = calculateCartTotals(cart.items);

    res.json({
      success: true,
      cart: {
        _id: cart._id,
        items: cart.items,
        ...totals
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    } else {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      cart: {
        _id: cart._id,
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        gst: 0,
        total: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Merge guest cart into user cart
// @route   POST /api/cart/merge
// @access  Private
export const mergeCart = async (req, res, next) => {
  const { items } = req.body; // Array of { foodId, quantity }
  try {
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items array required' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    for (const guestItem of items) {
      const { foodId, quantity } = guestItem;
      const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);

      if (itemIndex > -1) {
        // If guest cart has quantity, we can take the max or add them. Let's add them
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        // Verify food exists before inserting
        const foodExists = await Food.exists({ _id: foodId });
        if (foodExists) {
          cart.items.push({ food: foodId, quantity: Number(quantity) });
        }
      }
    }

    await cart.save();

    await cart.populate({
      path: 'items.food',
      populate: { path: 'restaurant', select: 'name deliveryFee' }
    });

    const totals = calculateCartTotals(cart.items);

    res.json({
      success: true,
      cart: {
        _id: cart._id,
        items: cart.items,
        ...totals
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply coupon code
// @route   POST /api/cart/coupon
// @access  Private
export const applyCoupon = async (req, res, next) => {
  const { code } = req.body;
  try {
    const coupon = await Coupon.findOne({ code, active: true });
    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid or inactive coupon code' });
    }

    // Check expiry
    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ success: false, message: 'Coupon code has expired' });
    }

    let cart = await Cart.findOne({ user: req.user._id }).populate('items.food');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const { subtotal } = calculateCartTotals(cart.items);

    if (subtotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value for this coupon is $${coupon.minOrderValue.toFixed(2)}`
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = subtotal * (coupon.discountValue / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discountAmount * 100) / 100
      }
    });
  } catch (error) {
    next(error);
  }
};
