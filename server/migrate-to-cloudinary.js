import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Paths to local images
const backendUploadsDir = path.resolve(__dirname, 'public/uploads/products');
const frontendUploadsDir = path.resolve(__dirname, '../public/uploads/products');
const rootUploadsDir = path.resolve(__dirname, '../public/uploads');

// Helper to upload buffer/file to Cloudinary
async function uploadFileToCloudinary(filePath, folder, customPublicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder,
        public_id: customPublicId,
        overwrite: true,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
}

// Find local file across available folders
function findLocalImageFile(rawImagePath) {
  if (!rawImagePath) return null;
  
  const cleanFileName = path.basename(rawImagePath).split('?')[0];

  const possiblePaths = [
    path.join(backendUploadsDir, cleanFileName),
    path.join(frontendUploadsDir, cleanFileName),
    path.join(rootUploadsDir, cleanFileName),
    path.resolve(__dirname, rawImagePath.replace(/^\//, '')),
    path.resolve(__dirname, '..', rawImagePath.replace(/^\//, ''))
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      return { fullPath: p, fileName: cleanFileName };
    }
  }

  return null;
}

// Cache of uploaded file URLs to prevent duplicate uploads of the same image
const uploadedCache = new Map();

async function runMigration() {
  console.log('🚀 Starting Cloudinary Migration...\n');
  console.log(`Cloudinary Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`Connecting to MongoDB...`);

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected to MongoDB Atlas\n');

  const productsCollection = mongoose.connection.db.collection('products');
  const categoriesCollection = mongoose.connection.db.collection('categories');

  const products = await productsCollection.find({}).toArray();
  const categories = await categoriesCollection.find({}).toArray();

  console.log(`📦 Found ${products.length} Products and ${categories.length} Categories in database.\n`);

  let prodSuccess = 0;
  let prodSkipped = 0;
  let prodFailed = 0;

  // 1. Process Products
  console.log('--- Migrating Product Images ---');
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const currentImg = product.image;

    if (currentImg && currentImg.includes('res.cloudinary.com')) {
      console.log(`[${i + 1}/${products.length}] ⏩ Skipped (Already on Cloudinary): ${product.name}`);
      prodSkipped++;
      continue;
    }

    const localFile = findLocalImageFile(currentImg);

    if (!localFile) {
      console.warn(`[${i + 1}/${products.length}] ⚠️ File not found locally: ${currentImg} for "${product.name}"`);
      prodFailed++;
      continue;
    }

    try {
      let cloudinaryUrl;

      if (uploadedCache.has(localFile.fileName)) {
        cloudinaryUrl = uploadedCache.get(localFile.fileName);
      } else {
        const publicId = path.parse(localFile.fileName).name.replace(/[^a-zA-Z0-9_\-]/g, '_');
        const uploadRes = await uploadFileToCloudinary(localFile.fullPath, 'products', publicId);
        cloudinaryUrl = uploadRes.secure_url;
        uploadedCache.set(localFile.fileName, cloudinaryUrl);
      }

      await productsCollection.updateOne(
        { _id: product._id },
        { $set: { image: cloudinaryUrl } }
      );

      console.log(`[${i + 1}/${products.length}] ✓ Migrated "${product.name}" -> ${cloudinaryUrl}`);
      prodSuccess++;
    } catch (err) {
      console.error(`[${i + 1}/${products.length}] ❌ Failed to upload for "${product.name}":`, err.message);
      prodFailed++;
    }
  }

  // 2. Process Categories
  console.log('\n--- Migrating Category Images ---');
  let catSuccess = 0;

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const currentImg = category.image;

    if (currentImg && currentImg.includes('res.cloudinary.com')) {
      console.log(`[${i + 1}/${categories.length}] ⏩ Skipped (Already on Cloudinary): ${category.name}`);
      continue;
    }

    const localFile = findLocalImageFile(currentImg);

    if (localFile) {
      try {
        let cloudinaryUrl;
        if (uploadedCache.has(localFile.fileName)) {
          cloudinaryUrl = uploadedCache.get(localFile.fileName);
        } else {
          const publicId = path.parse(localFile.fileName).name.replace(/[^a-zA-Z0-9_\-]/g, '_');
          const uploadRes = await uploadFileToCloudinary(localFile.fullPath, 'categories', publicId);
          cloudinaryUrl = uploadRes.secure_url;
          uploadedCache.set(localFile.fileName, cloudinaryUrl);
        }

        await categoriesCollection.updateOne(
          { _id: category._id },
          { $set: { image: cloudinaryUrl } }
        );

        console.log(`[${i + 1}/${categories.length}] ✓ Migrated Category "${category.name}" -> ${cloudinaryUrl}`);
        catSuccess++;
        continue;
      } catch (err) {
        console.error(`Category "${category.name}" upload error:`, err.message);
      }
    }

    // Fallback: Use the image of the first product in this category
    const firstProduct = await productsCollection.findOne({ category: category._id, image: { $regex: /cloudinary/ } });
    if (firstProduct && firstProduct.image) {
      await categoriesCollection.updateOne(
        { _id: category._id },
        { $set: { image: firstProduct.image } }
      );
      console.log(`[${i + 1}/${categories.length}] ✓ Synced Category "${category.name}" from first product -> ${firstProduct.image}`);
      catSuccess++;
    }
  }

  console.log('\n========================================');
  console.log(`🎉 Migration Completed!`);
  console.log(`Products: ${prodSuccess} updated, ${prodSkipped} already had Cloudinary, ${prodFailed} failed.`);
  console.log(`Categories: ${catSuccess} updated.`);
  console.log(`Total Unique Images Uploaded to Cloudinary: ${uploadedCache.size}`);
  console.log('========================================\n');

  await mongoose.disconnect();
}

runMigration().catch(err => {
  console.error('Fatal Migration Error:', err);
  process.exit(1);
});
