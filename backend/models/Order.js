import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  // Snapshot fields captured at order time
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: true });

const deliveryAddressSchema = new mongoose.Schema({
  formattedAddress: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number },
  placeId: { type: String },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryAddress: { type: deliveryAddressSchema, required: true },
  status: {
    type: String,
    enum: ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  notes: { type: String, default: '' },
  deliveryPartner: {
    name: { type: String },
    phone: { type: String },
    vehicle: { type: String },
    location: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  eta: { type: String },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
