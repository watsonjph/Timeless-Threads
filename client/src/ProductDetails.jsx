import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import CartModal from './components/CartModal';
import hardcodedReviews from './Reviews';
import {
  productsTop,
  productsBottom,
  footwearProducts,
  accessoriesProducts
} from './ProductData';

const allProducts = [
  ...productsTop,
  ...productsBottom,
  ...footwearProducts,
  ...accessoriesProducts
];


const ProductDetails = () => {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const product = allProducts.find(prod =>
    encodeURIComponent(prod.name.toLowerCase().replace(/\s+/g, '-')) === slug
  );

  const [reviews, setReviews] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product?.sku) {
      setReviews(hardcodedReviews[product.sku] || []);
      fetchProductStock(product.sku);
    }
  }, [product?.sku]);

  const fetchProductStock = async (sku) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/products/stock/${sku}`);
      if (response.ok) {
        const data = await response.json();
        setStockData(data);
      } else {
        setError('Failed to fetch stock data from server.');
        setStockData(null);
      }
    } catch (error) {
      setError('Error fetching stock: ' + error.message);
      setStockData(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    // Check if product is in stock
    if (stockData && !stockData.variants.some(v => v.in_stock)) {
      alert('This product is currently out of stock.');
      return;
    }

    const isLoggedIn = !!localStorage.getItem('username');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.sku === product.sku);

    if (existingIndex !== -1) {
      // Check stock limit
      const currentStock = stockData ? 
        stockData.variants.reduce((total, v) => total + v.stock_quantity, 0) : 
        product.stock;
      
      if (cart[existingIndex].quantity < currentStock) {
        cart[existingIndex].quantity += 1;
      } else {
        alert('Maximum available quantity reached.');
        return;
      }
    } else {
      cart.push({ 
        ...product, 
        quantity: 1,
        variant_id: stockData?.variants[0]?.variant_id // Include variant ID for backend
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setShowCartModal(true);
    
    // Dispatch custom event to notify navbar of cart update
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

    
//     if (isLoggedIn) {
//       alert(`${product.name} added to cart.`);
//     } else {
//       alert(`${product.name} added to cart. Please log in to checkout.`);
//     }

//   };

  if (!product) {
    return <div className="p-8 text-center text-red-500">Product not found</div>;
  }

  const imagePath = `/images/products/${product.type.charAt(0).toUpperCase() + product.type.slice(1)}/${product.image}`;

  return (
    <div className="font-poppins min-h-screen bg-custom-cream">
      <CartModal 
        isVisible={showCartModal}
        onClose={() => setShowCartModal(false)}
        productName={product.name}
      />
      <Navbar alwaysHovered={true} />
      <div className="p-8 max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-custom-dark text-white rounded-full hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:-translate-x-1 hover:shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        {/*
        <div className="p-8 font-poppins max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-custom-dark text-white rounded-full hover:bg-gray-800 transition-all duration-300 ease-in-out transform hover:-translate-x-1 hover:shadow-lg"
          >
  
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <img src={imagePath} alt={product.name} className="w-full object-cover rounded-lg" />
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-xl mt-2 text-custom-dark">₱{product.price.toLocaleString()}</p>
            <p className="mt-1 text-sm text-gray-500">SKU: {product.sku}</p>
            {loading ? (
              <p className="text-gray-500 font-semibold mt-1">Loading stock...</p>
            ) : error ? (
              <p className="text-red-600 font-semibold mt-1">{error}</p>
            ) : stockData ? (
              <div className="mt-1">
                {stockData.variants.some(v => v.in_stock) ? (
                  <p className="text-green-600 font-semibold">
                    In Stock - {stockData.variants.reduce((total, v) => total + v.stock_quantity, 0)} units available
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">Out of Stock</p>
                )}
              </div>
            ) : (
              <p className="text-green-600 font-semibold mt-1">
                Only {product.stock} unit{product.stock > 1 ? 's' : ''} left
              </p>
            )}

            <div className="mt-6 space-x-3">
              <button
                onClick={addToCart}
                disabled={loading || (stockData && !stockData.variants.some(v => v.in_stock))}
                className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
                  loading || (stockData && !stockData.variants.some(v => v.in_stock))
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800 hover:shadow-md'
                }`}
              >
                {loading ? 'Loading...' : 
                 (stockData && !stockData.variants.some(v => v.in_stock)) ? 'Out of Stock' : 
                 'Add to Cart'}
              </button>
            </div>

            <div className="mt-6">
              <h2 className="font-bold mb-2">EDITOR'S NOTE</h2>
              <p>{product.description}</p>

              <h2 className="font-bold mt-4 mb-2">THE DETAILS</h2>
              <ul className="list-disc pl-5">
                {product.details?.map((item, i) => <li key={i}>{item}</li>)}
                {/* {product.details.map((item, i) => <li key={i}>{item}</li>)} */}
              </ul>

              <h2 className="font-bold mt-4 mb-2">CARE INSTRUCTIONS</h2>
              <ul className="list-disc pl-5">
                {product.care?.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-bold text-xl mb-2">Reviews:</h2>
          {reviews.length > 0 ? (
            <ul className="space-y-4">
              {reviews.map((review, i) => (
                <li key={i} className="border border-gray-200 p-4 rounded-lg shadow-sm">
                  <p className="font-semibold text-custom-dark">{review.name}</p>
                  <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-gray-600">No reviews yet.</p>
          )}
        </div>
        {/*
        {product.care.map((item, i) => <li key={i}>{item}</li>)}
        ...
        */}
      </div>
    </div>
  );
};

export default ProductDetails;
