import User from '../models/User.js';
import Category from '../models/Category.js';
import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';
import Coupon from '../models/Coupon.js';

const categoriesData = [
  {
    name: 'Pizza',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDojFmq8FIht6GQoCtypZ-sYSPSbhpsfWWL70-6KNw-XnaHaBVmcWpnM6R7Wzkikml8TJey2A7w-RoN0wz7cZBGFGeTrGeI0n1YXtJCkHTwjsM4F-SKSEDcfhJ-cpz92c0LVcrnMbJTeub6CBiEt0UzN-14vraiDqK1iTTPpr8360LlkEH8T5NXY1dMjitnb5DQPCsJA2wsEJ2eIm2TdPsSVfVvSStZa-ijBOa6K9T1ET-ypWrkWszH'
  },
  {
    name: 'Burgers',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzpgqQzT4CwLy9EKof2XvK27XWFGk7V1UtPXtDy1i33FRJvBMQItOHqehddALD1vFlTbZSFHa7nW5PbWZYfB873r1NDAZJc3XmbqxEM7nzF3c-skLYJjNtWxDKUdcDORtwQqj_frbQb1diEDbPzO1U_jH9IV6mLhvg_2HVXKaTX62dj4-yswtVOlcBWnhs_iwIJccRf5xKtgJrpHQ4i1VFaeYEkCF4bqhAp6WrI90sC4Orgpb99Hkm'
  },
  {
    name: 'Biryani',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACODlRVjC_lAS51fr-QnBBpf6z1hMm9oJcotAFXnzNuEBvdIt-f68_OwOIrrJQebyTU8tB9ApQNzsAY-Sx96Af2-oqlDiYOPQzxG26ZDDkKSD7gJ26jpGdW6Azyb0XxabG3Z_zDj6rVic5gnYP7vtg5LnPHrdh3b7Q3WNV9lo8AtLzLXQLVGo9pEhXWRxg6gAyulnoL46CMIp5fB_FPg0dehDfCKjbgRctLBQgTHeidEOk83OPqoFg'
  },
  {
    name: 'Desserts',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3ZVZcWzAuZ272IjVyDOUwYDBjR-QIRGojFxSx8aIUaef_KPCangYoz0CEW_W09shhkMEyfFQu21YQfrEp_BK2hmGd2WTHrM2eY79i15hZg77H2O9ZsWV-NZSsQwNzXd-OXzIg1gQr_pOQQQgVG-SZr25t5QGXuUvOz7aRkfv4T5BPpiFYoyEDbiNuttbahHCWGQue_fLvebmWHmY7itOb9lbvGk-tZG7ff35uxLeNBic2hC5NnvSk'
  }
];

const restaurantsData = [
  {
    name: 'Burger Blast',
    description: 'Gourmet double-stacked burgers, loaded fries, and draft milkshakes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJydZnc2Q8Dcipk6MYYZ864Azr-AvgfcTNeMwiPk0fpfh1E6O0VNF8xRToYONhxTYNarfrFICa7bMaJX8zmqReGBfA9MBdxoK3geJ8qUsvfotK0ihfuC6VS0WTbaohZY8UTJ87LRfc2SjPYhK0-9c1VdG43C5SxkPo5vrFtCf92bCAkcSBzwLSXFBOeVQzBHEr41qD28GtKswBCQz64EqtDo81XhPBQPvl47W3i8XEpParK6PEhArK',
    rating: 4.5,
    cuisineType: ['Burgers', 'Fast Food'],
    deliveryTime: '20-30 mins',
    deliveryFee: 0,
    address: '456 Burger Avenue, Food District'
  },
  {
    name: 'Pizza Paradise',
    description: 'Fresh wood-fired artisan pizza with top-tier mozzarella and basil leaves.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3qAUcITXkYBCysPAPDyYD-1G0_0tjT-4RYqMRZD18inuDtytsbEZl3JRiOXKKVYAC_QURLPOA8W_-qsPKbQedePAsUcQkvkFdPDDVmUafGJswICD_wSJeAdfoe4XniBg7m-cS1iuT3ZMpGEwcV7kXnVPKH0lvMEVHBtGTixjk-oWLZiN3RMrF4s9IGF2SIz29wPUATLbTpbZEU2VzftTdPiGTuCsd4zo_TOffntIIxLm8c2VWZ0G2',
    rating: 4.7,
    cuisineType: ['Pizza', 'Italian'],
    deliveryTime: '25-35 mins',
    deliveryFee: 30,
    address: '789 Pepperoni Street, Little Italy'
  }
];

