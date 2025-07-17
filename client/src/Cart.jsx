import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< Updated upstream
import logo from '/images/Timeless.png';
import logoInverted from '/images/Timeless-Inverted.png';
=======
import Navbar from './Navbar';
import { FaInstagram, FaPaypal } from 'react-icons/fa';
import { productsTop, productsBottom } from './ProductData';

const allProducts = [...productsTop, ...productsBottom];
>>>>>>> Stashed changes

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

    const updatedCart = storedCart.map((item) => {
      const match = allProducts.find((prod) => prod.sku === item.sku);
      const imagePath = match
        ? `/images/products/${match.type.charAt(0).toUpperCase() + match.type.slice(1)}/${match.image}`
        : '';
      return match ? { ...item, image: imagePath } : item;
    });

    setCartItems(updatedCart);
  }, []);

  const removeFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

<<<<<<< Updated upstream
=======
  const handleCheckout = () => {
    const isLoggedIn = !!localStorage.getItem('username');
    if (!isLoggedIn) {
      alert('Please log in to proceed to checkout.');
      window.location.href = '/login?returnTo=checkout';
      return;
    }
    window.location.href = '/checkout';
  };

>>>>>>> Stashed changes
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

      <main className="flex-1 px-4 py-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-custom-dark mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-custom-dark">Your cart is empty.</p>
        ) : (
          <div className="w-full max-w-4xl space-y-6">
            {cartItems.map((item, index) => {
              const slug = encodeURIComponent(item.name.toLowerCase().replace(/\s+/g, '-'));
              const productLink = `/products/${item.type}/${slug}`;

              return (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg flex items-center p-4 justify-between transition-transform hover:scale-[1.01] duration-300"
                >
                  <Link to={productLink} className="flex items-center gap-4 group">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-contain group-hover:opacity-90 transition"
                    />
                    <div>
                      <h2 className="text-custom-dark font-semibold">
                        {item.name}
                      </h2>
                      <p className="text-sm text-gray-600">₱{item.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-red-500 hover:text-red-700 font-bold transition"
                  >
                    Remove
                  </button>
                </div>
              );
            })}



            <div className="text-right text-custom-dark text-xl font-bold pt-4 border-t border-gray-300 space-y-4">
<<<<<<< Updated upstream
                <p>Total: ₱{totalPrice.toLocaleString()}</p>
            <Link
                to="/checkout"
                className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all duration-300 ease-in-out">
                Proceed to Checkout
            </Link>
=======
              <p>Total: ₱{totalPrice.toLocaleString()}</p>
              <button
                onClick={handleCheckout}
                className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all duration-300 ease-in-out"
              >
                Proceed to Checkout
              </button>
>>>>>>> Stashed changes
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

      {/* Footer remains unchanged */}
      <footer className="bg-white font-kanit border-t border-custom-medium mt-8">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-start space-y-2">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-1">
                Timeless Threads
              </h3>
              <a href="#" className="text-custom-dark hover:text-custom-medium mt-1" aria-label="Instagram">
                <FaInstagram size={18} />
              </a>
            </div>

            <div className="flex flex-col items-start space-y-2">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-2">Help</h3>
              <Link to="/faqs#shipping" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">Shipping</Link>
              <Link to="/faqs#returns" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">Returns</Link>
              <Link to="/faqs#faqs" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">FAQs</Link>
              <Link to="/faqs#sizing-guide" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">Sizing Guide</Link>
              <Link to="/faqs#product-care" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">Product Care</Link>
              <Link to="/faqs#contact-us" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">Contact Us</Link>
            </div>

            <div className="flex flex-col items-start space-y-2">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-2">About Us</h3>
              <h4 className="text-custom-dark text-[11px] uppercase tracking-widest mt-2 mb-1 font-semibold">Contact Info</h4>
              <span className="text-custom-dark text-[11px] italic">+63 1234567890</span>
            </div>

            <div className="flex flex-col items-start space-y-4 w-full">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-2 invisible">Payment Options</h3>
              <div className="flex space-x-3 mt-2">
                <FaPaypal size={22} className="text-custom-dark" />
                <span className="bg-gray-200 rounded px-2 py-1 text-custom-dark text-xs font-bold flex items-center" style={{ height: '22px' }}>
                  GCash
                </span>
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
  );
};

export default Cart;
