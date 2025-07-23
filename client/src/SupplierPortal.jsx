import React, { useState, useEffect } from 'react';
import { supplierOrdersAPI, suppliersAPI } from './api/apiService';
import { FiEdit2, FiTrash2, FiTruck, FiX } from 'react-icons/fi';

export default function SupplierPortal() {
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const supplierId = localStorage.getItem('supplierId');
  // Tabs: Admin sees Suppliers, Orders, Order History; Supplier sees Orders, Order History
  const tabs = role === 'admin'
    ? [
        { id: 'suppliers', label: 'Suppliers', icon: '🏢' },
        { id: 'orders', label: 'Orders', icon: '📦' },
        { id: 'orderHistory', label: 'Order History', icon: '📜' },
      ]
    : [
        { id: 'orders', label: 'Orders', icon: '📦' },
        { id: 'orderHistory', label: 'Order History', icon: '📜' },
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

  // --- Admin Supplier Order Modal State ---
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSupplierId, setOrderSupplierId] = useState('');
  const [orderVariants, setOrderVariants] = useState([]); // all variants for selected supplier
  const [orderCart, setOrderCart] = useState([]); // [{variant, quantity}]
  const [orderNotes, setOrderNotes] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');

  // --- Edit Status Modal State ---
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('Delivered');
  const [editStatusLoading, setEditStatusLoading] = useState(false);
  const [editStatusError, setEditStatusError] = useState('');

  // --- Fetch all suppliers for admin order modal ---
  useEffect(() => {
    if (role === 'admin' && showOrderModal) {
      suppliersAPI.getAll().then(res => setSuppliers(res.data.suppliers || []));
    }
  }, [role, showOrderModal]);

  // --- Fetch variants for selected supplier ---
  useEffect(() => {
    async function fetchVariants() {
      if (orderSupplierId) {
        setOrderVariants([]);
        setOrderCart([]);
        setOrderError('');
        setOrderSuccess('');
        try {
          // Fetch all variants, filter by supplier_id
          const res = await fetch('/api/products');
          const data = await res.json();
          // data.products: [{product_id, name, supplier_id, variants: [{...}]}]
          let variants = [];
          if (Array.isArray(data.products)) {
            data.products.forEach(prod => {
              if (prod.supplier_id === Number(orderSupplierId)) {
                variants = variants.concat((prod.variants || []).map(v => ({
                  ...v,
                  product_name: prod.name,
                  price: prod.price // include price from product
                })));
              }
            });
          }
          setOrderVariants(variants);
        } catch {
          setOrderError('Failed to load product variants.');
        }
      } else {
        setOrderVariants([]);
        setOrderCart([]);
      }
    }
    if (showOrderModal && orderSupplierId) fetchVariants();
  }, [orderSupplierId, showOrderModal]);

  // --- Add variant to cart ---
  const handleAddToCart = (variant, quantity) => {
    if (!quantity || quantity <= 0) return;
    setOrderCart(prev => {
      const idx = prev.findIndex(item => item.variant.variant_id === variant.variant_id);
      if (idx >= 0) {
        // Update quantity
        const updated = [...prev];
        updated[idx].quantity = quantity;
        return updated;
      } else {
        return [...prev, { variant, quantity }];
      }
    });
  };

  // --- Remove variant from cart ---
  const handleRemoveFromCart = (variantId) => {
    setOrderCart(prev => prev.filter(item => item.variant.variant_id !== variantId));
  };

  // --- Submit supplier order ---
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setOrderLoading(true);
    setOrderError('');
    setOrderSuccess('');
    try {
      if (!orderSupplierId || orderCart.length === 0) {
        setOrderError('Select a supplier and add at least one product variant.');
        setOrderLoading(false);
        return;
      }
      const items = orderCart.map(item => ({
        variant_id: item.variant.variant_id,
        quantity_ordered: item.quantity
      }));
      await supplierOrdersAPI.create({
        supplier_id: orderSupplierId,
        ordered_by_admin_id: userId,
        notes: orderNotes,
        items
      });
      setOrderSuccess('Order placed successfully!');
      setOrderCart([]);
      setOrderNotes('');
      setOrderSupplierId('');
      setShowOrderModal(false);
      // Optionally refresh orders
      setTimeout(() => setOrderSuccess(''), 3000);
      setLoadingOrders(true);
      supplierOrdersAPI.getAll().then(res => setOrders(res.data.orders)).finally(() => setLoadingOrders(false));
    } catch (err) {
      setOrderError(err?.response?.data?.error || 'Failed to place order.');
    } finally {
      setOrderLoading(false);
    }
  };

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
      // For suppliers, filter by their supplierId
      const params = role === 'supplier' ? { supplierId } : undefined;
      supplierOrdersAPI.getAll(params)
        .then(res => setOrders(res.data.orders))
        .catch(() => setError('Failed to fetch orders.'))
        .finally(() => setLoadingOrders(false));
    }
  }, [activeTab, role, supplierId]);

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

  // --- Edit Status Modal ---
  const renderEditStatusModal = () => (
    showEditStatusModal && editingOrder && (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white bg-opacity-95 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl relative">
          <button
            onClick={() => setShowEditStatusModal(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
          >×</button>
          <h2 className="text-2xl font-bold text-custom-dark mb-4">Edit Order Status</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setEditStatusLoading(true);
            setEditStatusError('');
            try {
              await supplierOrdersAPI.updateStatus(editingOrder.supplier_order_id, newStatus);
              setShowEditStatusModal(false);
              setEditingOrder(null);
              setNewStatus('Delivered');
              setLoadingOrders(true);
              supplierOrdersAPI.getAll().then(res => setOrders(res.data.orders)).finally(() => setLoadingOrders(false));
            } catch (err) {
              setEditStatusError('Failed to update status.');
            } finally {
              setEditStatusLoading(false);
            }
          }} className="space-y-4">
            <div>
              <label className="block text-custom-dark font-medium mb-2">Status</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            {editStatusError && <div className="text-red-500 text-sm">{editStatusError}</div>}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-custom-dark text-custom-cream py-2 px-4 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
                disabled={editStatusLoading}
              >
                {editStatusLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setShowEditStatusModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-poppins cursor-pointer"
                disabled={editStatusLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  // Orders tab content
  const renderOrders = () => {
    // Split orders by status
    const activeOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Shipped');
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-kanit">Supplier Orders</h2>
          <div className="flex gap-2">
            {role === 'admin' && (
              <button
                className="bg-custom-dark text-custom-cream px-4 py-2 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
                onClick={() => {
                  setShowOrderModal(true);
                  setOrderSupplierId('');
                  setOrderCart([]);
                  setOrderNotes('');
                  setOrderError('');
                  setOrderSuccess('');
                }}
              >
                Place Order
              </button>
            )}
            <button
              className="bg-gray-300 text-custom-dark px-4 py-2 rounded-lg hover:bg-gray-400 transition font-poppins cursor-pointer"
              onClick={() => {
                setLoadingOrders(true);
                const params = role === 'supplier' ? { supplierId } : undefined;
                supplierOrdersAPI.getAll(params).then(res => setOrders(res.data.orders)).finally(() => setLoadingOrders(false));
              }}
            >
              Refresh
            </button>
          </div>
        </div>
        {/* Active Orders Table (Supplier Orders) */}
        {activeOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] py-8 text-gray-400 text-lg">
            No active supplier orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Order ID</th>
                  <th className="px-4 py-2 text-left font-semibold">Supplier</th>
                  <th className="px-4 py-2 text-left font-semibold">Product(s)</th>
                  <th className="px-4 py-2 text-left font-semibold">Variant(s)</th>
                  <th className="px-4 py-2 text-left font-semibold">SKU</th>
                  <th className="px-4 py-2 text-left font-semibold">Quantity</th>
                  <th className="px-4 py-2 text-left font-semibold">Cost</th>
                  <th className="px-4 py-2 text-left font-semibold">Total Cost</th>
                  <th className="px-4 py-2 text-left font-semibold">Date</th>
                  <th className="px-4 py-2 text-left font-semibold">Total Amount</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-4 py-2 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {activeOrders.map(order => (
                  <OrderRow
                    key={order.supplier_order_id}
                    order={order}
                    onStatusChange={handleStatusChange}
                    updating={!!statusUpdating[order.supplier_order_id]}
                    isSupplier={role === 'supplier'}
                    isActive
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
        {renderEditStatusModal()}
      </div>
    );
  };

  // Render Order History tab content (completed orders only)
  const renderOrderHistory = () => {
    // completedOrders is already filtered in renderOrders, so filter here as well
    const completedOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold font-kanit">Supplier Order History</h2>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
              setLoadingOrders(true);
              const params = role === 'supplier' ? { supplierId } : undefined;
              supplierOrdersAPI.getAll(params).then(res => setOrders(res.data.orders)).finally(() => setLoadingOrders(false));
            }}
          >
            Refresh
          </button>
        </div>
        {completedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[120px] py-4 text-gray-400 text-lg">
            No completed supplier orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Order ID</th>
                  <th className="px-4 py-2 text-left font-semibold">Supplier</th>
                  <th className="px-4 py-2 text-left font-semibold">Product(s)</th>
                  <th className="px-4 py-2 text-left font-semibold">Variant(s)</th>
                  <th className="px-4 py-2 text-left font-semibold">SKU</th>
                  <th className="px-4 py-2 text-left font-semibold">Quantity</th>
                  <th className="px-4 py-2 text-left font-semibold">Cost</th>
                  <th className="px-4 py-2 text-left font-semibold">Total Cost</th>
                  <th className="px-4 py-2 text-left font-semibold">Date</th>
                  <th className="px-4 py-2 text-left font-semibold">Total Amount</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-4 py-2 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {completedOrders.map(order => (
                  <OrderRow
                    key={order.supplier_order_id}
                    order={order}
                    isCompleted
                    onEditStatus={() => handleEditStatus(order)}
                    onDelete={() => handleDelete(order.supplier_order_id)}
                    isSupplier={role === 'supplier'}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // Helper component to fetch and display order items
  function OrderRow({ order, onStatusChange, updating, isCompleted, onEditStatus, onDelete, isSupplier, isActive }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      supplierOrdersAPI.getById(order.supplier_order_id)
        .then(res => setItems(res.data.items))
        .finally(() => setLoading(false));
    }, [order.supplier_order_id]);

    // Calculate cost and total cost for each item
    const costList = loading ? [] : items.map(i => {
      const price = Number(i.unit_price) || 0;
      const total = price * (i.quantity_ordered || 0);
      return { price, total };
    });
    const costStr = costList.map(c => `₱${c.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`).join(', ');
    const totalCostStr = costList.map(c => `₱${c.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`).join(', ');
    const totalAmount = costList.reduce((sum, c) => sum + c.total, 0);

    return (
      <tr className="border-b">
        <td className="px-4 py-2">{order.supplier_order_id}</td>
        <td className="px-4 py-2">{order.supplier_name || '-'}</td>
        <td className="px-4 py-2">{loading ? '...' : items.map(i => i.product_name).join(', ')}</td>
        <td className="px-4 py-2">{loading ? '...' : items.map(i => `${i.size || ''} ${i.color || ''}`.trim()).join(', ')}</td>
        <td className="px-4 py-2">{loading ? '...' : items.map(i => i.sku).join(', ')}</td>
        <td className="px-4 py-2">{loading ? '...' : items.map(i => i.quantity_ordered).join(', ')}</td>
        <td className="px-4 py-2">{costStr}</td>
        <td className="px-4 py-2">{totalCostStr}</td>
        <td className="px-4 py-2">{new Date(order.order_date).toLocaleString()}</td>
        <td className="px-4 py-2 font-semibold">₱{loading ? '...' : totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
        <td className="px-4 py-2 font-semibold">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </td>
        <td className="px-4 py-2">
          {/* Supplier actions for active orders */}
          {isSupplier && isActive && (order.status === 'Pending' || order.status === 'Shipped') && (
            <div className="flex gap-2">
              {order.status === 'Pending' && (
                <button
                  className="bg-green-500 text-white rounded p-2 cursor-pointer hover:bg-green-600 flex items-center justify-center text-base"
                  style={{ height: '32px', width: '32px' }}
                  disabled={updating}
                  onClick={() => onStatusChange(order.supplier_order_id, 'Shipped')}
                  title="Mark as Shipped"
                >
                  <FiTruck />
                </button>
              )}
              <button
                className="bg-red-500 text-white rounded p-2 cursor-pointer hover:bg-red-600 flex items-center justify-center text-base"
                style={{ height: '32px', width: '32px' }}
                disabled={updating}
                onClick={() => onStatusChange(order.supplier_order_id, 'Cancelled')}
                title="Cancel Order"
              >
                <FiX />
              </button>
            </div>
          )}
          {/* Admin actions for active orders */}
          {!isSupplier && isActive && order.status === 'Pending' && (
            <button
              className="bg-red-500 text-white rounded p-2 cursor-pointer hover:bg-red-600 flex items-center justify-center text-base"
              style={{ height: '32px', width: '32px' }}
              disabled={updating}
              onClick={() => onStatusChange(order.supplier_order_id, 'Cancelled')}
              title="Cancel Order"
            >
              <FiX />
            </button>
          )}
          {/* Admin actions for completed orders */}
          {!isSupplier && isCompleted && (
            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white rounded px-2 py-1 cursor-pointer hover:bg-blue-600 flex items-center justify-center"
                title="Edit Order Status"
                onClick={onEditStatus}
              >
                <FiEdit2 />
              </button>
              <button
                className="bg-red-500 text-white rounded px-2 py-1 cursor-pointer hover:bg-red-600 flex items-center justify-center"
                title="Delete Order"
                onClick={onDelete}
              >
                <FiTrash2 />
              </button>
            </div>
          )}
        </td>
      </tr>
    );
  }

  // Render content based on active tab
  const renderContent = () => {
    if (activeTab === 'orders') return renderOrders();
    if (activeTab === 'orderHistory') return renderOrderHistory();
    if (activeTab === 'suppliers' && role === 'admin') return renderSuppliers();
    return null;
  };

  // --- Admin Supplier Order Modal ---
  const renderOrderModal = () => (
    <>
      {showOrderModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-95 rounded-lg p-8 max-w-2xl w-full mx-4 shadow-2xl relative">
            <button
              onClick={() => setShowOrderModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
            >×</button>
            <h2 className="text-2xl font-bold text-custom-dark mb-4">Place Supplier Order</h2>
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-custom-dark font-medium mb-2">Select Supplier *</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  value={orderSupplierId}
                  onChange={e => setOrderSupplierId(e.target.value)}
                  required
                >
                  <option value="">-- Select Supplier --</option>
                  {suppliers.map(s => (
                    <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>
                  ))}
                </select>
              </div>
              {orderSupplierId && (
                <div>
                  <label className="block text-custom-dark font-medium mb-2">Add Product Variants</label>
                  <div className="max-h-48 overflow-y-auto border rounded-lg p-2 mb-2">
                    {orderVariants.length === 0 ? (
                      <div className="text-gray-400">No variants found for this supplier.</div>
                    ) : orderVariants.map(variant => {
                      const cartItem = orderCart.find(item => item.variant.variant_id === variant.variant_id);
                      // Find the product to get the price
                      const product = suppliers
                        .flatMap(sup => (sup.products || []))
                        .find(prod => prod && prod.product_id === variant.product_id);
                      const price = product ? Number(product.price) : 0;
                      return (
                        <div key={variant.variant_id} className="flex items-center gap-2 mb-2">
                          <input
                            type="checkbox"
                            checked={!!cartItem}
                            onChange={e => {
                              if (e.target.checked) {
                                handleAddToCart(variant, 1);
                              } else {
                                handleRemoveFromCart(variant.variant_id);
                              }
                            }}
                          />
                          <div className="flex-1">
                            <span className="font-semibold">{variant.product_name}</span>
                            <span className="text-xs text-gray-500 ml-2">SKU: {variant.sku}</span>
                            <span className="text-xs text-gray-500 ml-2">({variant.size || ''} {variant.color || ''})</span>
                          </div>
                          <span className="text-sm text-custom-dark font-semibold ml-2">₱{Number(variant.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {orderCart.length > 0 && (
                <div>
                  <label className="block text-custom-dark font-medium mb-2">Order Cart</label>
                  <ul className="border rounded-lg p-2 mb-2">
                    {orderCart.map(item => {
                      // Find the product to get the price
                      const product = orderVariants.find(v => v.variant_id === item.variant.variant_id);
                      const price = product ? Number(product.price) : 0;
                      const subtotal = price * item.quantity;
                      return (
                        <li key={item.variant.variant_id} className="flex items-center gap-2 mb-2">
                          <span className="flex-1">
                            <span className="font-semibold">{item.variant.product_name}</span>
                            <span className="text-xs text-gray-500 ml-2">SKU: {item.variant.sku}</span>
                            <span className="text-xs text-gray-500 ml-2">({item.variant.size || ''} {item.variant.color || ''})</span>
                          </span>
                          <input
                            type="number"
                            min="1"
                            className="w-20 px-2 py-1 border rounded"
                            value={item.quantity}
                            onChange={e => handleAddToCart(item.variant, Number(e.target.value))}
                            placeholder="Qty"
                          />
                          <span className="text-sm text-custom-dark font-semibold ml-2">₱{price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          <span className="text-sm text-custom-dark ml-2">Subtotal: ₱{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 ml-1"
                            onClick={() => handleRemoveFromCart(item.variant.variant_id)}
                          >Remove</button>
                        </li>
                      );
                    })}
                  </ul>
                  {/* Total amount */}
                  <div className="text-right font-bold text-lg text-custom-dark mt-2">
                    Total: ₱{orderCart.reduce((sum, item) => {
                      const product = orderVariants.find(v => v.variant_id === item.variant.variant_id);
                      const price = product ? Number(product.price) : 0;
                      return sum + price * item.quantity;
                    }, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-custom-dark font-medium mb-2">Notes (optional)</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                  placeholder="Enter any notes for the supplier (optional)"
                />
              </div>
              {orderError && <div className="text-red-500 text-sm">{orderError}</div>}
              {orderSuccess && <div className="text-green-600 text-sm">{orderSuccess}</div>}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-custom-dark text-custom-cream py-2 px-4 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
                  disabled={orderLoading}
                >
                  {orderLoading ? 'Placing Order...' : 'Place Order'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-poppins cursor-pointer"
                  disabled={orderLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-custom-dark font-poppins">Supplier Portal</h1>
          <p className="text-gray-600 font-nunito">{role === 'admin' ? 'Manage your suppliers and purchase orders' : 'View and manage your supplier orders'}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-white rounded-xl shadow-md p-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors duration-200 ${activeTab === tab.id ? 'bg-custom-dark text-custom-cream' : 'text-custom-dark hover:bg-gray-100'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="text-xl">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>
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
      {/* Admin Supplier Order Modal */}
      {role === 'admin' && renderOrderModal()}
    </div>
  );
} 