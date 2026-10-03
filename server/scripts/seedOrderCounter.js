/**
 * One-time migration: Seed the atomic counter with the current max orderNumber.
 * Run once on the server: node server/scripts/seedOrderCounter.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import Counter from '../models/Counter.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ No MONGODB_URI found in environment. Aborting.');
  process.exit(1);
}

await mongoose.connect(MONGO_URI);
console.log('✅ Connected to MongoDB');

// Find the highest numeric orderNumber currently in the DB
const orders = await Order.find({}, { orderNumber: 1 }).lean();
const maxSeq = orders.reduce((max, o) => {
  const n = parseInt(o.orderNumber, 10);
  return isNaN(n) ? max : Math.max(max, n);
}, 0);

console.log(`📊 Max existing orderNumber: ${maxSeq}`);

// Upsert the counter so the next order gets maxSeq + 1
await Counter.findOneAndUpdate(
  { _id: 'orderNumber' },
  { $set: { seq: maxSeq } },
  { upsert: true }
);

console.log(`✅ Counter seeded to ${maxSeq}. Next order will be ${(maxSeq + 1).toString().padStart(5, '0')}`);
await mongoose.disconnect();
