import React from 'react';
import Navbar from './Navbar';

export default function OrderHistory() {
  return (
    <div className="min-h-screen bg-custom-cream font-poppins">
      <Navbar alwaysHovered={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-custom-dark mb-8">Order History</h1>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders found.</p>
            <p className="text-gray-400 mt-2">Your order history will appear here once you make purchases.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 