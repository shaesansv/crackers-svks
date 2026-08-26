export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '').replace(/\/api$/, '');

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('adminToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/api/products?limit=1000`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export const getOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
};

export const approveOrder = async (orderId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/approve`, {
    method: 'PUT',
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error?.message || 'Failed to approve order');
  }
  return data;
};

export const updatePackingStatus = async (orderId: string, status: string) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/packing-status`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ packingStatus: status }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error?.message || 'Failed to update packing status');
  }
  return data;
};

export const updatePaymentStatus = async (orderId: string, status: string) => {
  let response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment-status`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ paymentStatus: status }),
  });
  
  if (response.status === 404) {
    response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ paymentStatus: status }),
    });
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error?.message || 'Failed to update payment status');
  }
  return data;
};

export const updateHoldDays = async (orderId: string, holdDays: number) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/hold-days`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ holdDays }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error?.message || 'Failed to update hold days');
  }
  return data;
};

export const updateSettings = async (settingsData: any) => {
  const response = await fetch(`${API_BASE_URL}/api/settings`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(settingsData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error?.message || 'Failed to update settings');
  }
  return data.settings || data;
};
