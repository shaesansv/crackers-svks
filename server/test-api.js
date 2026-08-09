import dotenv from 'dotenv';

dotenv.config();

const BASE = 'http://localhost:5000';

async function test(label, url, headers = {}) {
  try {
    const res = await fetch(url, { headers });
    const json = await res.json();
    if (res.ok) {
      const count = Array.isArray(json) ? json.length
        : json.products ? json.products.length
        : json.orders ? json.orders.length
        : json.customers ? json.customers.length
        : 1;
      console.log(`✅ ${label}: OK (${res.status}) - ${count} record(s)`);
    } else {
      console.log(`❌ ${label}: FAILED (${res.status}) - ${json.message || json.error?.message || JSON.stringify(json)}`);
    }
  } catch(e) {
    console.log(`❌ ${label}: ERROR - ${e.message}`);
  }
}

async function run() {
  console.log('=== API Endpoint Tests (checking MongoDB data) ===\n');

  // 1. Test server health
  await test('Server Health', `${BASE}/api/health`);

  // 2. Admin login
  try {
    const loginRes = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@crackerhub.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    if (loginRes.ok && loginData.token) {
      console.log(`✅ Admin Login: OK (${loginRes.status}) - role: ${loginData.user?.role}`);
      const token = loginData.token;
      const auth = { Authorization: `Bearer ${token}` };

      // 3. Products
      await test('Products (GET)', `${BASE}/api/products?limit=100`, auth);

      // 4. Categories
      await test('Categories (GET)', `${BASE}/api/categories`, auth);

      // 5. Orders (Admin)
      await test('Orders (GET)', `${BASE}/api/orders`, auth);

      // 6. Customers
      await test('Customers (GET)', `${BASE}/api/customers`, auth);

      // 7. Settings / Content Pages
      await test('Settings (GET)', `${BASE}/api/settings`, auth);

      // 8. Site Info (public) - actual route is /api/settings/public/info
      await test('Site Info / Content (GET)', `${BASE}/api/settings/public/info`);

      // 9. Reports
      await test('Reports - Sales (GET)', `${BASE}/api/reports/sales`, auth);

    } else {
      console.log(`❌ Admin Login: FAILED (${loginRes.status}) - ${loginData.message || JSON.stringify(loginData)}`);
      // Try guest endpoints anyway
      await test('Products (public)', `${BASE}/api/products?limit=10`);
      await test('Categories (public)', `${BASE}/api/categories`);
    }
  } catch(e) {
    console.log(`❌ Admin Login request error: ${e.message}`);
  }

  console.log('\n=== Done ===');
}

run();
