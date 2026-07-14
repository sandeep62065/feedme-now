import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.0 },
  cuisineType: [{ type: String }],
  deliveryTime: { type: String, default: '30-40 mins' },
  deliveryFee: { type: Number, default: 0 },
  address: { type: String, required: true }
}, {
  timestamps: true
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
