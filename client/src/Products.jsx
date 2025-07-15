// client/src/Products.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { productsTop, productsBottom } from './ProductCarousel';
import logo from '/images/Timeless.png';
import logoInverted from '/images/Timeless-Inverted.png';

const allProducts = [...productsTop, ...productsBottom];

const Products = () => {
  return (
    <div className="font-poppins min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-transparent hover:bg-white transition-all duration-500 ease-in-out font-poppins group">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Left Navigation */}
            <nav className="flex items-center space-x-12 -ml-18">
              <Link to="/mens" className="text-white group-hover:text-black px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out uppercase tracking-wider relative hover:text-black group">
                <span>Men's</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-500 ease-in-out"></div>
              </Link>
              <Link to="/womens" className="text-white group-hover:text-black px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out uppercase tracking-wider relative hover:text-black group">
                <span>Women's</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-500 ease-in-out"></div>
              </Link>
              <Link to="/products" className="text-white group-hover:text-black px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out uppercase tracking-wider relative hover:text-black group">
                <span>All Products</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-500 ease-in-out"></div>
              </Link>
            </nav>

            {/* Center Logo */}
            <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
              <img src={logoInverted} alt="Timeless Threads" className="h-28 w-auto group-hover:opacity-0 transition-all duration-500 ease-in-out" />
              <img src={logo} alt="Timeless Threads" className="h-28 w-auto absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
            </Link>

            {/* Right Navigation */}
            <nav className="flex items-center space-x-8 mr-18">
              <Link to="/login" className="text-white group-hover:text-black px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out uppercase tracking-wider relative hover:text-black group">
                <span>Login</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-500 ease-in-out"></div>
              </Link>
              <Link to="/cart" className="text-white group-hover:text-black px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out flex items-center space-x-2 uppercase tracking-wider relative hover:text-black group">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span>CART</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-500 ease-in-out"></div>
              </Link>
            </nav>
          </div>
        </div>
      </header>

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
