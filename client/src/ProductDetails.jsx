import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import hardcodedReviews from './Reviews';
import { productsTop, productsBottom } from './ProductData';

const allProducts = [...productsTop, ...productsBottom];

const ProductDetails = () => {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const product = allProducts.find(prod =>
    encodeURIComponent(prod.name.toLowerCase().replace(/\s+/g, '-')) === slug
  );

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (product?.sku) {
      setReviews(hardcodedReviews[product.sku] || []);
    }
  }, [product?.sku]);

  const addToCart = () => {
    const isLoggedIn = !!localStorage.getItem('username');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.sku === product.sku);

    if (existingIndex !== -1) {
      if (cart[existingIndex].quantity < product.stock) {
        cart[existingIndex].quantity += 1;
      }
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart.` + (!isLoggedIn ? ' Please log in to checkout.' : ''));
  };

  if (!product) {
    return <div className="p-8 text-center text-red-500">Product not found</div>;
  }

  const imagePath = `/images/products/${product.type.charAt(0).toUpperCase() + product.type.slice(1)}/${product.image}`;

  return (
    <div className="font-poppins min-h-screen bg-custom-cream">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <img src={imagePath} alt={product.name} className="w-full object-cover rounded-lg" />
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-xl mt-2 text-custom-dark">₱{product.price.toLocaleString()}</p>
            <p className="mt-1 text-sm text-gray-500">SKU: {product.sku}</p>
            <p className="text-green-600 font-semibold mt-1">
              Only {product.stock} unit{product.stock > 1 ? 's' : ''} left
            </p>

            <div className="mt-6 space-x-3">
              <button
                onClick={addToCart}
                className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Add to Cart
              </button>
            </div>

            <div className="mt-6">
              <h2 className="font-bold mb-2">EDITOR'S NOTE</h2>
              <p>{product.description}</p>

              <h2 className="font-bold mt-4 mb-2">THE DETAILS</h2>
              <ul className="list-disc pl-5">
                {product.details.map((item, i) => <li key={i}>{item}</li>)}
              </ul>

              <h2 className="font-bold mt-4 mb-2">CARE INSTRUCTIONS</h2>
              <ul className="list-disc pl-5">
                {product.care.map((item, i) => <li key={i}>{item}</li>)}
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
      </div>
    </div>
  );
};

export default ProductDetails;
