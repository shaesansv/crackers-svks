const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/sargurucrackers').then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    actualPrice: String,
    finalPrice: String,
    image: String,
    videoUrl: String
});

const Product = mongoose.model('Product', productSchema);

// API Routes
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
