import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
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
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Order not found');
        }
        const orderData = await response.json();
        console.log('Order data received:', orderData);
        setOrder(orderData.order);
      } catch (err) {
        setError('Failed to load order details');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="font-poppins min-h-screen bg-custom-cream">
        <Navbar alwaysHovered={true} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-dark mx-auto mb-4"></div>
            <p className="text-custom-dark">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="font-poppins min-h-screen bg-custom-cream">
        <Navbar alwaysHovered={true} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h2>
            <p className="text-custom-dark mb-6">{error || 'The order you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-poppins min-h-screen bg-custom-cream">
      <Navbar alwaysHovered={true} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-custom-dark mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Your order has been placed successfully</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Order Info */}
            <div>
              <h2 className="text-xl font-semibold text-custom-dark mb-4">Order Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Order ID:</span>
                  <span className="ml-2 text-custom-dark">#{order.order_id}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Order Date:</span>
                  <span className="ml-2 text-custom-dark">
                    {new Date(order.order_date).toLocaleDateString('en-PH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Payment Method:</span>
                  <span className="ml-2 text-custom-dark">{order.payment_method || 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Payment Status:</span>
                  <span className="ml-2 text-custom-dark">{order.payment?.status || 'Pending'}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Total Amount:</span>
                  <span className="ml-2 text-custom-dark font-bold text-lg">₱{order.total_amount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Shipping Info */}
            <div>
              <h2 className="text-xl font-semibold text-custom-dark mb-4">Shipping Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Address:</span>
                  <span className="ml-2 text-custom-dark">
                    {order.shipping_street_address}
                    {order.shipping_barangay && `, ${order.shipping_barangay}`}
                    {order.shipping_city && `, ${order.shipping_city}`}
                    {order.shipping_province && `, ${order.shipping_province}`}
                    {order.shipping_postal_code && ` ${order.shipping_postal_code}`}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Order Status:</span>
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Delivery Status:</span>
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDeliveryStatusColor(order.delivery_status)}`}>
                    {order.delivery_status || 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-custom-dark mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <h3 className="font-semibold text-custom-dark">{item.product_name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-custom-dark">₱{(item.unit_price * item.quantity).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">₱{item.unit_price.toLocaleString()} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-yellow-800">Payment Pending Verification</h3>
          </div>
          <p className="text-yellow-700 mb-4">
            Your order has been placed successfully, but payment verification is pending. 
            Our team will review your payment and update the order status within 24 hours.
          </p>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">What happens next?</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• We'll verify your payment within 24 hours</li>
              <li>• You'll receive an email confirmation once verified</li>
              <li>• Your order will be processed and shipped</li>
              <li>• You can track your order status in your account</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/order-history')}
            className="flex-1 bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-all font-semibold"
          >
            View Order History
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-500 text-white py-3 rounded-full hover:bg-gray-600 transition-all font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 