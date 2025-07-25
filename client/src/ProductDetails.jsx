import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import CartModal from './components/CartModal';
import hardcodedReviews from './Reviews';
import VariantSelector from './components/VariantSelector';
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

  const [reviews, setReviews] = useState([]); // hardcoded
  const [userReviews, setUserReviews] = useState([]); // dynamic
  const [showCartModal, setShowCartModal] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [variantSelectorLoading, setVariantSelectorLoading] = useState(false);
  const [variantSelectorError, setVariantSelectorError] = useState('');
  const [variantOptions, setVariantOptions] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);


  useEffect(() => {
    if (product?.sku) {
      setReviews(hardcodedReviews[product.sku] || []);
      fetchProductStock(product.sku);
      fetchUserReviews(product.product_id);
    }
  }, [product?.sku, product?.product_id]);

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

  const openVariantSelector = async () => {
    setVariantSelectorLoading(true);
    setVariantSelectorError('');
    setShowVariantSelector(true);
    try {
      const response = await fetch(`/api/products/stock/${product.sku}`);
      if (response.ok) {
        const data = await response.json();
        setVariantOptions(data.variants || []);
      } else {
        setVariantSelectorError('Failed to fetch variants.');
        setVariantOptions([]);
      }
    } catch (err) {
      setVariantSelectorError('Error fetching variants.');
      setVariantOptions([]);
    } finally {
      setVariantSelectorLoading(false);
    }
  };

  const handleSelectVariant = (variant) => {
    // Add selected variant to cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.variant_id === variant.variant_id);
    if (existingIndex !== -1) {
      if (cart[existingIndex].quantity < variant.stock_quantity) {
        cart[existingIndex].quantity += 1;
      } else {
        alert('Maximum available quantity reached.');
        setShowVariantSelector(false);
        return;
      }
    } else {
      cart.push({
        ...product,
        quantity: 1,
        variant_id: variant.variant_id,
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setSelectedVariant(variant);
    setShowVariantSelector(false);
    setShowCartModal(true);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  async function fetchUserReviews(productId) {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setUserReviews(data.reviews || []);
      }
    } catch (err) {
      // handle error
    }
  }

  function ReviewWithProfilePic({ review }) {
    // Use profile_pic_url from review, fallback to default
    const profilePic = review.profile_pic_url || '/api/uploads/default-pfp.png';
    const displayName = (review.firstName || review.lastName) ? `${review.firstName || ''} ${review.lastName || ''}`.trim() : review.username || 'User';
    return (
      <div className="flex items-center gap-3 mb-4">
        <img
          src={profilePic}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold text-custom-dark">{displayName}</div>
          <div className="text-yellow-500">{review.rating ? '★'.repeat(review.rating) : ''}</div>
          <div>{review.review_text}</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="p-8 text-center text-red-500">Product not found</div>;
  }

  const imagePath = `/images/products/${product.type.charAt(0).toUpperCase() + product.type.slice(1)}/${product.image}`;

  // Merge hardcoded and user reviews into a single array for display
  const mergedReviews = [
    ...(reviews.map(r => ({
      ...r,
      isHardcoded: true,
    })) || []),
    ...(userReviews || [])
  ];

  // Optionally, sort by date if userReviews have review_date (not for hardcoded)
  // For now, just concatenate as above

  return (
    <div className="font-poppins min-h-screen bg-custom-cream">
      <CartModal 
        isVisible={showCartModal}
        onClose={() => setShowCartModal(false)}
        productName={product.name}
        variantInfo={selectedVariant}
      />
      <VariantSelector
        open={showVariantSelector}
        onClose={() => setShowVariantSelector(false)}
        variants={variantOptions}
        onSelect={handleSelectVariant}
        loading={variantSelectorLoading}
        error={variantSelectorError}
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
                onClick={openVariantSelector}
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
          {mergedReviews.length > 0 ? (
            <ul className="space-y-4">
              {mergedReviews.map((review, idx) => (
                review.isHardcoded ? (
                  <div key={idx} className="flex items-center gap-3 mb-4">
                    <img
                      src="/api/uploads/default-pfp.png"
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-custom-dark">{review.name}</div>
                      <div className="text-yellow-500">{'★★★★★'}</div>
                      <div>{review.comment}</div>
                    </div>
                  </div>
                ) : (
                  <ReviewWithProfilePic key={review.review_id || idx} review={review} />
                )
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
