import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  quantity: { type: Number, required: true },
  priceAtOrder: { type: Number, required: true },
  nameAtOrder: { type: String, required: true },
  imageAtOrder: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: [orderItemSchema],
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['COD', 'Card']
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Placed'
  },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  gst: { type: Number, required: true },
  total: { type: Number, required: true }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
