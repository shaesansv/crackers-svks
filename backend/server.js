const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import Models
const Product = require('./models/Product');
const Order = require('./models/Order');
const Category = require('./models/Category');
const Settings = require('./models/Settings');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

// Import Routes
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

// Use Routes
app.use('/api', adminRoutes);
app.use('/api', userRoutes);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sargurucrackers';
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedDatabase();
  })
  .catch(err => console.log('MongoDB connection error:', err));

// Seeding logic
async function seedDatabase() {
  try {
    // 0. Seed Admin Account
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('Seeding default admin user...');
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'adminpassword', 10);
      const defaultAdmin = new Admin({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: hashedPassword
      });
      await defaultAdmin.save();
    }

    // 1. Seed Settings
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      console.log('Seeding default settings...');
      const defaultSettings = new Settings({
        minOrderValue: 3000,
        merchantPhone: '917868077818',
        storeAddress: '3/1321 Paraipatti, Sivakasi, Tamil Nadu'
      });
      await defaultSettings.save();
    }

    // 2. Seed Categories
    const categoriesCount = await Category.countDocuments();
    if (categoriesCount === 0) {
      console.log('Seeding initial categories...');
      const defaultCategories = [
        { id: 'sparklers', code: '140', name: 'SPARKLERS (80% DISCOUNT)', discountText: '80% DISCOUNT', imageType: 'sparkler' },
        { id: 'flowerpots', code: '100', name: 'FLOWER POTS (80% DISCOUNT)', discountText: '80% DISCOUNT', imageType: 'pot' },
        { id: 'chakkars', code: '110', name: 'GROUND CHAKKARS (80% DISCOUNT)', discountText: '80% DISCOUNT', imageType: 'chakkar' },
        { id: 'bombs', code: '170', name: 'BOMBS & SOUND CRACKERS (80% DISCOUNT)', discountText: '80% DISCOUNT', imageType: 'bomb' },
        { id: 'kids', code: '130', name: 'KIDS SPECIAL (80% DISCOUNT)', discountText: '80% DISCOUNT', imageType: 'kids' },
        { id: 'garlands', code: '150', name: 'SOUND GARLANDS (80% DISCOUNT)', discountText: '80% DISCOUNT', imageType: 'garland' },
        { id: 'skyshots', code: '120', name: 'SKYSHOT (80% DISCOUNT)', discountText: '80% DISCOUNT', imageType: 'rocket' },
        { id: 'fountains', code: '160', name: 'FANCY FOUNTAINS (80% DISCOUNT)', discountText: '80% DISCOUNT', imageType: 'pot' }
      ];
      await Category.insertMany(defaultCategories);
    }

    // 3. Seed Products
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Seeding initial products...');
      const defaultProducts = [
        // Sparklers
        { name: '7 cm Sparklers (10 Pcs)', unit: 'Pkt', actualPrice: 100, discountPrice: 20, imageType: 'sparkler' },
        { name: '10 cm Sparklers (10 Pcs)', unit: 'Pkt', actualPrice: 150, discountPrice: 30, imageType: 'sparkler' },
        { name: '12 cm Sparklers (10 Pcs)', unit: 'Pkt', actualPrice: 200, discountPrice: 40, imageType: 'sparkler' },
        { name: '15 cm Sparklers (10 Pcs)', unit: 'Pkt', actualPrice: 300, discountPrice: 60, imageType: 'sparkler' },
        { name: '30 cm Sparklers (5 Pcs)', unit: 'Pkt', actualPrice: 450, discountPrice: 90, imageType: 'sparkler' },
        { name: '50 cm Sparklers (5 Pcs)', unit: 'Pkt', actualPrice: 600, discountPrice: 120, imageType: 'sparkler' },
        // Pots
        { name: 'Flower Pots Small (10 Pcs)', unit: 'Box', actualPrice: 200, discountPrice: 40, imageType: 'pot' },
        { name: 'Flower Pots Medium (10 Pcs)', unit: 'Box', actualPrice: 300, discountPrice: 60, imageType: 'pot' },
        { name: 'Flower Pots Large (10 Pcs)', unit: 'Box', actualPrice: 400, discountPrice: 80, imageType: 'pot' },
        { name: 'Flower Pots Giant (10 Pcs)', unit: 'Box', actualPrice: 500, discountPrice: 100, imageType: 'pot' },
        { name: 'Flower Pots Deluxe (10 Pcs)', unit: 'Box', actualPrice: 700, discountPrice: 140, imageType: 'pot' },
        { name: 'Flower Pots Super Deluxe (10 Pcs)', unit: 'Box', actualPrice: 900, discountPrice: 180, imageType: 'pot' },
        // Chakkars
        { name: 'Ground Chakkar Small (10 Pcs)', unit: 'Box', actualPrice: 150, discountPrice: 30, imageType: 'chakkar' },
        { name: 'Ground Chakkar Medium (10 Pcs)', unit: 'Box', actualPrice: 250, discountPrice: 50, imageType: 'chakkar' },
        { name: 'Ground Chakkar Large (10 Pcs)', unit: 'Box', actualPrice: 350, discountPrice: 70, imageType: 'chakkar' },
        { name: 'Ground Chakkar Special (10 Pcs)', unit: 'Box', actualPrice: 450, discountPrice: 90, imageType: 'chakkar' },
        { name: 'Ground Chakkar Deluxe (10 Pcs)', unit: 'Box', actualPrice: 600, discountPrice: 120, imageType: 'chakkar' },
        // Bombs
        { name: '2-3/4" Laxmi Brand (1 Box)', unit: 'Box', actualPrice: 100, discountPrice: 20, imageType: 'bomb' },
        { name: '3-1/2" Laxmi Brand (1 Box)', unit: 'Box', actualPrice: 150, discountPrice: 30, imageType: 'bomb' },
        { name: '4" Laxmi Bomb (1 Box)', unit: 'Box', actualPrice: 200, discountPrice: 40, imageType: 'bomb' },
        { name: '5" Laxmi Bomb (1 Box)', unit: 'Box', actualPrice: 300, discountPrice: 60, imageType: 'bomb' },
        { name: '2 Sound Bomb (1 Box)', unit: 'Box', actualPrice: 150, discountPrice: 30, imageType: 'bomb' },
        { name: '3 Sound Bomb (1 Box)', unit: 'Box', actualPrice: 200, discountPrice: 40, imageType: 'bomb' },
        // Kids
        { name: 'Magic Pops (50 Pcs)', unit: 'Pkt', actualPrice: 100, discountPrice: 20, imageType: 'kids' },
        { name: 'Snake Crackers (10 Pcs)', unit: 'Box', actualPrice: 150, discountPrice: 30, imageType: 'kids' },
        { name: 'Pencil 7" (10 Pcs)', unit: 'Box', actualPrice: 200, discountPrice: 40, imageType: 'kids' },
        { name: 'Pencil 10" (10 Pcs)', unit: 'Box', actualPrice: 300, discountPrice: 60, imageType: 'kids' },
        { name: 'Color Smoke (1 Box)', unit: 'Box', actualPrice: 500, discountPrice: 100, imageType: 'kids' },
        // Garlands
        { name: 'Garland 100 Shells (1 Box)', unit: 'Box', actualPrice: 300, discountPrice: 60, imageType: 'garland' },
        { name: 'Garland 1000 Shells (1 Box)', unit: 'Box', actualPrice: 1500, discountPrice: 300, imageType: 'garland' },
        { name: 'Garland 2000 Shells (1 Box)', unit: 'Box', actualPrice: 2800, discountPrice: 560, imageType: 'garland' },
        { name: 'Garland 5000 Shells (1 Box)', unit: 'Box', actualPrice: 6000, discountPrice: 1200, imageType: 'garland' },
        { name: 'Garland 10000 Shells (1 Box)', unit: 'Box', actualPrice: 11000, discountPrice: 2200, imageType: 'garland' }
      ];
      await Product.insertMany(defaultProducts);
      console.log('Seeding complete. Seeded ' + defaultProducts.length + ' products.');
    }

    // 4. Seed Orders
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log('Seeding initial mock orders...');
      const mockOrders = [
        {
          orderId: '00023',
          customerName: 'Shaesan 7',
          customerEmail: 'shaesan7@gmail.com',
          customerPhone: '8248374733',
          items: [{ name: 'Flower pot delux', qty: 2, price: 1200 }],
          total: 2400,
          packingCharge: 72,
          overallTotal: 2472,
          approved: 'Pending',
          holdStatus: '2d Hold',
          date: '28/07/2026'
        },
        {
          orderId: '00019',
          customerName: 'Shaesan 7',
          customerEmail: 'shaesan7@gmail.com',
          customerPhone: '6369203683',
          items: [
            { name: '10 cm Sparklers (10 Pcs)', qty: 4, price: 500 },
            { name: 'Flower Pots Giant (10 Pcs)', qty: 2, price: 643 }
          ],
          total: 3286,
          packingCharge: 98,
          overallTotal: 3384,
          approved: 'Approved',
          holdStatus: '2d Hold',
          date: '24/07/2026'
        },
        {
          orderId: '00018',
          customerName: 'Shaesan',
          customerEmail: 'shaesan@gmail.com',
          customerPhone: '9787791449',
          items: [{ name: 'Flower pot delux', qty: 3, price: 3420 }],
          total: 10260,
          packingCharge: 307.8,
          overallTotal: 10568,
          approved: 'Approved',
          holdStatus: '',
          date: '29/07/2026'
        },
        {
          orderId: '00017',
          customerName: 'Shaesan 7',
          customerEmail: 'shaesan7@gmail.com',
          customerPhone: '6543257654',
          items: [{ name: 'Ground Chakkar Small', qty: 2, price: 2086 }],
          total: 4172,
          packingCharge: 125,
          overallTotal: 4297,
          approved: 'Packed',
          holdStatus: '',
          date: '22/07/2026'
        },
        {
          orderId: '00016',
          customerName: 'Shaesan 7',
          customerEmail: 'shaesan7@gmail.com',
          customerPhone: '8248374733',
          items: [{ name: 'Pencil 10"', qty: 5, price: 2198 }],
          total: 10990,
          packingCharge: 329.7,
          overallTotal: 11320,
          approved: 'On Hold',
          holdStatus: '2d Hold',
          date: '30/06/2026'
        }
      ];
      await Order.insertMany(mockOrders);
      console.log('Seeding mock orders complete.');
    }
  } catch (err) {
    console.error('Seeding failed:', err);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
