import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';


const womensProducts = [
  { name: 'Breathable Jersey Tennis Socks', price: 750, image: '/images/products/landing-page/jsocks1.png', type: 'womens' },
  { name: 'Striped Ribbed Sock', price: 450, image: '/images/products/landing-page/ribsock1.png', type: 'womens' },
  { name: 'Corgi Dog Socks Khaki', price: 450, image: '/images/products/landing-page/dogsock1.png', type: 'womens' },
  { name: 'Pug Dog Sock Green', price: 450, image: '/images/products/landing-page/dogsock2.png', type: 'womens' },
  { name: '2-Pack Sport Socks', price: 750, image: '/images/products/landing-page/sportsocks1.png', type: 'womens' },
  // add more womens products here
];

const Womens = () => {
  return (
    <div className="font-poppins min-h-screen flex flex-col">
      <Navbar alwaysHovered={true} />

      {/* Content */}
      <main className="flex-1 bg-custom-cream p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {womensProducts.map((prod, i) => {
          const slug = encodeURIComponent(prod.name.toLowerCase().replace(/\s+/g, '-'));
          const productPath = `/products/${prod.type}/${slug}`;

          return (
            <Link key={i} to={productPath} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center p-4">
              <img
                src={prod.image}
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
  );
};

export default Womens;
