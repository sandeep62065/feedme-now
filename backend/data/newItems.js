export const newItems = [
  // Burgers
  { name: 'Classic Smash Burger', description: 'Double smashed beef patty, American cheese, pickles.', price: 199, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600', isVeg: false, isAvailable: true, tags: ['seed'] },
  { name: 'Crispy Chicken Burger', description: 'Buttermilk fried chicken thigh, coleslaw, jalapeños.', price: 179, category: 'Burgers', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600', isVeg: false, isAvailable: true, tags: ['seed'] },
  { name: 'Mushroom Swiss Veggie Burger', description: 'House-made black bean patty, sautéed mushrooms.', price: 159, category: 'Burgers', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Spicy Paneer Burger', description: 'Crunchy paneer patty with spicy mayo and lettuce.', price: 149, category: 'Burgers', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Double Cheese Overload', description: 'Triple cheese blend on a juicy chicken patty.', price: 229, category: 'Burgers', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600', isVeg: false, isAvailable: true, tags: ['seed'] },

  // Pizza
  { name: 'Margherita Pizza', description: 'San Marzano tomato base, fresh mozzarella, basil.', price: 249, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Pepperoni Feast Pizza', description: 'Loaded with crispy pepperoni, mozzarella.', price: 299, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600', isVeg: false, isAvailable: true, tags: ['seed'] },
  { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce, grilled chicken, caramelized onions.', price: 279, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', isVeg: false, isAvailable: true, tags: ['seed'] },
  { name: 'Veg Supreme Pizza', description: 'Onions, capsicum, mushroom, tomato, jalapeños.', price: 259, category: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Four Cheese Pizza', description: 'Mozzarella, Cheddar, Parmesan, and Gouda blend.', price: 319, category: 'Pizza', image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6fcbe?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },

  // Sandwiches
  { name: 'Club Sandwich', description: 'Triple-decker with turkey, bacon, lettuce, tomato.', price: 149, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600', isVeg: false, isAvailable: true, tags: ['seed'] },
  { name: 'Grilled Paneer Wrap', description: 'Spiced paneer tikka, green chutney, onions.', price: 129, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Chicken Tikka Sandwich', description: 'Creamy chicken tikka stuffed in toasted bread.', price: 139, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?w=600', isVeg: false, isAvailable: true, tags: ['seed'] },
  { name: 'Bombay Masala Toast', description: 'Spicy potato filling, veggies, and green chutney.', price: 89, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Egg & Mayo Sandwich', description: 'Boiled eggs mixed with creamy mayo and black pepper.', price: 99, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600', isVeg: false, isAvailable: true, tags: ['seed'] },

  // Sides
  { name: 'Loaded Cheese Fries', description: 'Thick-cut fries smothered in nacho cheese, jalapeños.', price: 99, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Onion Rings', description: 'Beer-battered golden onion rings with chipotle dip.', price: 79, category: 'Sides', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Chicken Wings (6 pcs)', description: 'Choice of buffalo, BBQ, or garlic parmesan.', price: 199, category: 'Sides', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600', isVeg: false, isAvailable: true, tags: ['seed'] },
  { name: 'Garlic Breadsticks', description: 'Freshly baked breadsticks brushed with garlic butter.', price: 89, category: 'Sides', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Potato Wedges', description: 'Crispy seasoned thick potato wedges with herb dip.', price: 109, category: 'Sides', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },

  // Drinks
  { name: 'Classic Cola', description: 'Ice-cold Coca-Cola, 330ml.', price: 49, category: 'Drinks', image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Fresh Lime Soda', description: 'Freshly squeezed lime, sparkling water, mint.', price: 59, category: 'Drinks', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Mango Lassi', description: 'Thick yogurt blended with Alphonso mango pulp.', price: 69, category: 'Drinks', image: 'https://images.unsplash.com/photo-1548625149-720754874769?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Cold Coffee', description: 'Creamy blended cold coffee with vanilla ice cream.', price: 129, category: 'Drinks', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Virgin Mojito', description: 'Refreshing mint and lemon mocktail.', price: 99, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },

  // Desserts
  { name: 'Chocolate Lava Cake', description: 'Warm dark chocolate cake with a molten centre.', price: 119, category: 'Desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Oreo Cheesecake Slice', description: 'Creamy no-bake cheesecake on an Oreo crust.', price: 109, category: 'Desserts', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Gulab Jamun (2 pcs)', description: 'Soft, melt-in-mouth Indian sweet dipped in sugar syrup.', price: 69, category: 'Desserts', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Red Velvet Pastry', description: 'Classic red velvet layered with cream cheese frosting.', price: 129, category: 'Desserts', image: 'https://images.unsplash.com/photo-1616541823729-00a7bc000ce8?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Brownie with Ice Cream', description: 'Fudgy walnut brownie served with vanilla scoop.', price: 149, category: 'Desserts', image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },

  // Indian
  { name: 'Hyderabadi Chicken Biryani', description: 'Aromatic basmati rice cooked with tender chicken pieces.', price: 299, category: 'Indian', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600', isVeg: false, isAvailable: true, tags: ['seed'] },
  { name: 'Paneer Butter Masala', description: 'Soft paneer cubes simmered in a rich tomato gravy.', price: 249, category: 'Indian', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Butter Chicken', description: 'Classic creamy and mildly sweet chicken curry.', price: 279, category: 'Indian', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b6ae398?w=600', isVeg: false, isAvailable: true, tags: ['seed'] },
  { name: 'Dal Makhani', description: 'Slow-cooked black lentils with cream and butter.', price: 199, category: 'Indian', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Garlic Naan', description: 'Tandoori flatbread topped with minced garlic and butter.', price: 49, category: 'Indian', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },

  // Momos
  { name: 'Steamed Veg Momos', description: 'Classic Tibetan style dumplings stuffed with veggies.', price: 89, category: 'Momos', image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Chicken Fried Momos', description: 'Crispy fried dumplings stuffed with minced chicken.', price: 119, category: 'Momos', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600', isVeg: false, isAvailable: true, tags: ['seed'] },
  { name: 'Paneer Kurkure Momos', description: 'Crunchy breaded momos stuffed with spiced paneer.', price: 139, category: 'Momos', image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Tandoori Chicken Momos', description: 'Momos marinated in tandoori masala and roasted.', price: 149, category: 'Momos', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600', isVeg: false, isAvailable: true, tags: ['seed'] },
  { name: 'Chilli Veg Momos', description: 'Tossed in spicy Chinese gravy with bell peppers.', price: 129, category: 'Momos', image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },

  // Rolls
  { name: 'Chicken Kathi Roll', description: 'Juicy chicken tikka wrapped in a flaky paratha.', price: 119, category: 'Rolls', image: 'https://images.unsplash.com/photo-1565557612262-1249219bb442?w=600', isVeg: false, isAvailable: true, tags: ['seed'] },
  { name: 'Paneer Tikka Roll', description: 'Spiced paneer wrapped with mint chutney and onions.', price: 109, category: 'Rolls', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600', isVeg: true, isAvailable: true, tags: ['seed'] },
  { name: 'Double Egg Roll', description: 'Classic street style double egg paratha roll.', price: 79, category: 'Rolls', image: 'https://images.unsplash.com/photo-1565557612262-1249219bb442?w=600', isVeg: false, isAvailable: true, tags: ['seed'] },
  { name: 'Mutton Seekh Roll', description: 'Juicy mutton seekh kebab wrapped in a soft roomali roti.', price: 169, category: 'Rolls', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600', isVeg: false, isAvailable: true, tags: ['seed'] },
  { name: 'Soya Chaap Roll', description: 'Tandoori malai soya chaap wrapped with creamy sauces.', price: 119, category: 'Rolls', image: 'https://images.unsplash.com/photo-1565557612262-1249219bb442?w=600', isVeg: true, isAvailable: true, tags: ['seed'] }
];
