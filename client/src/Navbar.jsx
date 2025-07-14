import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '/images/Timeless.png';
import logoInverted from '/images/Timeless-Inverted.png';

export default function Navbar({ alwaysHovered = false }) {
  const location = useLocation();
  // If alwaysHovered, use black text and normal logo
  const navTextClass = alwaysHovered ? 'text-black' : 'text-white group-hover:text-black';
  const logoClass = alwaysHovered ? 'h-28 w-auto' : 'h-28 w-auto group-hover:opacity-0 transition-all duration-500 ease-in-out';
  const logoNormalClass = alwaysHovered ? 'h-28 w-auto absolute top-0 left-0 opacity-100' : 'h-28 w-auto absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out';
  const headerClass = alwaysHovered ? 'bg-white font-poppins' : 'bg-transparent hover:bg-white transition-all duration-500 ease-in-out font-poppins group';

  return (
    <header className={headerClass + ' transition-opacity duration-500 ease-in-out opacity-0 animate-navbar-fade-in'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Left Navigation */}
          <nav className="flex items-center space-x-12 -ml-16">
            <Link to="/mens" className={`${navTextClass} px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out uppercase tracking-wider relative group`}>
              <span>Men's</span>
              {!alwaysHovered && (
                <span className="absolute left-0 bottom-0 h-0.5 bg-current transition-all duration-500 ease-in-out w-0 group-hover:w-full"></span>
              )}
            </Link>
            <Link to="/womens" className={`${navTextClass} px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out uppercase tracking-wider relative group`}>
              <span>Women's</span>
              {!alwaysHovered && (
                <span className="absolute left-0 bottom-0 h-0.5 bg-current transition-all duration-500 ease-in-out w-0 group-hover:w-full"></span>
              )}
            </Link>
            <Link to="/products" className={`${navTextClass} px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out uppercase tracking-wider relative group`}>
              <span>All Products</span>
              {!alwaysHovered && (
                <span className="absolute left-0 bottom-0 h-0.5 bg-current transition-all duration-500 ease-in-out w-0 group-hover:w-full"></span>
              )}
            </Link>
          </nav>
          {/* Center Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            {alwaysHovered ? (
              <Link to="/" className="group cursor-pointer">
                <img src={logo} alt="Timeless Threads" className="h-28 w-auto transition-opacity duration-200 group-hover:opacity-80" />
              </Link>
            ) : (
              <Link to="/" className="group cursor-pointer">
                <img src={logoInverted} alt="Timeless Threads" className="h-28 w-auto group-hover:opacity-0 transition-all duration-500 ease-in-out" />
                <img src={logo} alt="Timeless Threads" className="h-28 w-auto absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
              </Link>
            )}
          </div>
          {/* Right Navigation */}
          <nav className="flex items-center space-x-8 mr-16">
            <Link to="/login" className={`${navTextClass} px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out uppercase tracking-wider relative group`}>
              <span>Login</span>
              {!alwaysHovered && (
                <span className="absolute left-0 bottom-0 h-0.5 bg-current transition-all duration-500 ease-in-out w-0 group-hover:w-full"></span>
              )}
            </Link>
            <Link to="/cart" className={`${navTextClass} px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out flex items-center space-x-2 uppercase tracking-wider relative group`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span>CART</span>
              {!alwaysHovered && (
                <span className="absolute left-0 bottom-0 h-0.5 bg-current transition-all duration-500 ease-in-out w-0 group-hover:w-full"></span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 