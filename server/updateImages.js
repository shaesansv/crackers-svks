import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import Category from './models/Category.js';
import Product from './models/Product.js';

const imageMap = {
  'Sparklers': 'https://images.unsplash.com/photo-1484920274317-87885bfc39f4?auto=format&fit=crop&q=80&w=600',
  'Ground Chakkars': 'https://images.unsplash.com/photo-1543621453-911e3b5e4070?auto=format&fit=crop&q=80&w=600',
  'Flower Pots': 'https://images.unsplash.com/photo-1603513360677-33a758d601b0?auto=format&fit=crop&q=80&w=600',
  'Rockets': 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=600',
  'Garland Crackers': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=600',
  'Fancy Fountains': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600',
  'default': 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&q=80&w=600'
};

const updateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for image update');

    const categories = await Category.find();
    
    for (const category of categories) {
      const imgUrl = imageMap[category.name] || imageMap['default'];
      category.image = imgUrl;
      await category.save();
      console.log(`Updated category: ${category.name}`);

      // Update all products in this category
      const products = await Product.find({ category: category._id });
      for (const product of products) {
        product.image = imgUrl;
        await product.save();
        console.log(`Updated product: ${product.name}`);
      }
    }

    console.log('Images updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating images:', error);
    process.exit(1);
  }
};

updateImages();
