// client/src/Products.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { productsTop, productsBottom } from './ProductCarousel';
import Navbar from './Navbar';

const allProducts = [...productsTop, ...productsBottom];

const Products = () => {
  return (
    <div className="font-poppins min-h-screen flex flex-col">
      <Navbar alwaysHovered={true} />

      {/* All Products Grid */}
      <main className="flex-1 px-4 sm:px-8 lg:px-16 py-12">
        <h1 className="text-3xl font-bold text-custom-dark text-center mb-8 font-poppins uppercase tracking-widest">All Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {allProducts.map((prod, i) => {
            const slug = encodeURIComponent(prod.name.toLowerCase().replace(/\s+/g, '-'));
            const productPath = `/products/${prod.type}/${slug}`;

            return (
              <div key={i} className="bg-white shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 p-4">
                <Link to={productPath}>
                  <img src={prod.image} alt={prod.name} className="w-full h-72 object-contain mb-4 transition-transform duration-300 ease-in-out hover:scale-105" />
                </Link>
                <Link to={productPath}>
                  <div className="text-custom-dark text-sm font-nunito uppercase tracking-widest hover:underline text-center">
                    {prod.name}
                  </div>
                </Link>
                <div className="text-custom-dark text-xs font-nunito mt-1 flex items-center justify-center gap-1">
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>₱</span>{prod.price.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      {/* Paste the same footer block from Mens.jsx or Womens.jsx here */}
    </div>
  );
};

export default Products;
