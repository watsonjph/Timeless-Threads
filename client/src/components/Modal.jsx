import React from 'react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className={`bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-8 w-full ${maxWidth} mx-4 shadow-2xl relative`}>
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
          onClick={onClose}
        >
          ×
        </button>
        {title && <h2 className="text-2xl font-bold mb-4 text-custom-dark">{title}</h2>}
        {children}
      </div>
    </div>
  );
} 