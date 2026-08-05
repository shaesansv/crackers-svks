const express = require('express');
const router = express.Router();

// Models
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Settings = require('../models/Settings');

// 1. GET all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving products', error: err.message });
  }
});

// 2. POST create new order (public checkout)
router.post('/orders', async (req, res) => {
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

// 3. GET all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ code: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving categories', error: err.message });
  }
});

// 4. GET store settings
router.get('/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        minOrderValue: 3000,
        merchantPhone: '917868077818',
        storeAddress: '3/1321 Paraipatti, Sivakasi, Tamil Nadu'
      });
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving settings', error: err.message });
  }
});

module.exports = router;
