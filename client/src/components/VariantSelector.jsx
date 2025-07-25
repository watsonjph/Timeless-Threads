import React from 'react';

export default function VariantSelector({ open, onClose, variants, onSelect, loading, error, productName }) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-md z-50 bg-white shadow-2xl transition-transform duration-500 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ boxShadow: open ? '0 0 40px rgba(0,0,0,0.2)' : 'none' }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
          <span className="text-lg font-mono tracking-wide font-semibold">SELECT SIZE</span>
          <button onClick={onClose} className="text-2xl font-bold text-gray-700 hover:text-black cursor-pointer">&times;</button>
        </div>
        <div className="px-8 pt-4 pb-2">
          <span
            className="text-xs font-mono font-bold tracking-wider underline cursor-pointer"
            onClick={() => window.open('/faqs#sizing-guide', '_blank')}
          >
            SIZE GUIDE
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading variants...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {variants && variants.length > 0 ? (
                variants.map((variant, idx) => (
                  <li
                    key={variant.variant_id || idx}
                    className={`flex items-center justify-between py-4 text-lg font-mono ${!variant.in_stock ? 'text-gray-400' : 'text-black'} ${variant.in_stock ? 'cursor-pointer hover:bg-gray-100 transition' : 'cursor-not-allowed'}`}
                    onClick={() => variant.in_stock && onSelect(variant)}
                  >
                    <span>
                      {variant.size || 'N/A'}
                      {variant.color ? ` • ${variant.color}` : ''}
                    </span>
                    <span className="text-xs font-mono">
                      {!variant.in_stock ? 'Notify me' :
                        (variant.stock_quantity === 1 ? 'Only One Left' : '')}
                    </span>
                  </li>
                ))
              ) : (
                <li className="py-8 text-center text-gray-400">No variants found.</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 