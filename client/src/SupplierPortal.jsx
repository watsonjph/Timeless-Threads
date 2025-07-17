import React, { useState, useEffect } from 'react';
import { supplierOrdersAPI, suppliersAPI } from './api/apiService';

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

  // Suppliers state (admin only)
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [supplierError, setSupplierError] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null); // supplier object or null
  const [newSupplier, setNewSupplier] = useState({
    name: '', contact_person: '', contact_email: '', contact_phone: '', street_address: '', city: '', province: '', postal_code: ''
  });

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

  // Fetch suppliers when Suppliers tab is active (admin only)
  useEffect(() => {
    if (activeTab === 'suppliers' && role === 'admin') {
      setLoadingSuppliers(true);
      suppliersAPI.getAll()
        .then(res => setSuppliers(res.data.suppliers))
        .catch(() => setSupplierError('Failed to fetch suppliers.'))
        .finally(() => setLoadingSuppliers(false));
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

  // CRUD handlers
  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    try {
      await suppliersAPI.create(newSupplier);
      setNewSupplier({ name: '', contact_person: '', contact_email: '', contact_phone: '', street_address: '', city: '', province: '', postal_code: '' });
      // Refresh list
      const res = await suppliersAPI.getAll();
      setSuppliers(res.data.suppliers);
    } catch {
      setSupplierError('Failed to create supplier.');
    }
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier({ ...supplier });
  };

  const handleUpdateSupplier = async (e) => {
    e.preventDefault();
    try {
      await suppliersAPI.update(editingSupplier.supplier_id, editingSupplier);
      setEditingSupplier(null);
      // Refresh list
      const res = await suppliersAPI.getAll();
      setSuppliers(res.data.suppliers);
    } catch {
      setSupplierError('Failed to update supplier.');
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (!window.confirm('Delete this supplier?')) return;
    try {
      await suppliersAPI.delete(id);
      // Refresh list
      const res = await suppliersAPI.getAll();
      setSuppliers(res.data.suppliers);
    } catch {
      setSupplierError('Failed to delete supplier.');
    }
  };

  // Suppliers tab content (admin only)
  const renderSuppliers = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 font-kanit">Suppliers</h2>
      {loadingSuppliers ? (
        <div className="text-center text-gray-500">Loading suppliers...</div>
      ) : supplierError ? (
        <div className="text-center text-red-500">{supplierError}</div>
      ) : (
        <>
          {/* Create Supplier Form */}
          <form className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={handleCreateSupplier}>
            <input className="border rounded px-2 py-1" required placeholder="Name" value={newSupplier.name} onChange={e => setNewSupplier(s => ({ ...s, name: e.target.value }))} />
            <input className="border rounded px-2 py-1" placeholder="Contact Person" value={newSupplier.contact_person} onChange={e => setNewSupplier(s => ({ ...s, contact_person: e.target.value }))} />
            <input className="border rounded px-2 py-1" placeholder="Email" value={newSupplier.contact_email} onChange={e => setNewSupplier(s => ({ ...s, contact_email: e.target.value }))} />
            <input className="border rounded px-2 py-1" placeholder="Phone" value={newSupplier.contact_phone} onChange={e => setNewSupplier(s => ({ ...s, contact_phone: e.target.value }))} />
            <input className="border rounded px-2 py-1" placeholder="Street Address" value={newSupplier.street_address} onChange={e => setNewSupplier(s => ({ ...s, street_address: e.target.value }))} />
            <input className="border rounded px-2 py-1" placeholder="City" value={newSupplier.city} onChange={e => setNewSupplier(s => ({ ...s, city: e.target.value }))} />
            <input className="border rounded px-2 py-1" placeholder="Province" value={newSupplier.province} onChange={e => setNewSupplier(s => ({ ...s, province: e.target.value }))} />
            <input className="border rounded px-2 py-1" placeholder="Postal Code" value={newSupplier.postal_code} onChange={e => setNewSupplier(s => ({ ...s, postal_code: e.target.value }))} />
            <button className="bg-custom-dark text-custom-cream rounded px-4 py-2 col-span-1 md:col-span-4" type="submit">Add Supplier</button>
          </form>

          {/* Edit Supplier Form */}
          {editingSupplier && (
            <form className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={handleUpdateSupplier}>
              <input className="border rounded px-2 py-1" required placeholder="Name" value={editingSupplier.name} onChange={e => setEditingSupplier(s => ({ ...s, name: e.target.value }))} />
              <input className="border rounded px-2 py-1" placeholder="Contact Person" value={editingSupplier.contact_person} onChange={e => setEditingSupplier(s => ({ ...s, contact_person: e.target.value }))} />
              <input className="border rounded px-2 py-1" placeholder="Email" value={editingSupplier.contact_email} onChange={e => setEditingSupplier(s => ({ ...s, contact_email: e.target.value }))} />
              <input className="border rounded px-2 py-1" placeholder="Phone" value={editingSupplier.contact_phone} onChange={e => setEditingSupplier(s => ({ ...s, contact_phone: e.target.value }))} />
              <input className="border rounded px-2 py-1" placeholder="Street Address" value={editingSupplier.street_address} onChange={e => setEditingSupplier(s => ({ ...s, street_address: e.target.value }))} />
              <input className="border rounded px-2 py-1" placeholder="City" value={editingSupplier.city} onChange={e => setEditingSupplier(s => ({ ...s, city: e.target.value }))} />
              <input className="border rounded px-2 py-1" placeholder="Province" value={editingSupplier.province} onChange={e => setEditingSupplier(s => ({ ...s, province: e.target.value }))} />
              <input className="border rounded px-2 py-1" placeholder="Postal Code" value={editingSupplier.postal_code} onChange={e => setEditingSupplier(s => ({ ...s, postal_code: e.target.value }))} />
              <button className="bg-custom-dark text-custom-cream rounded px-4 py-2 col-span-1 md:col-span-4" type="submit">Update Supplier</button>
              <button className="bg-red-500 text-white rounded px-4 py-2 col-span-1 md:col-span-4" type="button" onClick={() => setEditingSupplier(null)}>Cancel</button>
            </form>
          )}

          {/* Suppliers Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Name</th>
                  <th className="px-4 py-2 text-left font-semibold">Contact Person</th>
                  <th className="px-4 py-2 text-left font-semibold">Email</th>
                  <th className="px-4 py-2 text-left font-semibold">Phone</th>
                  <th className="px-4 py-2 text-left font-semibold">Address</th>
                  <th className="px-4 py-2 text-left font-semibold">City</th>
                  <th className="px-4 py-2 text-left font-semibold">Province</th>
                  <th className="px-4 py-2 text-left font-semibold">Postal Code</th>
                  <th className="px-4 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map(supplier => (
                  <tr key={supplier.supplier_id} className="border-b">
                    <td className="px-4 py-2 font-semibold">{supplier.name}</td>
                    <td className="px-4 py-2">{supplier.contact_person}</td>
                    <td className="px-4 py-2">{supplier.contact_email}</td>
                    <td className="px-4 py-2">{supplier.contact_phone}</td>
                    <td className="px-4 py-2">{supplier.street_address}</td>
                    <td className="px-4 py-2">{supplier.city}</td>
                    <td className="px-4 py-2">{supplier.province}</td>
                    <td className="px-4 py-2">{supplier.postal_code}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button className="bg-blue-500 text-white rounded px-2 py-1" onClick={() => handleEditSupplier(supplier)}>Edit</button>
                      <button className="bg-red-500 text-white rounded px-2 py-1" onClick={() => handleDeleteSupplier(supplier.supplier_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
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

  // Orders tab content
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