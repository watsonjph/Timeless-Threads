// client/src/Checkout.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    streetAddress: '',
    barangay: '',
    city: '',
    province: '',
    postalCode: '',
    contact: '',
    email: '',
    paymentMethod: 'GCash'
  });
  const [currentStep, setCurrentStep] = useState('details'); // 'details' or 'payment'
  const [showQRModal, setShowQRModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showRefModal, setShowRefModal] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for success message from login/registration
    if (location.state && location.state.success) {
      setSuccessMessage(location.state.success);
      // Clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }

    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem('username');
    if (!isLoggedIn) {
      alert('Please log in to checkout.');
      navigate('/login?returnTo=checkout');
      return;
    }

    // Check if cart is empty
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (storedCart.length === 0) {
      alert('Cart is empty. Redirecting to products.');
      navigate('/products');
      return;
    }

    setCartItems(storedCart);

    // Pre-fill form with user data if available
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchUserData(userId);
    }
  }, [navigate, location.state]);

  const fetchUserData = async (userId) => {
    try {
      const res = await fetch(`/api/auth/user/${userId}`);
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({
          ...prev,
          email: data.email || '',
          fullName: `${data.firstName || ''} ${data.lastName || ''}`.trim()
        }));
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ['fullName', 'streetAddress', 'barangay', 'city', 'province', 'postalCode', 'contact', 'email'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert('Please fill out all fields.');
        return;
      }
    }

    setCurrentStep('payment');
  };

  const handlePaymentConfirm = () => {
    setShowRefModal(true);
  };

  const handleCompletePurchase = async () => {
    try {
      // Create order in backend
      const orderData = {
        userId: localStorage.getItem('userId'),
        items: cartItems.map(item => ({
          variantId: item.variant_id || null, // Use variant_id from cart item, fallback to null
          sku: item.sku, // Include SKU as fallback
          quantity: item.quantity,
          price: item.price
        })),
        shipping: {
          fullName: formData.fullName, // Will be stored as shipping_full_name
          contact: formData.contact,   // Will be stored as shipping_contact_number
          address: formData.streetAddress, // Will be stored as shipping_street_address
          barangay: formData.barangay,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          email: formData.email
        },
        payment: {
          method: formData.paymentMethod,
          referenceNumber: referenceNumber.trim()
        },
        totalAmount: totalPrice
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const orderResult = await response.json();
      setShowRefModal(false);
      setReferenceNumber('');
      setAcknowledged(false);
      // Clear cart
      localStorage.removeItem('cart');
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      // Navigate to order confirmation
      navigate(`/order-confirmation/${orderResult.orderId}`);
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const handleCancel = () => {
    setCurrentStep('details');
  };

  const openQRModal = () => {
    setShowQRModal(true);
  };

  const closeQRModal = () => {
    setShowQRModal(false);
  };

  return (
    <div className="font-poppins min-h-screen bg-custom-cream relative">
      <Navbar alwaysHovered={true} />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center text-custom-dark mb-8">Checkout</h1>

        {currentStep === 'details' ? (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* SHIPPING FORM */}
            <form onSubmit={handleDetailsSubmit} autoComplete="on" className="bg-white p-6 rounded-lg shadow-lg space-y-4">
              <h2 className="text-xl font-semibold text-custom-dark">Shipping Details</h2>
              <input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                autoComplete="name"
              />
              <input
                name="streetAddress"
                placeholder="Street Address"
                value={formData.streetAddress}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                autoComplete="street-address"
              />
              <input
                name="barangay"
                placeholder="Barangay"
                value={formData.barangay}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
              <input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
              <input
                name="province"
                placeholder="Province"
                value={formData.province}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
              <input
                name="postalCode"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
              <input
                name="contact"
                placeholder="Contact Number"
                value={formData.contact}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                autoComplete="tel"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                autoComplete="email"
              />
              
              <h3 className="text-lg font-semibold text-custom-dark mt-6">Payment Method</h3>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option value="GCash">GCash</option>
                <option value="Maya">Maya</option>
              </select>
              
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-all font-semibold cursor-pointer"
              >
                Continue to Payment
              </button>
            </form>

            {/* ORDER SUMMARY */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-custom-dark mb-4">Order Summary</h2>
              <ul className="space-y-4">
                {cartItems.map((item, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₱{(item.price * item.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t mt-4 pt-4 text-lg font-bold text-right">
                Total: ₱{totalPrice.toLocaleString()}
              </div>
            </div>
          </div>
        ) : (
          /* PAYMENT INSTRUCTIONS PAGE */
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-4">
                          <button
              onClick={handleCancel}
              className="flex items-center text-custom-dark hover:text-gray-600 transition-colors duration-200 cursor-pointer"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Shipping Details
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-custom-dark mb-2">Payment Instructions</h2>
                <p className="text-gray-600">Please follow the steps below to complete your payment</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LEFT SIDE - INSTRUCTIONS */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-custom-dark mb-3">Step 1: Scan QR Code</h3>
                    <p className="text-gray-700 mb-4">
                      Open your {formData.paymentMethod} app and scan the QR code on the right.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-custom-dark mb-3">Step 2: Send Payment</h3>
                    <p className="text-gray-700 mb-4">
                      Send the exact amount: <span className="font-bold text-lg">₱{totalPrice.toLocaleString()}</span>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-custom-dark mb-3">Step 3: Confirm Payment</h3>
                    <p className="text-gray-700 mb-4">
                      After sending the payment, click the "I have paid" button below.
                    </p>
                  </div>

                  {/* WARNING MESSAGE */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Payment Notice</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• If payment received is below the required amount, your order will be cancelled</li>
                      <li>• You will receive a refund minus processing fees</li>
                      <li>• If payment is over the required amount, no refund will be given for the excess</li>
                      <li>• Please ensure you send the exact amount: ₱{totalPrice.toLocaleString()}</li>
                    </ul>
                  </div>
                </div>

                {/* RIGHT SIDE - QR CODE */}
                <div className="flex flex-col items-center">
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
                    <img
                      src={`/images/payment/${formData.paymentMethod.toLowerCase()}_payment.jpg`}
                      alt={`${formData.paymentMethod} QR Code`}
                      className="w-64 h-64 object-contain cursor-pointer hover:opacity-90 transition-opacity duration-200"
                      onClick={openQRModal}
                      onError={(e) => {
                        e.target.src = '/images/payment/placeholder-qr.png';
                        e.target.alt = 'QR Code Placeholder';
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Click the QR code to enlarge • Scan with your {formData.paymentMethod} app
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-full hover:bg-gray-600 transition-all font-semibold cursor-pointer"
                >
                  Cancel Order
                </button>
                <button
                  onClick={handlePaymentConfirm}
                  className="flex-1 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  I Have Paid ₱{totalPrice.toLocaleString()}
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Success Message Display */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-40">
          {successMessage}
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeQRModal}
        >
          <div className="bg-white p-8 rounded-lg max-w-md mx-4 relative" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={closeQRModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Modal Content */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-custom-dark mb-4">
                {formData.paymentMethod} QR Code
              </h3>
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 mb-4">
                <img
                  src={`/images/payment/${formData.paymentMethod.toLowerCase()}_payment.jpg`}
                  alt={`${formData.paymentMethod} QR Code`}
                  className="w-80 h-80 object-contain mx-auto"
                  onError={(e) => {
                    e.target.src = '/images/payment/placeholder-qr.png';
                    e.target.alt = 'QR Code Placeholder';
                  }}
                />
              </div>
              <p className="text-sm text-gray-600">
                Scan this QR code with your {formData.paymentMethod} app
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Amount to send: <span className="font-bold text-custom-dark">₱{totalPrice.toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reference Number Modal */}
      {showRefModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl relative">
            <button
              onClick={() => { setShowRefModal(false); setReferenceNumber(''); setAcknowledged(false); }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-custom-dark mb-4">Payment Reference Number</h2>
            <p className="mb-4 text-gray-700">Please enter the reference number from your payment receipt and confirm you have sent the exact amount.</p>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded mb-4"
              placeholder="Reference Number"
              value={referenceNumber}
              onChange={e => setReferenceNumber(e.target.value)}
            />
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="acknowledge"
                checked={acknowledged}
                onChange={e => setAcknowledged(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="acknowledge" className="text-gray-700 select-none">
                I acknowledge and confirm that I have sent the exact amount
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowRefModal(false); setReferenceNumber(''); setAcknowledged(false); }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-poppins cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompletePurchase}
                className={`flex-1 py-2 px-4 rounded-lg font-poppins text-white ${referenceNumber && acknowledged ? 'bg-green-600 hover:bg-green-700 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
                disabled={!(referenceNumber && acknowledged)}
              >
                Complete Purchase
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Checkout;
