import React from 'react';
import { Link } from 'react-router-dom';
import logo from '/images/Timeless.png';
import logoInverted from '/images/Timeless-Inverted.png';
import Navbar from './Navbar';
import { FaInstagram, FaPaypal } from 'react-icons/fa';
import { productsTop, productsBottom } from './ProductData';


// Filter for women's products only
const womensProducts = [...productsTop, ...productsBottom].filter(prod => prod.type === 'womens');

const Womens = () => {
  return (
    <div className="font-poppins min-h-screen flex flex-col">
      <Navbar alwaysHovered={true} />

      {/* Content */}
      <main className="flex-1 bg-custom-cream p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {womensProducts.map((prod, i) => {
          const slug = encodeURIComponent(prod.name.toLowerCase().replace(/\s+/g, '-'));
          const productPath = `/products/${prod.type}/${slug}`;
          const imagePath = `/images/products/Womens/${prod.image}`;

          return (
            <Link
              key={i}
              to={productPath}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center p-4"
            >
              <img
                src={imagePath}
                alt={prod.name}
                className="object-contain max-h-48 w-full mb-4"
              />
              <div className="text-custom-dark font-semibold text-lg text-center">
                {prod.name}
              </div>
              <div className="text-custom-dark font-bold mt-1 text-xl">
                ₱{prod.price.toLocaleString()}
              </div>
            </Link>
          );
        })}
      </main>

      {/* Footer */}
      <footer className="bg-white font-kanit border-t border-custom-medium mt-8">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand + IG */}
            <div className="flex flex-col items-start space-y-2">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-1">
                Timeless Threads
              </h3>
              <a href="#" className="text-custom-dark hover:text-custom-medium mt-1" aria-label="Instagram">
                <FaInstagram size={18} />
              </a>
            </div>

            {/* Help Links */}
            <div className="flex flex-col items-start space-y-2">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-2">
                Help
              </h3>
              <Link to="/faqs#shipping" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">Shipping</Link>
              <Link to="/faqs#returns" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">Returns</Link>
              <Link to="/faqs#faqs" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">FAQs</Link>
              <Link to="/faqs#sizing-guide" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">Sizing Guide</Link>
              <Link to="/faqs#product-care" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">Product Care</Link>
              <Link to="/faqs#contact-us" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">Contact Us</Link>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col items-start space-y-2">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-2">
                About Us
              </h3>
              <h4 className="text-custom-dark text-[11px] uppercase tracking-widest mt-2 mb-1 font-semibold">Contact Info</h4>
              <span className="text-custom-dark text-[11px] italic">+63 1234567890</span>
            </div>

            {/* Payment Icons */}
            <div className="flex flex-col items-start space-y-4 w-full">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-2 invisible">Payment Options</h3>
              <div className="flex space-x-3 mt-2">
                <FaPaypal size={22} className="text-custom-dark" />
                <span className="bg-gray-200 rounded px-2 py-1 text-custom-dark text-xs font-bold flex items-center" style={{ height: '22px' }}>GCash</span>
              </div>
            </div>
          </div>

          {/* Legal */}
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

export default Womens;
