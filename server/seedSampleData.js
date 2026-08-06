import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import Category from './models/Category.js';
import Product from './models/Product.js';

const seedSampleData = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not defined in environment variables');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');

    // Clear existing collections to drop conflicting indices (like unique id index)
    try {
      await Category.collection.drop();
      console.log('Dropped Category collection');
    } catch (e) {
      console.log('Category collection did not exist or could not be dropped');
    }

    try {
      await Product.collection.drop();
      console.log('Dropped Product collection');
    } catch (e) {
      console.log('Product collection did not exist or could not be dropped');
    }

    // Seed Categories
    const categoriesData = [
      { name: 'Sparklers', categoryCode: '100', description: 'Sparkling hand-held fireworks', icon: 'sparkles', displayOrder: 1, image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=200&auto=format&fit=crop' },
      { name: 'Ground Chakkars', categoryCode: '110', description: 'Spinning ground wheels', icon: 'rotate-cw', displayOrder: 2, image: 'https://images.unsplash.com/photo-1517260911058-0fcfd733c021?q=80&w=200&auto=format&fit=crop' },
      { name: 'Flower Pots', categoryCode: '120', description: 'Fountain of colorful sparks', icon: 'flower', displayOrder: 3, image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=200&auto=format&fit=crop' },
      { name: 'Rockets', categoryCode: '130', description: 'Sky soaring high-altitude rockets', icon: 'rocket', displayOrder: 4, image: 'https://images.unsplash.com/photo-1481156828551-87ee09e4693a?q=80&w=200&auto=format&fit=crop' },
      { name: 'Garland Crackers', categoryCode: '140', description: 'Series of loud crackers', icon: 'flame', displayOrder: 5, image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=200&auto=format&fit=crop' },
      { name: 'Fancy Fountains', categoryCode: '150', description: 'Visual delight multi-shot fountains', icon: 'zap', displayOrder: 6, image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=200&auto=format&fit=crop' }
    ];

    const savedCategories = {};
    for (const cat of categoriesData) {
      const categoryDoc = new Category(cat);
      const savedCat = await categoryDoc.save();
      savedCategories[cat.name] = savedCat;
      console.log(`Seeded category: ${cat.name} with code ${cat.categoryCode}`);
    }

    // Seed Products
    const productsData = [
      // Sparklers
      {
        name: '10cm Electric Sparklers',
        description: 'Box of 10 electric sparklers',
        code: 'SPK-01',
        sku: '100-SPK-1',
        category: savedCategories['Sparklers']._id,
        price: 50,
        wholesalePrice: 40,
        netRate: 35,
        stock: 500,
        minimumStock: 50,
        image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=200&auto=format&fit=crop',
        isActive: true
      },
      {
        name: '30cm Color Sparklers',
        description: 'Box of 5 color sparklers',
        code: 'SPK-02',
        sku: '100-SPK-2',
        category: savedCategories['Sparklers']._id,
        price: 150,
        wholesalePrice: 120,
        netRate: 100,
        stock: 300,
        minimumStock: 30,
        image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=200&auto=format&fit=crop',
        isActive: true
      },
      // Ground Chakkars
      {
        name: 'Ground Chakkar Asoka',
        description: 'Box of 10 high-speed ground chakkars',
        code: 'GCH-01',
        sku: '110-GCA-1',
        category: savedCategories['Ground Chakkars']._id,
        price: 80,
        wholesalePrice: 65,
        netRate: 50,
        stock: 400,
        minimumStock: 40,
        image: 'https://images.unsplash.com/photo-1517260911058-0fcfd733c021?q=80&w=200&auto=format&fit=crop',
        isActive: true
      },
      {
        name: 'Ground Chakkar Special',
        description: 'Box of 5 extra-large ground chakkars',
        code: 'GCH-02',
        sku: '110-GCS-2',
        category: savedCategories['Ground Chakkars']._id,
        price: 120,
        wholesalePrice: 95,
        netRate: 80,
        stock: 250,
        minimumStock: 25,
        image: 'https://images.unsplash.com/photo-1517260911058-0fcfd733c021?q=80&w=200&auto=format&fit=crop',
        isActive: true
      },
      // Flower Pots
      {
        name: 'Flower Pots Special',
        description: 'Box of 10 special sparkler flower pots',
        code: 'FP-01',
        sku: '120-FPS-1',
        category: savedCategories['Flower Pots']._id,
        price: 100,
        wholesalePrice: 80,
        netRate: 70,
        stock: 350,
        minimumStock: 35,
        image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=200&auto=format&fit=crop',
        isActive: true
      },
      {
        name: 'Flower Pots Giant',
        description: 'Box of 5 giant high-fountain flower pots',
        code: 'FP-02',
        sku: '120-FPG-2',
        category: savedCategories['Flower Pots']._id,
        price: 180,
        wholesalePrice: 150,
        netRate: 130,
        stock: 200,
        minimumStock: 20,
        image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=200&auto=format&fit=crop',
        isActive: true
      },
      // Rockets
      {
        name: 'Lunik Rocket',
        description: 'Pack of 10 sky-flying rockets',
        code: 'RK-01',
        sku: '130-LNK-1',
        category: savedCategories['Rockets']._id,
        price: 200,
        wholesalePrice: 160,
        netRate: 140,
        stock: 150,
        minimumStock: 15,
        image: 'https://images.unsplash.com/photo-1481156828551-87ee09e4693a?q=80&w=200&auto=format&fit=crop',
        isActive: true
      },
      {
        name: 'Sky Shot Rocket',
        description: 'Single large colorful sky shot rocket',
        code: 'RK-02',
        sku: '130-SSR-2',
        category: savedCategories['Rockets']._id,
        price: 250,
        wholesalePrice: 200,
        netRate: 180,
        stock: 120,
        minimumStock: 12,
        image: 'https://images.unsplash.com/photo-1481156828551-87ee09e4693a?q=80&w=200&auto=format&fit=crop',
        isActive: true
      },
      // Garland Crackers
      {
        name: '28 Chorsa',
        description: 'Box of 28 red chorsa sound crackers',
        code: 'GAR-01',
        sku: '140-28C-1',
        category: savedCategories['Garland Crackers']._id,
        price: 60,
        wholesalePrice: 50,
        netRate: 40,
        stock: 500,
        minimumStock: 50,
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=200&auto=format&fit=crop',
        isActive: true
      },
      {
        name: '50 Deluxe',
        description: 'Deluxe sound garland with 50 crackers',
        code: 'GAR-02',
        sku: '140-50D-2',
        category: savedCategories['Garland Crackers']._id,
        price: 120,
        wholesalePrice: 100,
        netRate: 85,
        stock: 300,
        minimumStock: 30,
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=200&auto=format&fit=crop',
        isActive: true
      },
      // Fancy Fountains
      {
        name: '7 Shot Color Fountain',
        description: '7 sequential multi-color aerial fountain shots',
        code: 'FNC-01',
        sku: '150-7SF-1',
        category: savedCategories['Fancy Fountains']._id,
        price: 300,
        wholesalePrice: 240,
        netRate: 210,
        stock: 100,
        minimumStock: 10,
        image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=200&auto=format&fit=crop',
        isActive: true
      },
      {
        name: '12 Shot Multi Color',
        description: '12 exciting color-changing fountain shots',
        code: 'FNC-02',
        sku: '150-12M-2',
        category: savedCategories['Fancy Fountains']._id,
        price: 450,
        wholesalePrice: 360,
        netRate: 310,
        stock: 80,
        minimumStock: 8,
        image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=200&auto=format&fit=crop',
        isActive: true
      }
    ];

    for (const prod of productsData) {
      const productDoc = new Product(prod);
      await productDoc.save();
      console.log(`Seeded product: ${prod.name}`);
    }

    console.log('All categories and products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedSampleData();
