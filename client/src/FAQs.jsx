// client/src/FAQs.jsx
import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { FaInstagram, FaPaypal } from 'react-icons/fa';

const FAQs = () => {
  return (
    <div className="font-poppins min-h-screen bg-custom-cream flex flex-col">
      <Navbar alwaysHovered={true} />
      <div className="p-8 max-w-4xl mx-auto flex-grow">
        <h1 id="faqs" className="text-3xl font-bold mb-8 text-custom-dark">Frequently Asked Questions</h1>

        {/* Video Tutorial Placeholder */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-custom-dark mb-2">Watch Our Quick Start Tutorial</h2>
          <video controls className="w-full rounded-lg shadow-lg">
            <source src="/videos/dummy.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="text-sm text-gray-600 mt-2">
            Having trouble? This short video shows you how to shop, checkout, and track your orders.
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 id="help" className="text-xl font-semibold text-custom-dark">How do I place an order?</h2>
            <p className="text-gray-700">Browse our products via the navigation bar. Select your item, click "Add to Cart", and head to the Cart to review. When you're ready, proceed to Checkout.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-custom-dark">Can I use the website without an account?</h2>
            <p className="text-gray-700">Yes, you can browse and add to cart. But to complete your purchase, you'll need to log in or create an account to ensure order tracking and secure checkout.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-custom-dark">Where can I view all my orders?</h2>
            <p className="text-gray-700">Go to the "Account" page once logged in, then select "Order History" to see all your past purchases and order statuses.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-custom-dark">What payment methods do you accept?</h2>
            <p className="text-gray-700">We currently accept GCash and Cash on Delivery (COD) in select areas. More payment options are coming soon.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-custom-dark">I clicked checkout but my cart was empty?</h2>
            <p className="text-gray-700">This usually happens when you try to access checkout directly. Make sure you’ve added items to your cart before proceeding.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-custom-dark">How do I know if my order was successful?</h2>
            <p className="text-gray-700">After placing your order, you'll be redirected to a confirmation page and receive an email (if provided) with your receipt and tracking info.</p>
          </div>
          <div>
            <h2 id="shipping" className="text-xl font-semibold text-custom-dark">How long does shipping take?</h2>
            <p className="text-gray-700">Shipping usually takes 3–5 business days depending on your location. Expect slight delays during peak seasons.</p>
          </div>
          <div>
            <h2 id="returns" className="text-xl font-semibold text-custom-dark">Do you accept returns?</h2>
            <p className="text-gray-700">Yes, you can return items within 7 days of receiving them. Items must be unused and in original packaging. Check our Return Policy for full details.</p>
          </div>
          <div>
            <h2 id="sizing-guide" className="text-xl font-semibold text-custom-dark">What sizes do you offer?</h2>
            <p className="text-gray-700">We offer a full range of sizes for men and women. A detailed sizing guide is available on each product page under “Sizing Guide”.</p>
          </div>
          <div>
            <h2 id="product-care" className="text-xl font-semibold text-custom-dark">How should I care for my products?</h2>
            <p className="text-gray-700">Care instructions can be found on the product details page. In general, we recommend hand washing or cold machine wash, air drying, and avoiding bleach.</p>
          </div>
          <div>
            <h2 id="contact-us" className="text-xl font-semibold text-custom-dark">Need help with something else?</h2>
            <p className="text-gray-700">Contact us directly through the “Contact Us” link in the footer, or visit our social media pages for updates and support.</p>
          </div>
        </div>
      </div>

      {/* Footer copied from App.jsx */}
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
            <div className="flex flex-col items-start space-y-2">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-2">
                About Us
              </h3>
              <h4 className="text-custom-dark text-[11px] uppercase tracking-widest mt-2 mb-1 font-semibold">Contact Info</h4>
              <span className="text-custom-dark text-[11px] italic">+63 1234567890</span>
            </div>
            <div className="flex flex-col items-start space-y-4 w-full">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-2 invisible">Payment Options</h3>
              <div className="flex space-x-3 mt-2">
                <FaPaypal size={22} className="text-custom-dark" />
                <span className="bg-gray-200 rounded px-2 py-1 text-custom-dark text-xs font-bold flex items-center" style={{height:'22px'}}>GCash</span>
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

export default FAQs;
