import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected successfully!');
    const db = mongoose.connection.db;
    
    const collections = await db.listCollections().toArray();
    console.log('\nAvailable Collections:');
    collections.forEach(c => console.log('- ' + c.name));
    
    console.log('\nDocument Counts:');
    for (const c of collections) {
      const count = await db.collection(c.name).countDocuments();
      console.log(`- ${c.name}: ${count}`);
    }
    
    process.exit(0);
  } catch(e) {
    console.error('Error connecting:', e);
    process.exit(1);
  }
}
checkDB();
