// Find actual admin user email from MongoDB
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function findAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const users = await db.collection('users').find({}).toArray();
  console.log('Users in DB:', JSON.stringify(users.map(u => ({ email: u.email, role: u.role, name: u.name })), null, 2));
  const admins = await db.collection('admins').find({}).toArray();
  console.log('Admins collection:', JSON.stringify(admins.map(a => ({ email: a.email, role: a.role })), null, 2));
  process.exit(0);
}
findAdmin();
