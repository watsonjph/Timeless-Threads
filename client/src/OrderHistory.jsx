import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { ordersAPI } from './api/apiService';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      default:
        return 'bg-gray-100 text-gray-800';
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 