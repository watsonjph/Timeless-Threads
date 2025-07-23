import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { ordersAPI } from './api/apiService';
import { FiEye } from 'react-icons/fi';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [viewOrderLoading, setViewOrderLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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

  const handleOrderReceived = async (orderId) => {
    try {
      await ordersAPI.markOrderCompleted(orderId);
      setOrders(orders => orders.map(order =>
        order.order_id === orderId ? { ...order, status: 'Completed' } : order
      ));
    } catch (err) {
      alert('Failed to mark order as completed.');
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('You must be logged in to view your order history.');
      setLoading(false);
      return;
    }
    ordersAPI.getUserOrders(userId)
      .then(res => {
        setOrders(res.data.orders || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch orders.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-custom-cream font-poppins">
      <Navbar alwaysHovered={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-custom-dark mb-8">Order History</h1>
          {loading ? (
            <div className="text-center py-12 text-gray-500 text-lg">Loading...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500 text-lg">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No orders found.</p>
              <p className="text-gray-400 mt-2">Your order history will appear here once you make purchases.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order.order_id}>
                      <td className="px-6 py-4 whitespace-nowrap">{order.order_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(order.order_date).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDeliveryStatusColor(order.delivery_status)}`}>
                          {order.delivery_status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">₱{Number(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-row items-center gap-2">
                          <button
                            className={
                              order.delivery_status?.toLowerCase() === 'delivered' && order.status.toLowerCase() === 'verified'
                                ? 'h-8 px-3 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer flex items-center'
                                : 'h-8 px-3 text-xs bg-gray-700 text-white rounded opacity-60 cursor-not-allowed flex items-center'
                            }
                            style={{ minWidth: '110px' }}
                            onClick={() => {
                              if (order.delivery_status?.toLowerCase() === 'delivered' && order.status.toLowerCase() === 'verified') {
                                handleOrderReceived(order.order_id);
                              }
                            }}
                            title={
                              order.delivery_status?.toLowerCase() === 'delivered' && order.status.toLowerCase() === 'verified'
                                ? 'Mark as Completed'
                                : 'Order can only be marked as received when delivered and verified'
                            }
                            disabled={!(order.delivery_status?.toLowerCase() === 'delivered' && order.status.toLowerCase() === 'verified')}
                          >
                            Order Received
                          </button>
                          <button
                            className="h-8 w-8 bg-custom-dark text-custom-cream rounded hover:bg-custom-mint transition flex items-center justify-center cursor-pointer"
                            style={{ minWidth: '32px', minHeight: '32px' }}
                            title="View Order Details"
                            onClick={async () => {
                              setViewOrderLoading(true);
                              try {
                                const res = await fetch(`/api/orders/${order.order_id}`);
                                const data = await res.json();
                                setViewOrder(data.order);
                                setShowViewModal(true);
                              } catch {
                                alert('Failed to load order details.');
                              } finally {
                                setViewOrderLoading(false);
                              }
                            }}
                          >
                            <FiEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* View Order Modal */}
          {showViewModal && viewOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-8 max-w-lg w-full mx-4 shadow-2xl relative">
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
                  onClick={() => { setShowViewModal(false); setViewOrder(null); }}
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold mb-4 text-custom-dark">Order Details</h2>
                {viewOrderLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading order details...</div>
                ) : (
                  <>
                    <div className="mb-4">
                      <div><b>Order #:</b> {viewOrder.order_id}</div>
                      <div><b>Date Ordered:</b> {new Date(viewOrder.order_date).toLocaleString()}</div>
                      <div><b>Status:</b> <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(viewOrder.status)}`}>{viewOrder.status}</span></div>
                      <div><b>Delivery Status:</b> <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDeliveryStatusColor(viewOrder.delivery_status)}`}>{viewOrder.delivery_status || 'Pending'}</span></div>
                    </div>
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Items Ordered</h3>
                      <table className="min-w-full text-sm border">
                        <thead>
                          <tr>
                            <th className="px-2 py-1 border">Product</th>
                            <th className="px-2 py-1 border">Quantity</th>
                            <th className="px-2 py-1 border">Unit Cost</th>
                            <th className="px-2 py-1 border">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(viewOrder.items || []).map(item => (
                            <tr key={item.order_items_id || item.sku}>
                              <td className="px-2 py-1 border">{item.product_name || item.sku}</td>
                              <td className="px-2 py-1 border text-center">{item.quantity}</td>
                              <td className="px-2 py-1 border text-right">₱{Number(item.unitPrice || item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                              <td className="px-2 py-1 border text-right">₱{Number(item.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-right font-bold text-lg mt-4">
                      Total: ₱{Number(viewOrder.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 