import React, { useState, useEffect } from 'react';
import { adminOrdersAPI } from './api/apiService';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingPayment, setEditingPayment] = useState({ payment_status: '', disputed: false });

  useEffect(() => {
    // Admin-only access
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/');
      return;
    }
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminOrdersAPI.getAll();
      setOrders(res.data.orders || []);
    } catch (err) {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'delivery-in-progress':
        return 'bg-sky-100 text-sky-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder({ ...order });
    setEditingPayment({
      payment_status: order.payment_status || 'pending',
      disputed: !!order.disputed
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingOrder(null);
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      // Update order fields
      const { status, payment_verified, shipping_street_address, shipping_barangay, shipping_city, shipping_province, shipping_postal_code } = editingOrder;
      await adminOrdersAPI.update(editingOrder.order_id, {
        status,
        payment_verified,
        shipping_street_address,
        shipping_barangay,
        shipping_city,
        shipping_province,
        shipping_postal_code,
      });
      // Update fulfillment status
      if (editingOrder.delivery_status) {
        await adminOrdersAPI.updateFulfillment(editingOrder.order_id, editingOrder.delivery_status);
      }
      // Update payment status/disputed
      if (editingOrder.payment_id) {
        await adminOrdersAPI.updatePaymentStatusAndDisputed(editingOrder.payment_id, {
          payment_status: editingPayment.payment_status,
          disputed: editingPayment.disputed
        });
      }
      setUpdateMessage('Order updated successfully!');
      setShowEditModal(false);
      setEditingOrder(null);
      setEditingPayment({ payment_status: '', disputed: false });
      fetchOrders();
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch {
      setError('Failed to update order.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await adminOrdersAPI.delete(orderId);
      setUpdateMessage('Order deleted successfully!');
      fetchOrders();
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch {
      setError('Failed to delete order.');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-dark mx-auto"></div>
          <p className="mt-4 text-custom-dark">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-cream flex">
      <Sidebar />
      <main className="flex-1 p-8 md:ml-64">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-custom-dark">Order Management</h1>
            <div className="flex gap-3">
              <button
                onClick={fetchOrders}
                className="bg-custom-dark text-custom-cream px-4 py-2 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Messages */}
          {updateMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {updateMessage}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Orders Table */}
          <div className="overflow-x-auto mb-12">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Fulfillment #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipped Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Verified</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Received</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disputed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barangay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Province</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Postal Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification Notes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{order.order_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.user_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(order.order_date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.order_fulfillment_id || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDeliveryStatusColor(order.delivery_status)}`}>
                        {order.delivery_status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.shipped_date ? new Date(order.shipped_date).toLocaleString() : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.delivery_date ? new Date(order.delivery_date).toLocaleString() : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.tracking_number || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.payment_verified ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.payment_method || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.amount ? `₱${Number(order.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.amount_received ? `₱${Number(order.amount_received).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.payment_status || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.disputed ? 'True' : 'False'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.shipping_street_address || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.shipping_barangay || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.shipping_city || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.shipping_province || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.shipping_postal_code || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.verification_notes || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        className="bg-blue-500 text-white rounded px-2 py-1 cursor-pointer hover:bg-blue-600"
                        title="Edit Order"
                        onClick={() => handleEditOrder(order)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="bg-red-500 text-white rounded px-2 py-1 cursor-pointer hover:bg-red-600"
                        title="Delete Order"
                        onClick={() => handleDeleteOrder(order.order_id)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found.</p>
            </div>
          )}
        </div>
      </main>
      {showEditModal && editingOrder && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-custom-dark">Edit Order</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateOrder} className="space-y-4">
              <div>
                <label className="block text-custom-dark font-medium mb-2">Status</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  value={editingOrder.status}
                  onChange={e => setEditingOrder(s => ({ ...s, status: e.target.value }))}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Payment Verified</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  value={editingOrder.payment_verified ? 'true' : 'false'}
                  onChange={e => setEditingOrder(s => ({ ...s, payment_verified: e.target.value === 'true' }))}
                  required
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Delivery Status</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  value={editingOrder.delivery_status || 'Pending'}
                  onChange={e => setEditingOrder(s => ({ ...s, delivery_status: e.target.value }))}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Delivery-In-Progress">Delivery-In-Progress</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Shipped Date</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  value={editingOrder.shipped_date ? new Date(editingOrder.shipped_date).toISOString().slice(0,16) : ''}
                  onChange={e => setEditingOrder(s => ({ ...s, shipped_date: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Delivery Date</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  value={editingOrder.delivery_date ? new Date(editingOrder.delivery_date).toISOString().slice(0,16) : ''}
                  onChange={e => setEditingOrder(s => ({ ...s, delivery_date: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Tracking Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  value={editingOrder.tracking_number || ''}
                  onChange={e => setEditingOrder(s => ({ ...s, tracking_number: e.target.value }))}
                  placeholder="Tracking Number"
                />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Payment Status</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  value={editingPayment.payment_status}
                  onChange={e => setEditingPayment(s => ({ ...s, payment_status: e.target.value }))}
                  required
                >
                  <option value="pending">pending</option>
                  <option value="receipt_uploaded">receipt_uploaded</option>
                  <option value="verified">verified</option>
                  <option value="failed">failed</option>
                  <option value="disputed">disputed</option>
                </select>
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Disputed</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  value={editingPayment.disputed ? 'true' : 'false'}
                  onChange={e => setEditingPayment(s => ({ ...s, disputed: e.target.value === 'true' }))}
                  required
                >
                  <option value="false">False</option>
                  <option value="true">True</option>
                </select>
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Address</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  value={editingOrder.shipping_street_address || ''}
                  onChange={e => setEditingOrder(s => ({ ...s, shipping_street_address: e.target.value }))}
                  placeholder="Street Address"
                />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Barangay</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  value={editingOrder.shipping_barangay || ''}
                  onChange={e => setEditingOrder(s => ({ ...s, shipping_barangay: e.target.value }))}
                  placeholder="Barangay"
                />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">City</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  value={editingOrder.shipping_city || ''}
                  onChange={e => setEditingOrder(s => ({ ...s, shipping_city: e.target.value }))}
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Province</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  value={editingOrder.shipping_province || ''}
                  onChange={e => setEditingOrder(s => ({ ...s, shipping_province: e.target.value }))}
                  placeholder="Province"
                />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Postal Code</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  value={editingOrder.shipping_postal_code || ''}
                  onChange={e => setEditingOrder(s => ({ ...s, shipping_postal_code: e.target.value }))}
                  placeholder="Postal Code"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-custom-dark text-custom-cream py-2 px-4 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
                >
                  Update Order
                </button>
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-poppins"
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