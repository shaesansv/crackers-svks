// Test the approve order endpoint with a real order ID from MongoDB
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function testApprove() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  
  // Get a real order ID
  const orders = await db.collection('orders').find({}).limit(1).toArray();
  if (!orders.length) {
    console.log('No orders found in DB');
    process.exit(0);
  }
  
  const orderId = orders[0]._id.toString();
  console.log('Testing with Order ID:', orderId);
  console.log('Order data preview:', JSON.stringify({
    _id: orders[0]._id,
    customerName: orders[0].customerName,
    customerEmail: orders[0].customerEmail,
    approved: orders[0].approved
  }, null, 2));
  
  // Get admin token first
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@crackerhub.com', password: 'admin123' })
  });
  const loginData = await loginRes.json();
  if (!loginRes.ok) {
    console.error('Login failed:', loginData);
    process.exit(1);
  }
  const token = loginData.token;
  console.log('\nAdmin login OK. Testing approve endpoint...');
  
  // Test the approve endpoint
  const approveRes = await fetch(`http://localhost:5000/api/orders/${orderId}/approve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  const approveData = await approveRes.json();
  console.log('\nApprove response status:', approveRes.status);
  console.log('Approve response body:', JSON.stringify(approveData, null, 2));
  
  process.exit(0);
}

testApprove().catch(e => {
  console.error('Test failed:', e);
  process.exit(1);
});
