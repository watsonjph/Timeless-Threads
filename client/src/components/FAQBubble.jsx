// src/components/FAQBubble.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FAQBubble = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Floating Tooltip Label */}
      <div className="absolute right-16 bottom-1/2 transform translate-y-1/2 bg-black text-white text-xs font-semibold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none shadow-lg">
        Need Help?
      </div>

      {/* FAQ Button */}
      <button
        onClick={() => navigate('/faqs')}
        className="bg-black text-white rounded-full p-4 shadow-xl hover:bg-gray-800 transition-all duration-300 ease-in-out group-hover:animate-bounce-slow"
        aria-label="Go to FAQs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M12 14a4 4 0 10-4-4m4 4v1"
          />
        </svg>
      </button>
    </div>
  );
};

export default FAQBubble;
