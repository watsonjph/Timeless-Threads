import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
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
                <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zm8.5 1.5A4.25 4.25 0 0120.5 7.75v8.5a4.25 4.25 0 01-4.25 4.25h-8.5A4.25 4.25 0 013.5 16.25v-8.5A4.25 4.25 0 017.75 3.5h8.5zm-6.5 2.75a4.75 4.75 0 100 9.5 4.75 4.75 0 000-9.5zm0 1.5a3.25 3.25 0 110 6.5 3.25 3.25 0 010-6.5zm6.75-.5a.75.75 0 100 1.5.75.75 0 000-1.5z" />
              </svg>
            </a>
          </div>

          {/* Help Section */}
          <div className="flex flex-col items-start space-y-2">
            <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-2">
              Help
            </h3>
            {[
              { label: 'Shipping', anchor: 'shipping' },
              { label: 'Returns', anchor: 'returns' },
              { label: 'FAQs', anchor: '' },
              { label: 'Sizing Guide', anchor: 'sizing-guide' },
              { label: 'Product Care', anchor: 'product-care' },
              { label: 'Contact Us', anchor: 'contact-us' },
            ].map(({ label, anchor }, idx) => (
              <Link
                key={idx}
                to={`/faqs${anchor ? `#${anchor}` : ''}`}
                className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* About and Contact Info */}
          <div className="flex flex-col items-start space-y-2">
            <Link
              to="/about"
              className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-2 hover:text-custom-medium cursor-pointer transition-colors"
            >
              About Us
            </Link>
            <h4 className="text-custom-dark text-[11px] uppercase tracking-widest mt-2 mb-1 font-semibold">
              Contact Info
            </h4>
            <span className="text-custom-dark text-[11px] italic">+63 1234567890</span>
          </div>

          {/* Payment Options */}
          <div className="flex flex-col items-start space-y-4 w-full">
            <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-2 invisible">Payment Options</h3>
            <div className="flex space-x-3 mt-2">
              <svg className="w-6 h-6 text-custom-dark" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.5 3A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3h-15zM6 8h12v2H6V8zm0 4h8v2H6v-2z" />
              </svg>
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
  );
};

export default Footer;
