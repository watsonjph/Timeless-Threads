import React, { useState, useEffect } from 'react';
import { supplierOrdersAPI } from './api/apiService';

export default function SupplierPortal() {
  const role = localStorage.getItem('role');
  // Tabs: Admin sees Suppliers and Orders, Supplier sees only Orders
  const tabs = role === 'admin'
    ? [
        { id: 'suppliers', label: 'Suppliers', icon: '🏢' },
        { id: 'orders', label: 'Orders', icon: '📦' },
      ]
    : [
        { id: 'orders', label: 'Orders', icon: '📦' },
      ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState({});
  const [error, setError] = useState(null);

  // Fetch supplier orders when Orders tab is active
  useEffect(() => {
    if (activeTab === 'orders') {
      setLoadingOrders(true);
      supplierOrdersAPI.getAll()
        .then(res => setOrders(res.data.orders))
        .catch(() => setError('Failed to fetch orders.'))
        .finally(() => setLoadingOrders(false));
    }
  }, [activeTab]);

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(prev => ({ ...prev, [orderId]: true }));
    try {
      await supplierOrdersAPI.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => order.supplier_order_id === orderId ? { ...order, status: newStatus } : order));
    } catch {
      setError('Failed to update status.');
    } finally {
      setStatusUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Suppliers tab content (admin only, placeholder for now)
  const renderSuppliers = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 font-kanit">Suppliers (Admin Only)</h2>
      <div className="text-gray-500">CRUD supplier management coming soon...</div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 font-kanit">Supplier Orders</h2>
      {loadingOrders ? (
        <div className="text-center text-gray-500">Loading orders...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-400">No supplier orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Order ID</th>
                <th className="px-4 py-2 text-left font-semibold">Product(s)</th>
                <th className="px-4 py-2 text-left font-semibold">Variant(s)</th>
                <th className="px-4 py-2 text-left font-semibold">Quantity</th>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
                <th className="px-4 py-2 text-left font-semibold">Status</th>
                <th className="px-4 py-2 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <OrderRow key={order.supplier_order_id} order={order} onStatusChange={handleStatusChange} updating={!!statusUpdating[order.supplier_order_id]} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Helper component to fetch and display order items
  function OrderRow({ order, onStatusChange, updating }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      supplierOrdersAPI.getById(order.supplier_order_id)
        .then(res => setItems(res.data.items))
        .finally(() => setLoading(false));
    }, [order.supplier_order_id]);
    return (
      <tr className="border-b">
        <td className="px-4 py-2">{order.supplier_order_id}</td>
        <td className="px-4 py-2">{loading ? '...' : items.map(i => i.product_name).join(', ')}</td>
        <td className="px-4 py-2">{loading ? '...' : items.map(i => `${i.size || ''} ${i.color || ''}`.trim()).join(', ')}</td>
        <td className="px-4 py-2">{loading ? '...' : items.map(i => i.quantity_ordered).join(', ')}</td>
        <td className="px-4 py-2">{new Date(order.order_date).toLocaleString()}</td>
        <td className="px-4 py-2 font-semibold">{order.status}</td>
        <td className="px-4 py-2">
          {order.status === 'Pending' ? (
            <select
              className="border rounded px-2 py-1"
              disabled={updating}
              defaultValue=""
              onChange={e => e.target.value && onStatusChange(order.supplier_order_id, e.target.value)}
            >
              <option value="" disabled>Mark as...</option>
              <option value="Shipped">Shipped</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </td>
      </tr>
    );
  }

  // Render content based on active tab
  const renderContent = () => {
    if (activeTab === 'orders') return renderOrders();
    if (activeTab === 'suppliers' && role === 'admin') return renderSuppliers();
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-custom-dark font-poppins">Supplier Portal</h1>
          <p className="text-gray-600 font-nunito">{role === 'admin' ? 'Manage your suppliers and purchase orders' : 'View and manage your supplier orders'}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-2">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition font-kanit ${
                activeTab === tab.id
                  ? 'bg-custom-dark text-custom-cream'
                  : 'text-gray-600 hover:text-custom-dark hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderContent()}
    </div>
  );
} 