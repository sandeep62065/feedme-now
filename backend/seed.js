/**
 * Seed script — populates the tastybite DB with sample menu items.
 * Run: npm run seed
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import MenuItem from './models/MenuItem.js';
import User from './models/User.js';

dotenv.config();

const menuItems = [
  // Burgers
  { name: 'Classic Smash Burger', description: 'Double smashed beef patty, American cheese, pickles, special sauce on a brioche bun.', price: 199, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600', isVeg: false, isAvailable: true, tags: ['bestseller', 'beef'] },
  { name: 'Crispy Chicken Burger', description: 'Buttermilk fried chicken thigh, coleslaw, jalapeños, honey sriracha mayo.', price: 179, category: 'Burgers', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600', isVeg: false, isAvailable: true, tags: ['spicy', 'chicken'] },
  { name: 'Mushroom Swiss Veggie Burger', description: 'House-made black bean patty, sautéed mushrooms, Swiss cheese, arugula.', price: 159, category: 'Burgers', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600', isVeg: true, isAvailable: true, tags: ['veg', 'healthy'] },

  // Pizza
  { name: 'Margherita Pizza', description: 'San Marzano tomato base, fresh mozzarella, basil, extra virgin olive oil.', price: 249, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600', isVeg: true, isAvailable: true, tags: ['classic', 'veg'] },
  { name: 'Pepperoni Feast Pizza', description: 'Loaded with crispy pepperoni, mozzarella, roasted red peppers on a thin crust.', price: 299, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600', isVeg: false, isAvailable: true, tags: ['bestseller', 'meat'] },
  { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce, grilled chicken, caramelized onions, cilantro.', price: 279, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', isVeg: false, isAvailable: true, tags: ['bbq', 'chicken'] },

  // Sandwiches
  { name: 'Club Sandwich', description: 'Triple-decker with turkey, bacon, lettuce, tomato, cheddar, mayo on toasted bread.', price: 149, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600', isVeg: false, isAvailable: true, tags: ['classic'] },
  { name: 'Grilled Paneer Wrap', description: 'Spiced paneer tikka, green chutney, onions, bell peppers in a whole wheat tortilla.', price: 129, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600', isVeg: true, isAvailable: true, tags: ['veg', 'wrap'] },

  // Sides
  { name: 'Loaded Cheese Fries', description: 'Thick-cut fries smothered in nacho cheese, jalapeños, sour cream, chives.', price: 99, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600', isVeg: true, isAvailable: true, tags: ['veg', 'indulgent'] },
  { name: 'Onion Rings', description: 'Beer-battered golden onion rings with chipotle dip.', price: 79, category: 'Sides', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600', isVeg: true, isAvailable: true, tags: ['veg', 'crispy'] },
  { name: 'Chicken Wings (6 pcs)', description: 'Choice of buffalo, BBQ, or garlic parmesan. Served with ranch dip.', price: 199, category: 'Sides', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600', isVeg: false, isAvailable: true, tags: ['chicken', 'spicy'] },

  // Drinks
  { name: 'Classic Cola', description: 'Ice-cold Coca-Cola, 330ml.', price: 49, category: 'Drinks', image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=600', isVeg: true, isAvailable: true, tags: ['cold'] },
  { name: 'Fresh Lime Soda', description: 'Freshly squeezed lime, sparkling water, mint. Sweet or salted.', price: 59, category: 'Drinks', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600', isVeg: true, isAvailable: true, tags: ['fresh', 'cold'] },
  { name: 'Mango Lassi', description: 'Thick yogurt blended with Alphonso mango pulp, cardamom.', price: 69, category: 'Drinks', image: 'https://images.unsplash.com/photo-1548625149-720754874769?w=600', isVeg: true, isAvailable: true, tags: ['fresh', 'sweet'] },

  // Desserts
  { name: 'Chocolate Lava Cake', description: 'Warm dark chocolate cake with a molten centre. Served with vanilla ice cream.', price: 119, category: 'Desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600', isVeg: true, isAvailable: true, tags: ['sweet', 'chocolate'] },
  { name: 'Oreo Cheesecake Slice', description: 'Creamy no-bake cheesecake on an Oreo crust, topped with whipped cream.', price: 109, category: 'Desserts', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600', isVeg: true, isAvailable: true, tags: ['sweet', 'cold'] },

  // Indian
  { name: 'Hyderabadi Chicken Biryani', description: 'Aromatic basmati rice cooked with tender chicken pieces, saffron, and traditional spices.', price: 299, category: 'Indian', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600', isVeg: false, isAvailable: true, tags: ['spicy', 'bestseller'] },
  { name: 'Paneer Butter Masala', description: 'Soft paneer cubes simmered in a rich and creamy tomato gravy.', price: 249, category: 'Indian', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=600', isVeg: true, isAvailable: true, tags: ['veg', 'curry'] }
];

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
