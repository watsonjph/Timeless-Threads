// client/src/Products.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { productsTop, productsBottom } from './ProductData';
import Navbar from './Navbar';
import Footer from './Footer';

const allProducts = [...productsTop, ...productsBottom];
const categories = ['All', 'mens', 'womens'];
const itemsPerPage = 8;

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = allProducts.filter(product =>
    selectedCategory === 'All' ? true : product.type === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    return 0;
  });

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  return (
    <div className="font-poppins min-h-screen flex flex-col bg-custom-cream">
      <Navbar alwaysHovered={true} />

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-1/5 bg-white p-4 border-r border-gray-200">
          <h2 className="font-bold mb-2 uppercase tracking-wide text-custom-dark">Filter by Category</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-full font-medium ${
                    selectedCategory === cat
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'All' ? 'All Products' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Heading + Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-custom-dark">All Products</h1>
            <select
              className="border border-gray-300 rounded-full px-4 py-2 text-sm"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="default">Sort By</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((prod, index) => {
              const slug = encodeURIComponent(prod.name.toLowerCase().replace(/\s+/g, '-'));
              const productPath = `/products/${prod.type}/${slug}`;

              // Construct path based on product type
              const imagePath = `/images/products/${prod.type === 'mens' ? 'Mens' : 'Womens'}/${prod.image}`;

              return (
                <div key={index} className="bg-white shadow-md p-4 hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
                  <Link to={productPath}>
                    <img
                      src={imagePath}
                      alt={prod.name}
                      className="w-full h-72 object-contain mb-3 rounded"
                    />
                    <div className="text-center text-sm font-medium text-custom-dark hover:underline">
                      {prod.name}
                    </div>
                    <div className="text-center text-md font-semibold mt-1 text-custom-dark">
                      ₱{prod.price.toLocaleString()}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-full ${
                    currentPage === i + 1
                      ? 'bg-black text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
