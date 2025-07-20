import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CartModal = ({ isVisible, onClose, productName }) => {
  const navigate = useNavigate();
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsFading(false);
      const timer = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          onClose();
        }, 500); // Wait for fade animation to complete
      }, 7500); // Start fade after 7.5 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Modal content */}
      <div 
        className={`bg-black text-white transform transition-all duration-500 ease-out ${
          isFading ? 'animate-fade-out' : 'animate-slide-down'
        }`}
        style={{ marginTop: '96px' }}
      >
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-lg">ADDED TO CART</p>
              <p className="text-sm text-gray-300">{productName}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleViewCart}
              className="text-white underline font-semibold hover:text-gray-300 transition-colors duration-200 cursor-pointer"
            >
              VIEW
            </button>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal; 