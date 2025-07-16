// client/src/FAQs.jsx
import React from 'react';
import Navbar from './Navbar';

const FAQs = () => {
  return (
    <div className="font-poppins min-h-screen bg-custom-cream">
      <Navbar alwaysHovered={true} />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-custom-dark">Frequently Asked Questions</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-custom-dark">How do I place an order?</h2>
          <p className="text-gray-700">Select a product, click "Add to Cart", then proceed to Checkout when you're ready.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-custom-dark">What payment methods do you accept?</h2>
          <p className="text-gray-700">We accept GCash and cash-on-delivery for select areas.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-custom-dark">How long is shipping?</h2>
          <p className="text-gray-700">Usually 3–5 business days depending on location.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-custom-dark">Do you accept returns?</h2>
          <p className="text-gray-700">Yes, within 7 days of receiving the product. See our Returns Policy for details.</p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default FAQs;
