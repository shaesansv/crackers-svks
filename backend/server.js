const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dyd2rwp5t',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789012345',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_cloudinary_api_secret'
});

// Multer memory storage setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to upload file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'sarguru-crackers' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sargurucrackers';
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedDatabase();
  })
  .catch(err => console.log('MongoDB connection error:', err));

// --- Database Schemas ---

// 1. Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  actualPrice: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  imageType: { type: String, required: true },
  imageUrl: { type: String }
}, { timestamps: true });

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Product = mongoose.model('Product', productSchema);

// 2. Order Schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  customerPhone: { type: String, required: true },
  items: [{
    name: String,
    qty: Number,
    price: Number
  }],
  total: { type: Number, required: true },
  packingCharge: { type: Number, default: 0 },
  overallTotal: { type: Number, required: true },
  approved: { type: String, enum: ['Pending', 'Approved', 'Packed', 'On Hold'], default: 'Pending' },
  holdStatus: { type: String, default: '' },
  date: { type: String, required: true }
}, { timestamps: true });

orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Order = mongoose.model('Order', orderSchema);

// Admin Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized access. Token missing.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sarguru_jwt_secret_key_2026');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Seeding logic
async function seedDatabase() {
  try {
    // 1. Seed Products
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

    // 2. Seed Orders (to populate the Orders tab with mock data from user's screen)
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

// ================= API ROUTES =================

// 1. Admin Login API
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const envUsername = process.env.ADMIN_USERNAME || 'admin';
  const envPassword = process.env.ADMIN_PASSWORD || 'adminpassword';

  if (username === envUsername && password === envPassword) {
    const token = jwt.sign(
      { role: 'admin', username },
      process.env.JWT_SECRET || 'sarguru_jwt_secret_key_2026',
      { expiresIn: '7d' }
    );
    return res.json({ success: true, token });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// 2. GET all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving products', error: err.message });
  }
});

// 3. POST create new product (admin required)
app.post('/api/products', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, unit, actualPrice, discountPrice, imageType } = req.body;
    let imageUrl = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const newProduct = new Product({
      name,
      unit,
      actualPrice: Number(actualPrice),
      discountPrice: Number(discountPrice),
      imageType,
      imageUrl
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
});

// 4. PUT update product (admin required)
app.put('/api/products/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit, actualPrice, discountPrice, imageType } = req.body;
    
    const updateData = {
      name,
      unit,
      actualPrice: Number(actualPrice),
      discountPrice: Number(discountPrice),
      imageType
    };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.imageUrl = result.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
});

// 5. DELETE product (admin required)
app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
});

// 6. GET all orders (admin required)
app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving orders', error: err.message });
  }
});

// 7. POST create new order (public checkout)
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, items, total, packingCharge, overallTotal } = req.body;
    
    // Auto-generate order ID
    const count = await Order.countDocuments();
    const orderId = String(count + 1).padStart(5, '0');
    
    // Today's date formatted as DD/MM/YYYY
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const formattedDate = `${dd}/${mm}/${yyyy}`;

    const newOrder = new Order({
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      items,
      total: Number(total),
      packingCharge: Number(packingCharge),
      overallTotal: Number(overallTotal),
      approved: 'Pending',
      holdStatus: '',
      date: formattedDate
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
});

// 8. PUT update order approval status (admin required)
app.put('/api/orders/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { approved, holdStatus } = req.body;
    
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { approved, holdStatus },
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order', error: err.message });
  }
});

// 9. DELETE order (admin required)
app.delete('/api/orders/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting order', error: err.message });
  }
});

// 10. GET customer analytics list (admin required)
app.get('/api/customers', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find();
    const customerMap = {};
    
    orders.forEach(order => {
      const phone = order.customerPhone;
      if (!customerMap[phone]) {
        customerMap[phone] = {
          name: order.customerName,
          phone: phone,
          location: 'Dindigul, Tamil Nadu', // Default mock location to match screenshot
          orders: 0,
          totalSpent: 0,
          lastOrder: order.date
        };
      }
      
      customerMap[phone].orders += 1;
      customerMap[phone].totalSpent += order.total;
      customerMap[phone].lastOrder = order.date;
    });
    
    const customers = Object.values(customerMap);
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving customers', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
