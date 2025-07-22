import React, { useState, useEffect } from 'react';
import { supplierOrdersAPI, suppliersAPI } from './api/apiService';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null); // supplier object or null
  const [newSupplier, setNewSupplier] = useState({
    name: '', contact_person: '', contact_email: '', contact_phone: '', street_address: '', city: '', province: '', postal_code: ''
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
      setShowAddModal(false);
      // Refresh list
      const res = await suppliersAPI.getAll();
      setSuppliers(res.data.suppliers);
    } catch {
      setSupplierError('Failed to create supplier.');
    }
  };

  const handleAddSupplierClick = () => {
    setShowAddModal(true);
    setNewSupplier({ name: '', contact_person: '', contact_email: '', contact_phone: '', street_address: '', city: '', province: '', postal_code: '' });
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewSupplier({ name: '', contact_person: '', contact_email: '', contact_phone: '', street_address: '', city: '', province: '', postal_code: '' });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingSupplier(null);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier({ ...supplier });
    setShowEditModal(true);
  };

  const handleUpdateSupplier = async (e) => {
    e.preventDefault();
    try {
      await suppliersAPI.update(editingSupplier.supplier_id, editingSupplier);
      setShowEditModal(false);
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
                      <button
                        className="bg-blue-500 text-white rounded px-2 py-1 cursor-pointer hover:bg-blue-600"
                        title="Edit Supplier"
                        onClick={() => handleEditSupplier(supplier)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="bg-red-500 text-white rounded px-2 py-1 cursor-pointer hover:bg-red-600"
                        title="Delete Supplier"
                        onClick={() => handleDeleteSupplier(supplier.supplier_id)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Separator and Add Supplier Button */}
          <hr className="my-8 border-gray-300" />
          <div className="flex justify-center">
            <button
              onClick={handleAddSupplierClick}
              className="bg-custom-dark text-custom-cream px-6 py-3 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
            >
              Add Supplier
            </button>
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
        <td className="px-4 py-2 font-semibold">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </td>
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
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition font-kanit cursor-pointer ${
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

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-8 max-w-2xl w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-custom-dark">Add New Supplier</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreateSupplier} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-custom-dark font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                    placeholder="Enter supplier name"
                    value={newSupplier.name}
                    onChange={e => setNewSupplier(s => ({ ...s, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-custom-dark font-medium mb-2">Contact Person</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                    placeholder="Enter contact person"
                    value={newSupplier.contact_person}
                    onChange={e => setNewSupplier(s => ({ ...s, contact_person: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-custom-dark font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                    placeholder="Enter email"
                    value={newSupplier.contact_email}
                    onChange={e => setNewSupplier(s => ({ ...s, contact_email: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-custom-dark font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                    placeholder="Enter phone number"
                    value={newSupplier.contact_phone}
                    onChange={e => setNewSupplier(s => ({ ...s, contact_phone: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-custom-dark font-medium mb-2">Street Address</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                    placeholder="Enter street address"
                    value={newSupplier.street_address}
                    onChange={e => setNewSupplier(s => ({ ...s, street_address: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-custom-dark font-medium mb-2">City</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                    placeholder="Enter city"
                    value={newSupplier.city}
                    onChange={e => setNewSupplier(s => ({ ...s, city: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-custom-dark font-medium mb-2">Province</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                    placeholder="Enter province"
                    value={newSupplier.province}
                    onChange={e => setNewSupplier(s => ({ ...s, province: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-custom-dark font-medium mb-2">Postal Code</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                    placeholder="Enter postal code"
                    value={newSupplier.postal_code}
                    onChange={e => setNewSupplier(s => ({ ...s, postal_code: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-custom-dark text-custom-cream py-2 px-4 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
                >
                  Add Supplier
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-poppins cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Supplier Modal */}
      {showEditModal && editingSupplier && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-8 max-w-2xl w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-custom-dark">Edit Supplier</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleUpdateSupplier} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-custom-dark font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                    placeholder="Enter supplier name"
                    value={editingSupplier.name}
                    onChange={e => setEditingSupplier(s => ({ ...s, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-custom-dark font-medium mb-2">Contact Person</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                    placeholder="Enter contact person"
                    value={editingSupplier.contact_person}
                    onChange={e => setEditingSupplier(s => ({ ...s, contact_person: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-custom-dark font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                    placeholder="Enter email"
                    value={editingSupplier.contact_email}
                    onChange={e => setEditingSupplier(s => ({ ...s, contact_email: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-custom-dark font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                    placeholder="Enter phone number"
                    value={editingSupplier.contact_phone}
                    onChange={e => setEditingSupplier(s => ({ ...s, contact_phone: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-custom-dark font-medium mb-2">Street Address</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                    placeholder="Enter street address"
                    value={editingSupplier.street_address}
                    onChange={e => setEditingSupplier(s => ({ ...s, street_address: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-custom-dark font-medium mb-2">City</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                    placeholder="Enter city"
                    value={editingSupplier.city}
                    onChange={e => setEditingSupplier(s => ({ ...s, city: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-custom-dark font-medium mb-2">Province</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                    placeholder="Enter province"
                    value={editingSupplier.province}
                    onChange={e => setEditingSupplier(s => ({ ...s, province: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-custom-dark font-medium mb-2">Postal Code</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                    placeholder="Enter postal code"
                    value={editingSupplier.postal_code}
                    onChange={e => setEditingSupplier(s => ({ ...s, postal_code: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-custom-dark text-custom-cream py-2 px-4 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
                >
                  Update Supplier
                </button>
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-poppins cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 