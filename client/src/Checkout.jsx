// client/src/Checkout.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    contact: '',
    email: '',
    paymentMethod: 'GCash',
    gcashNumber: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ['fullName', 'address', 'contact', 'email', 'gcashNumber'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert('Please fill out all fields.');
        return;
      }
    }

    localStorage.removeItem('cart');
    setShowConfirmation(true);
    setTimeout(() => navigate('/'), 4000); // auto-redirect after animation
  };

  return (
    <div className="font-poppins min-h-screen bg-custom-cream relative">
      <Navbar alwaysHovered={true} />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center text-custom-dark mb-8">Checkout</h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* FORM */}
        <form onSubmit={handleSubmit} autoComplete="on" className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <h2 className="text-xl font-semibold text-custom-dark">Shipping & Payment</h2>
          <input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            autoComplete="name"
          />
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            autoComplete="street-address"
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
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="GCash">GCash</option>
            <option value="Paymaya">Paymaya</option>
            <option value="CashOnDelivery">Cash on Delivery</option>
          </select>
          {(formData.paymentMethod === 'GCash' || formData.paymentMethod === 'Paymaya') && (
            <input
              name="gcashNumber"
              placeholder={`${formData.paymentMethod} Number`}
              value={formData.gcashNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              autoComplete="off"
            />
          )}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition-all"
          >
            Place Order
          </button>
        </form>

        {/* SUMMARY */}
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

      {/* Success Message Display */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-40">
          {successMessage}
        </div>
      )}

      {/* ✅ Confirmation Animation */}
      {showConfirmation && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-lg text-center shadow-2xl transform scale-100 animate-scaleIn">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Order Placed Successfully!</h2>
            <p className="text-custom-dark">Redirecting to homepage...</p>
          </div>
        </div>
      )}

      {/* Tailwind Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0 }
            to { transform: scale(1); opacity: 1 }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease forwards;
          }
          .animate-scaleIn {
            animation: scaleIn 0.4s ease forwards;
          }
        `}
      </style>

            {/* Footer */}
      <footer className="bg-white font-kanit border-t border-custom-medium mt-8">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Left Side - Timeless Threads with Instagram */}
            <div className="flex flex-col items-start space-y-2">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-1">
                Timeless Threads
              </h3>
              <a href="#" className="text-custom-dark hover:text-custom-medium mt-1" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zm8.5 1.5A4.25 4.25 0 0120.5 7.75v8.5a4.25 4.25 0 01-4.25 4.25h-8.5A4.25 4.25 0 013.5 16.25v-8.5A4.25 4.25 0 017.75 3.5h8.5zm-6.5 2.75a4.75 4.75 0 100 9.5 4.75 4.75 0 000-9.5zm0 1.5a3.25 3.25 0 110 6.5 3.25 3.25 0 010-6.5zm6.75-.5a.75.75 0 100 1.5.75.75 0 000-1.5z"/>
                </svg>
              </a>
            </div>

            {/* Help Section */}
            <div className="flex flex-col items-start space-y-2">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-2">
                Help
              </h3>
              {['Shipping', 'Returns', 'FAQs', 'Sizing Guide', 'Product Care', 'Contact Us'].map((text, idx) => (
                <a key={idx} href="#" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">
                  {text}
                </a>
              ))}
            </div>

            {/* About and Contact Info */}
            <div className="flex flex-col items-start space-y-2">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-2">
                About Us
              </h3>
              <h4 className="text-custom-dark text-[11px] uppercase tracking-widest mt-2 mb-1 font-semibold">Contact Info</h4>
              <span className="text-custom-dark text-[11px] italic">+63 1234567890</span>
            </div>

            {/* Payment Options */}
            <div className="flex flex-col items-start space-y-4 w-full">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-2 invisible">Payment Options</h3>
              <div className="flex space-x-3 mt-2">
                <svg className="w-6 h-6 text-custom-dark" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.5 3A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3h-15zM6 8h12v2H6V8zm0 4h8v2H6v-2z" />
                </svg>
                <span className="bg-gray-200 rounded px-2 py-1 text-custom-dark text-xs font-bold flex items-center" style={{ height: '22px' }}>GCash</span>
              </div>
            </div>
          </div>
          <div className="mt-8 text-custom-dark text-[10px] font-kanit flex flex-wrap items-center gap-2">
            <span>&copy; 2025 TIMELESS THREADS</span>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms & Conditions</a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default Checkout;
