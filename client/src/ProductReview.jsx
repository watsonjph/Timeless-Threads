import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { ordersAPI } from './api/apiService';

export default function ProductReview() {
  const [eligibleProducts, setEligibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForms, setReviewForms] = useState({}); // { [orderId_variantId]: { rating, text, submitting, error, success } }
  const [reviewHistory, setReviewHistory] = useState([]);
  const [allOrderItems, setAllOrderItems] = useState([]); // <-- Store all order items for matching
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    async function fetchEligibleProducts() {
      setLoading(true);
      setError('');
      try {
        // Fetch completed orders with items (use axios for consistency)
        const res = await fetch(`/api/orders/user/${userId}/completed-with-items`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
        const orders = data.orders || [];
        // Flatten all products from all completed orders
        const allOrderProducts = orders.flatMap(order =>
          order.items.map(item => ({
            order_id: order.order_id,
            order_date: order.order_date,
            product_id: item.product_id,
            product_name: item.product_name,
            variant_id: item.variant_id,
            sku: item.sku,
            size: item.size,
            color: item.color,
          }))
        );
        setAllOrderItems(allOrderProducts); // <-- Store all order items for matching
        // Fetch all reviews by this user
        const reviewsRes = await fetch(`/api/auth/users/${userId}/reviews`);
        const reviewsData = await reviewsRes.json();
        const reviewed = new Set(
          (reviewsData.reviews || []).map(r => String(r.product_id))
        );
        // Filter out products already reviewed by the user (by product_id only)
        const eligible = allOrderProducts.filter(
          p => !reviewed.has(String(p.product_id))
        );
        setEligibleProducts(eligible);
        setReviewHistory(reviewsData.reviews || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch eligible products.');
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchEligibleProducts();
  }, [userId]);

  const handleStarClick = (key, rating) => {
    setReviewForms(f => ({
      ...f,
      [key]: { ...f[key], rating }
    }));
  };

  const handleTextChange = (key, text) => {
    setReviewForms(f => ({
      ...f,
      [key]: { ...f[key], text }
    }));
  };

  const handleSubmitReview = async (product) => {
    const key = `${product.order_id}_${product.variant_id}`;
    const form = reviewForms[key] || {};
    if (!form.rating || !form.text) {
      setReviewForms(f => ({
        ...f,
        [key]: { ...form, error: 'Please provide a rating and review text.' }
      }));
      return;
    }
    setReviewForms(f => ({
      ...f,
      [key]: { ...form, submitting: true, error: '', success: '' }
    }));
    try {
      const res = await fetch(`/api/products/${product.product_id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          rating: form.rating,
          review_text: form.text
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');
      setReviewForms(f => ({
        ...f,
        [key]: { rating: 0, text: '', submitting: false, error: '', success: 'Review submitted!' }
      }));
      // Refresh eligible products and review history
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setReviewForms(f => ({
        ...f,
        [key]: { ...form, submitting: false, error: err.message || 'Failed to submit review.' }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-custom-cream font-poppins">
      <Navbar alwaysHovered={true} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-custom-dark mb-8">Product Review</h1>
          <div className="mb-6 text-gray-700">
            You can only review products from orders that are <b>Completed</b> and that you have not already reviewed.
          </div>
          {loading ? (
            <div className="text-gray-500">Loading eligible products...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : eligibleProducts.length === 0 ? (
            <div className="text-gray-500">No products eligible for review at this time.</div>
          ) : (
            <ul className="space-y-6">
              {eligibleProducts.map((p, idx) => {
                const key = `${p.order_id}_${p.variant_id}`;
                const form = reviewForms[key] || {};
                return (
                  <li key={key} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                      <div>
                        <div className="font-bold text-custom-dark text-lg">{p.product_name}</div>
                        <div className="text-sm text-gray-600">Order #{p.order_id} &middot; {new Date(p.order_date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-600">Variant: {p.size || ''} {p.color || ''} (SKU: {p.sku})</div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="text-sm text-gray-500">Your Review:</div>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(star => (
                            <span
                              key={star}
                              className={`text-xl cursor-pointer ${form.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                              onClick={() => handleStarClick(key, star)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <textarea
                          className="border border-gray-300 rounded p-2 mt-1 w-64 text-sm"
                          placeholder="Write your review here..."
                          rows={2}
                          value={form.text || ''}
                          onChange={e => handleTextChange(key, e.target.value)}
                          disabled={form.submitting}
                        />
                        <button
                          className="mt-2 px-4 py-1 rounded bg-custom-dark text-custom-cream font-semibold hover:bg-custom-mint transition cursor-pointer disabled:opacity-60"
                          onClick={() => handleSubmitReview(p)}
                          disabled={form.submitting}
                        >
                          {form.submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                        {form.error && <div className="text-red-500 text-xs mt-1">{form.error}</div>}
                        {form.success && <div className="text-green-600 text-xs mt-1">{form.success}</div>}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {/* Review History Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-custom-dark mb-4">Your Review History</h2>
            {reviewHistory.length === 0 ? (
              <div className="text-gray-500">You have not submitted any reviews yet.</div>
            ) : (
              <ul className="space-y-4">
                {reviewHistory.map((r, idx) => {
                  // Find the best matching order item for this review
                  let variantInfo = '';
                  let skuInfo = '';
                  // Try to match by product_id, variant_id, and order_id if available
                  const match = allOrderItems.find(item =>
                    item.product_id === r.product_id &&
                    (r.variant_id ? item.variant_id === r.variant_id : true)
                  );
                  if (match) {
                    variantInfo = `${match.size || ''} ${match.color || ''}`.trim();
                    skuInfo = match.sku || '';
                  }
                  return (
                    <li key={r.review_id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-1">
                      <div className="font-bold text-custom-dark">{r.product_name || 'Product'}</div>
                      <div className="text-sm text-gray-600">Variant: {variantInfo} (SKU: {skuInfo})</div>
                      <div className="text-yellow-500">{'★'.repeat(r.rating)}</div>
                      <div className="text-gray-700 mt-1">{r.review_text}</div>
                      <div className="text-xs text-gray-400 mt-1">Reviewed on {new Date(r.review_date).toLocaleDateString()}</div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 