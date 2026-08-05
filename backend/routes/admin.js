const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Models
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Settings = require('../models/Settings');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Middleware
const authMiddleware = require('../middleware/auth');

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

// 1. Admin Login API
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { role: 'admin', username: admin.username, id: admin._id },
      process.env.JWT_SECRET || 'sarguru_jwt_secret_key_2026',
      { expiresIn: '7d' }
    );
    return res.json({ success: true, token });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error during authentication', error: err.message });
  }
});

// 2. POST create new product (admin required)
router.post('/products', authMiddleware, upload.single('image'), async (req, res) => {
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

// 3. PUT update product (admin required)
router.put('/products/:id', authMiddleware, upload.single('image'), async (req, res) => {
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

// 4. DELETE product (admin required)
router.delete('/products/:id', authMiddleware, async (req, res) => {
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

// 5. GET all orders (admin required)
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving orders', error: err.message });
  }
});

// 6. PUT update order approval status (admin required)
router.put('/orders/:id', authMiddleware, async (req, res) => {
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

// 7. DELETE order (admin required)
router.delete('/orders/:id', authMiddleware, async (req, res) => {
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

// 8. GET customer analytics list (admin required)
router.get('/customers', authMiddleware, async (req, res) => {
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

// 9. POST create category (admin required)
router.post('/categories', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // Generate id (slug) from name
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if category already exists
    const existing = await Category.findOne({ id });
    if (existing) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    // Generate Code: find max code and add 10
    const categories = await Category.find();
    let maxCode = 90;
    categories.forEach(c => {
      const val = parseInt(c.code, 10);
      if (!isNaN(val) && val > maxCode) {
        maxCode = val;
      }
    });
    const code = String(maxCode + 10);

    let imageUrl = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const imageType = id;

    const newCategory = new Category({
      id,
      code,
      name,
      imageType,
      imageUrl
    });

    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error creating category', error: err.message });
  }
});

// 10. PUT update category (admin required)
router.put('/categories/:uid', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { uid } = req.params;
    const { name } = req.body;

    const category = await Category.findById(uid);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) {
      category.name = name;
      category.id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      category.imageType = category.id;
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      category.imageUrl = result.secure_url;
    }

    const updated = await category.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating category', error: err.message });
  }
});

// 11. DELETE category (admin required)
router.delete('/categories/:uid', authMiddleware, async (req, res) => {
  try {
    const { uid } = req.params;
    const deleted = await Category.findByIdAndDelete(uid);
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category', error: err.message });
  }
});

// 12. PUT update store settings (admin required)
router.put('/settings', authMiddleware, async (req, res) => {
  try {
    const { minOrderValue, merchantPhone, storeAddress } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ minOrderValue, merchantPhone, storeAddress });
    } else {
      settings.minOrderValue = Number(minOrderValue);
      settings.merchantPhone = merchantPhone;
      settings.storeAddress = storeAddress;
    }
    const saved = await settings.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error updating settings', error: err.message });
  }
});

module.exports = router;
