import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true, index: true },
  image: { type: String, default: '' },
  isVeg: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  tags: [{ type: String }],
}, { timestamps: true });

// Text index for search across name, description, category
menuItemSchema.index({ name: 'text', description: 'text', category: 'text' });

export default mongoose.model('MenuItem', menuItemSchema);