export const seedOnStartup = async () => {
  try {
    const restaurantCount = await Restaurant.countDocuments();
    if (restaurantCount > 0) {
      console.log('Database already has restaurant data. Skipping auto-seeding.');
      return;
    }

    console.log('Database is empty. Seeding defaults on startup...');

    // 1. Double check / seed users
    const userExists = await User.exists({ email: 'user@freshbite.com' });
    if (!userExists) {
      await User.create({
        name: 'John Doe',
        email: 'user@freshbite.com',
        password: 'user123',
        role: 'customer',
        addresses: [
          {
            street: '123 Maple St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            isDefault: true
          }
        ]
      });
      await User.create({
        name: 'FreshBite Admin',
        email: 'admin@freshbite.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Seeded default admin and customer user credentials.');
    }

    // 2. Seed Categories
    const seededCategories = await Category.insertMany(categoriesData);
    const pizzaCategory = seededCategories.find(c => c.name === 'Pizza');
    const burgerCategory = seededCategories.find(c => c.name === 'Burgers');
    const dessertCategory = seededCategories.find(c => c.name === 'Desserts');
    console.log('Seeded menu cravings categories.');

    // 3. Seed Restaurants
    const seededRestaurants = await Restaurant.insertMany(restaurantsData);
    const burgerBlast = seededRestaurants.find(r => r.name === 'Burger Blast');
    const pizzaParadise = seededRestaurants.find(r => r.name === 'Pizza Paradise');
    console.log('Seeded restaurants.');

    // 4. Seed Foods
    const foodsData = [
      {
        name: 'Cheese Burger',
        description: 'Double beef patty, melting cheddar cheese, fresh lettuce, and toasted brioche bun.',
        price: 199,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoXEgIE2sudcKx8qi0FzWbJgKRGws4lO9Wo6FUEYO9fL8R5oz2B2Ft0uvsFwQhhhueAENBk2_KhqMcDFs5mVAgMGAAOHZy3M2uXYq0eMAkFC9wMUauqbcAcUHIBoLbRB6T9UEOkvhsmP7l3HX5dVRTBT6JhFgVvbxjkflKX_ngoCIjocqM3rhz-IvWVVy7WckTJcWJCWU0wRhv8Oeh8XGrrWE4B-gAduza-1F_s8rNzZMgk97KG9_l',
        category: burgerCategory._id,
        restaurant: burgerBlast._id,
        isVeg: false,
        rating: 4.6
      },
      {
        name: 'French Fries',
        description: 'Crispy golden french fries tossed with sea salt and fresh herbs.',
        price: 99,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqR6xlLANMGD9krBF6V-8ECOhIP9zPCSYSFXh-RLxHKFZmtj9TF563TM6Dp0-t_He3TDCwVEhzmxvyGDCBJDQPQSik8PUuxQV0i3j1UIJDB6pBWEwU5erhcl8ExdKP9M87UFMsObtlBqxgRnfXGIz4zSmS3zaBX-rf7xz0wMbqzkxzxtU-NnOR-MyNYNu0ApqqvQev6KcMV2P7K93OA3E5dtykIJa9LPbk0GXc-yotn3NZ4ZLE8k6s',
        category: burgerCategory._id,
        restaurant: burgerBlast._id,
        isVeg: true,
        rating: 4.2
      },
      {
        name: 'Mozzarella Sticks',
        description: 'Gooey melted mozzarella cheese sticks served with a side of marinara sauce.',
        price: 149,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCikClZ_rmG-ZHCH3gW_N8bjJivoyYVGIR4EuwTjiy5T0oZSTTLon--htnO19-p8Wb76Hwo-8ugyu7XApSq0Hjn7bdPmDZkNU4QfpDXYmdd_dj93ld7eZDJI2Sxi5EmIMNwLUT4fzuQyAuRzHU6n58QlbyQc4hp-wMNWzq-7uIEV4Pk1CE2GrEDm-EZCcBkuNutLTrRlxni0n7_eWDy3DQkFwV9_VSTgPDzUNx4LKLVPPzvIDQRJtQ4',
        category: burgerCategory._id,
        restaurant: burgerBlast._id,
        isVeg: true,
        rating: 4.4
      },
      {
        name: 'Pepperoni Pizza',
        description: 'Rich tomato sauce, mozzarella cheese, and spicy sliced pepperoni.',
        price: 349,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3qAUcITXkYBCysPAPDyYD-1G0_0tjT-4RYqMRZD18inuDtytsbEZl3JRiOXKKVYAC_QURLPOA8W_-qsPKbQedePAsUcQkvkFdPDDVmUafGJswICD_wSJeAdfoe4XniBg7m-cS1iuT3ZMpGEwcV7kXnVPKH0lvMEVHBtGTixjk-oWLZiN3RMrF4s9IGF2SIz29wPUATLbTpbZEU2VzftTdPiGTuCsd4zo_TOffntIIxLm8c2VWZ0G2',
        category: pizzaCategory._id,
        restaurant: pizzaParadise._id,
        isVeg: false,
        rating: 4.8
      },
      {
        name: 'Margherita Pizza',
        description: 'Classic combination of house tomato sauce, fresh buffalo mozzarella, and fresh basil.',
        price: 249,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDojFmq8FIht6GQoCtypZ-sYSPSbhpsfWWL70-6KNw-XnaHaBVmcWpnM6R7Wzkikml8TJey2A7w-RoN0wz7cZBGFGeTrGeI0n1YXtJCkHTwjsM4F-SKSEDcfhJ-cpz92c0LVcrnMbJTeub6CBiEt0UzN-14vraiDqK1iTTPpr8360LlkEH8T5NXY1dMjitnb5DQPCsJA2wsEJ2eIm2TdPsSVfVvSStZa-ijBOa6K9T1ET-ypWrkWszH',
        category: pizzaCategory._id,
        restaurant: pizzaParadise._id,
        isVeg: true,
        rating: 4.5
      },
      {
        name: 'Chocolate Lava Cake',
        description: 'Molten liquid dark chocolate center with warm vanilla bean cake crust.',
        price: 129,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3ZVZcWzAuZ272IjVyDOUwYDBjR-QIRGojFxSx8aIUaef_KPCangYoz0CEW_W09shhkMEyfFQu21YQfrEp_BK2hmGd2WTHrM2eY79i15hZg77H2O9ZsWV-NZSsQwNzXd-OXzIg1gQr_pOQQQgVG-SZr25t5QGXuUvOz7aRkfv4T5BPpiFYoyEDbiNuttbahHCWGQue_fLvebmWHmY7itOb9lbvGk-tZG7ff35uxLeNBic2hC5NnvSk',
        category: dessertCategory._id,
        restaurant: burgerBlast._id,
        isVeg: true,
        rating: 4.7
      }
    ];

    await Food.insertMany(foodsData);
    console.log('Seeded foods menu items.');

    // 5. Seed Coupons
    const couponsData = [
      {
        code: 'FRESH50',
        discountType: 'percentage',
        discountValue: 50,
        minOrderValue: 200,
        maxDiscountAmount: 150,
        active: true,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        code: 'BITE100',
        discountType: 'flat',
        discountValue: 100,
        minOrderValue: 300,
        active: true,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ];

    await Coupon.insertMany(couponsData);
    console.log('Seeded promo discount coupons.');
    console.log('Auto-seeding process completed successfully!');
  } catch (err) {
    console.error('Error during auto-seeding:', err);
  }
};
