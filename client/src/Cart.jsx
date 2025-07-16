// client/src/Cart.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '/images/Timeless.png';
import logoInverted from '/images/Timeless-Inverted.png';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const removeFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="font-poppins min-h-screen flex flex-col bg-custom-cream">
      {/* Header */}
      <header className="bg-transparent hover:bg-white transition-all duration-500 ease-in-out font-poppins group">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Left Navigation */}
            <nav className="flex items-center space-x-12 -ml-16">
              <Link to="/mens" className="text-white group-hover:text-black px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out uppercase tracking-wider relative group">
                <span>Men's</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-500 ease-in-out"></div>
              </Link>
              <Link to="/womens" className="text-white group-hover:text-black px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out uppercase tracking-wider relative group">
                <span>Women's</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-500 ease-in-out"></div>
              </Link>
              <Link to="/products" className="text-white group-hover:text-black px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out uppercase tracking-wider relative group">
                <span>All Products</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-500 ease-in-out"></div>
              </Link>
            </nav>

            {/* Center Logo */}
            <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
              <img src={logoInverted} alt="Timeless Threads" className="h-28 w-auto group-hover:opacity-0 transition-all duration-500 ease-in-out" />
              <img src={logo} alt="Timeless Threads" className="h-28 w-auto absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
            </Link>

            {/* Right Navigation */}
            <nav className="flex items-center space-x-8 mr-16">
              <Link to="/login" className="text-white group-hover:text-black px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out uppercase tracking-wider relative group">
                <span>Login</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-500 ease-in-out"></div>
              </Link>
              <Link to="/cart" className="text-white group-hover:text-black px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out flex items-center space-x-2 uppercase tracking-wider relative group">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span>CART</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-500 ease-in-out"></div>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-custom-dark mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-custom-dark">Your cart is empty.</p>
        ) : (
          <div className="w-full max-w-4xl space-y-6">
            {cartItems.map((item, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg flex items-center p-4 justify-between transition-transform hover:scale-[1.01] duration-300">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-contain" />
                  <div>
                    <h2 className="text-custom-dark font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-600">₱{item.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(index)}
                  className="text-red-500 hover:text-red-700 font-bold transition"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="text-right text-custom-dark text-xl font-bold pt-4 border-t border-gray-300 space-y-4">
                <p>Total: ₱{totalPrice.toLocaleString()}</p>
            <Link
                to="/checkout"
                className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all duration-300 ease-in-out">
                Proceed to Checkout
            </Link>
            </div>

          </div>
        )}

        <Link
          to="/"
          className="mt-10 inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all duration-300 ease-in-out"
        >
          Continue Shopping
        </Link>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-300 mt-16">
        <div className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-custom-dark">
          <div>
            <h3 className="font-bold mb-2">Timeless Threads</h3>
            <ul className="space-y-1">
              <li><Link to="#" className="hover:underline">Help</Link></li>
              <li><Link to="#" className="hover:underline">Shipping</Link></li>
              <li><Link to="#" className="hover:underline">Returns</Link></li>
              <li><Link to="#" className="hover:underline">FAQs</Link></li>
              <li><Link to="#" className="hover:underline">Sizing Guide</Link></li>
              <li><Link to="#" className="hover:underline">Product Care</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">About Us</h3>
            <ul className="space-y-1">
              <li><Link to="#" className="hover:underline">Contact Us</Link></li>
              <li><Link to="#" className="hover:underline">+63 1234567890</Link></li>
              <li><Link to="#" className="hover:underline">GCash</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Legal</h3>
            <ul className="space-y-1">
              <li><Link to="#" className="hover:underline">Privacy</Link></li>
              <li><Link to="#" className="hover:underline">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div className="text-gray-400 text-xs col-span-2 md:col-span-1 mt-6 md:mt-0">
            <p>© 2025 TIMELESS THREADS</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
