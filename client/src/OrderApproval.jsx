import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { adminOrdersAPI } from './api/apiService';
import { FiEye } from 'react-icons/fi';

export default function OrderApproval() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [amountReceived, setAmountReceived] = useState('');
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

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
      const res = await adminOrdersAPI.getPending();
      setOrders(res.data.orders || []);
    } catch (err) {
      setError('Failed to fetch pending orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setViewOrder(order);
    setAmountReceived(order.amount || '');
    setNotes(order.verification_notes || '');
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewOrder(null);
    setAmountReceived('');
    setNotes('');
    setActionLoading(false);
  };

  const handleApproveOrder = async () => {
    if (!amountReceived) return;
    setActionLoading(true);
    try {
      await adminOrdersAPI.verifyPayment(viewOrder.payment_id, {
        amount_received: amountReceived,
        verification_notes: notes,
        status: 'verified'
      });
      setShowViewModal(false);
      fetchOrders();
    } catch {
      alert('Failed to approve order.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setActionLoading(true);
    try {
      await adminOrdersAPI.cancelOrder(viewOrder.order_id, { verification_notes: notes });
      setShowViewModal(false);
      fetchOrders();
    } catch {
      alert('Failed to cancel order.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-custom-cream flex">
      <Sidebar />
      <main className="flex-1 p-8 md:ml-64">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-custom-dark">Order Approval</h1>
            <button
              onClick={fetchOrders}
              className="bg-custom-dark text-custom-cream px-4 py-2 rounded-lg hover:bg-custom-mint transition font-poppins cursor-pointer"
            >
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-500 text-lg">Loading...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500 text-lg">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No pending orders found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto mb-12">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order.order_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{order.order_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.user_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(order.order_date).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.payment_method}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.payment_id || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.amount ? `₱${Number(order.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.reference_number || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          className="bg-blue-500 text-white rounded px-2 py-1 cursor-pointer hover:bg-blue-600"
                          title="View Order"
                          onClick={() => handleViewOrder(order)}
                        >
                          <FiEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      {showViewModal && viewOrder && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl relative">
            <button
              onClick={handleCloseViewModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-custom-dark mb-4">Order Details</h2>
            <div className="space-y-2 mb-4">
              <div><b>Order #:</b> {viewOrder.order_id}</div>
              <div><b>User ID:</b> {viewOrder.user_id}</div>
              <div><b>Order Date:</b> {new Date(viewOrder.order_date).toLocaleString()}</div>
              <div><b>Payment Method:</b> {viewOrder.payment_method}</div>
              <div><b>Payment ID:</b> {viewOrder.payment_id || '-'}</div>
              <div><b>Amount:</b> {viewOrder.amount ? `₱${Number(viewOrder.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}</div>
              <div><b>Reference #:</b> {viewOrder.reference_number || '-'}</div>
            </div>
            <hr className="my-4" />
            <form onSubmit={e => { e.preventDefault(); handleApproveOrder(); }} className="space-y-4">
              <div>
                <label className="block text-custom-dark font-medium mb-2">Amount Received</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  value={amountReceived}
                  onChange={e => setAmountReceived(e.target.value)}
                  placeholder="Enter amount received"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-2">Notes</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-dark"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Enter notes (optional)"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition font-poppins cursor-pointer"
                  disabled={actionLoading}
                >
                  Cancel Order
                </button>
                <button
                  type="submit"
                  className={`flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-poppins cursor-pointer ${!amountReceived ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!amountReceived || actionLoading}
                >
                  Approve Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 