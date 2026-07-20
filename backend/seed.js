/**
 * Seed script — populates the tastybite DB with sample menu items.
 * Run: npm run seed
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import MenuItem from './models/MenuItem.js';
import User from './models/User.js';

dotenv.config();

import { menuItems } from './data/menuItems.js';

const adminUser = {
  name: 'TastyBite Admin',
  email: 'admin@tastybite.com',
  password: 'admin123',
  role: 'admin',
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await MenuItem.deleteMany({});
    await User.deleteMany({ email: adminUser.email });

    // Insert menu items
    const inserted = await MenuItem.insertMany(menuItems);
    console.log(`✅ Inserted ${inserted.length} menu items`);

    // Create admin user
    const admin = await User.create(adminUser);
    console.log(`✅ Admin user created: ${admin.email} (password: admin123)`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
