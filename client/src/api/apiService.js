import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyEmail: (email) => api.post('/auth/verify-email', { email }),
  resetPassword: (email, newPassword) => api.post('/auth/reset-password', { email, newPassword }),
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

// Health check
export const healthCheck = () => api.get('/');

// Orders API calls
export const ordersAPI = {
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  markOrderCompleted: (orderId) => api.post(`/orders/${orderId}/complete`),
};

// Supplier Orders API calls
export const supplierOrdersAPI = {
  getAll: (params) => api.get('/supplier-orders', { params }),
  getById: (id) => api.get(`/supplier-orders/${id}`),
  create: (data) => api.post('/supplier-orders', data),
  updateStatus: (id, status) => api.patch(`/supplier-orders/${id}/status`, { status }),
};

// Suppliers API calls
export const suppliersAPI = {
  getAll: () => api.get('/suppliers'),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

// Admin User API calls
export const adminUsersAPI = {
  getAll: () => api.get('/auth/users'),
  create: (data) => api.post('/auth/users', data),
  update: (id, data) => api.put(`/auth/users/${id}`, data),
  delete: (id) => api.delete(`/auth/users/${id}`),
};

// Dashboard stats API calls
export const dashboardAPI = {
  getAdminStats: () => api.get('/orders/admin-dashboard-stats'),
  getSupplierStats: (supplierId) => api.get('/orders/supplier-dashboard-stats', { params: { supplierId } }),
};

export const adminOrdersAPI = {
  getAll: () => api.get('/orders/admin/all'),
  update: (orderId, data) => api.patch(`/orders/${orderId}`, data),
  updateFulfillment: (orderId, status) => api.patch(`/orders/${orderId}/fulfillment`, { status }),
  delete: (orderId) => api.delete(`/orders/${orderId}`),
};


export default api; 