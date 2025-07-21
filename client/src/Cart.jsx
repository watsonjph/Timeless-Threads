import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '/images/Timeless.png';
import logoInverted from '/images/Timeless-Inverted.png';
import Navbar from './Navbar';
import { FaInstagram, FaPaypal } from 'react-icons/fa';
import {
  productsTop,
  productsBottom,
  footwearProducts,
  accessoriesProducts,
} from './ProductData';

const allProducts = [
  ...productsTop,
  ...productsBottom,
  ...footwearProducts,
  ...accessoriesProducts,
];


const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

    // Fetch latest stock for each item
    const fetchStockForCart = async () => {
      const updatedCart = await Promise.all(storedCart.map(async (item) => {
        // Find product info for image and display
        const match = allProducts.find((prod) => prod.sku === item.sku);
        const folder = match?.type ? match.type.charAt(0).toUpperCase() + match.type.slice(1) : '';
        const imagePath = match ? `/images/products/${folder}/${match.image}` : '';
        try {
          const res = await fetch(`/api/products/stock/${item.sku}`);
          if (res.ok) {
            const data = await res.json();
            const totalStock = data.variants.reduce((total, v) => total + v.stock_quantity, 0);
            return { ...item, availableStock: totalStock, image: imagePath };
          } else {
            // fallback to previous availableStock or hardcoded stock
            return { ...item, availableStock: item.availableStock || item.stock, image: imagePath };
          }
        } catch (err) {
          return { ...item, availableStock: item.availableStock || item.stock, image: imagePath };
        }
      }));
      setCartItems(updatedCart);
    };

    fetchStockForCart();
  }, []);

  const removeFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    
    // Dispatch custom event to notify navbar of cart update
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return; // Don't allow quantity less than 1
    
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    
    // Dispatch custom event to notify navbar of cart update
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const increaseQuantity = (index) => {
    const item = cartItems[index];
    const maxStock = item.availableStock !== undefined ? item.availableStock : item.stock;
    if (item.quantity >= maxStock) {
      alert('Maximum available quantity reached.');
      return;
    }
    const newQuantity = item.quantity + 1;
    updateQuantity(index, newQuantity);
  };

  const decreaseQuantity = (index) => {
    const item = cartItems[index];
    const newQuantity = item.quantity - 1;
    if (newQuantity >= 1) {
      updateQuantity(index, newQuantity);
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );


  const handleCheckout = () => {
    const isLoggedIn = !!localStorage.getItem('username');
    if (!isLoggedIn) {
      alert('Please log in to proceed to checkout.');
      window.location.href = '/login?returnTo=checkout';
      return;
    }
    window.location.href = '/checkout';
  };

  return (
    <div className="font-poppins min-h-screen flex flex-col bg-custom-cream">
      <Navbar alwaysHovered={true} />

      <main className="flex-1 px-4 py-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-custom-dark mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-custom-dark">Your cart is empty.</p>
        ) : (
          <div className="w-full max-w-4xl space-y-6">
            {cartItems.map((item, index) => {
              const slug = encodeURIComponent(
                item.name.toLowerCase().replace(/\s+/g, '-')
              );


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
                      <h2 className="text-custom-dark font-semibold">{item.name}</h2>
                      <p className="text-sm text-gray-600">
                        ₱{item.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 font-semibold">
                        Total: ₱{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                  
                  <div className="flex items-center gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => decreaseQuantity(index)}
                        className="px-3 py-1 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-custom-dark font-semibold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(index)}
                        className="px-3 py-1 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 hover:text-red-700 font-bold transition cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="text-right text-custom-dark text-xl font-bold pt-4 border-t border-gray-300 space-y-4">
              <p>Total: ₱{totalPrice.toLocaleString()}</p>
              <button
                onClick={handleCheckout}
                className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all duration-300 ease-in-out"
              >
                Proceed to Checkout
              </button>
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
