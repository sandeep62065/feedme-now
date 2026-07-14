import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  isVeg: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5 },
  status: {
    type: String,
    enum: ['available', 'out_of_stock'],
    default: 'available'
  }
}, {
  timestamps: true
});

const Food = mongoose.model('Food', foodSchema);
export default Food;
