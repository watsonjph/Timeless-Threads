import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '/images/Timeless.png';
import logoInverted from '/images/Timeless-Inverted.png';

export default function Navbar({ alwaysHovered = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [username, setUsername] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);

  // If alwaysHovered, use black text and normal logo
  const navTextClass = alwaysHovered ? 'text-black' : 'text-white group-hover:text-black';
  const logoClass = alwaysHovered ? 'h-28 w-auto' : 'h-28 w-auto group-hover:opacity-0 transition-all duration-500 ease-in-out';
  const logoNormalClass = alwaysHovered ? 'h-28 w-auto absolute top-0 left-0 opacity-100' : 'h-28 w-auto absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out';
  const headerClass = alwaysHovered ? 'bg-white font-poppins' : 'bg-transparent hover:bg-white transition-all duration-500 ease-in-out font-poppins group';

  useEffect(() => {
    const checkLoginStatus = () => {
      const storedUsername = localStorage.getItem('username');
      const storedUserId = localStorage.getItem('userId');
      
      if (storedUsername && storedUserId) {
        setIsLoggedIn(true);
        setUsername(storedUsername);
        // Fetch user's profile picture
        fetchUserProfilePic(storedUserId);
      } else {
        setIsLoggedIn(false);
        setProfilePicUrl('');
      }
    };

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(totalItems);
    };

    const fetchUserProfilePic = async (userId) => {
      try {
        const res = await fetch(`/api/auth/user/${userId}`);
        const data = await res.json();
        if (res.ok && data.has_profile_pic && data.profile_pic_url) {
          setProfilePicUrl(data.profile_pic_url);
        } else {
          setProfilePicUrl('/api/uploads/default-pfp.png');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setProfilePicUrl('/api/uploads/default-pfp.png');
      }
    };

    checkLoginStatus();
    updateCartCount();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'username' || e.key === 'userId') {
        checkLoginStatus();
      }
      if (e.key === 'cart') {
        updateCartCount();
      }
    };

    // Listen for custom login event
    const handleUserLogin = (e) => {
      checkLoginStatus();
    };

    // Listen for custom logout event
    const handleUserLogout = (e) => {
      checkLoginStatus();
    };

    const handleProfilePicUpdate = (e) => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) fetchUserProfilePic(storedUserId);
    };

    const handleCartUpdate = (e) => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleUserLogin);
    window.addEventListener('userLogout', handleUserLogout);
    window.addEventListener('profilePicUpdated', handleProfilePicUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleUserLogin);
      window.removeEventListener('userLogout', handleUserLogout);
      window.removeEventListener('profilePicUpdated', handleProfilePicUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [location.pathname]);



  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setProfilePicUrl('');
    setUsername('');
    
    // Dispatch custom event to notify other components of logout
    window.dispatchEvent(new CustomEvent('userLogout'));
    
    navigate('/');
  };



  return (
    <header className={headerClass + ' z-50 transition-opacity duration-500 ease-in-out opacity-0 animate-navbar-fade-in'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-3 items-center h-24 w-full gap-x-40`}>
          {/* Left Navigation */}
          <nav className="flex items-center gap-x-16 justify-self-end col-start-1 group">
            <Link to="/mens" className={`${navTextClass} px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out uppercase tracking-wider relative group/men`}> 
              <span>Men's</span>
              {!alwaysHovered && (
                <span className="absolute left-0 bottom-0 h-0.5 bg-current transition-all duration-500 ease-in-out w-0 group-hover:w-full"></span>
              )}
            </Link>
            <Link to="/womens" className={`${navTextClass} px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out uppercase tracking-wider relative group/women`}> 
              <span>Women's</span>
              {!alwaysHovered && (
                <span className="absolute left-0 bottom-0 h-0.5 bg-current transition-all duration-500 ease-in-out w-0 group-hover:w-full"></span>
              )}
            </Link>
            <Link to="/products" className={`${navTextClass} px-3 py-2 text-base font-medium font-kanit uppercase tracking-wider relative flex items-center space-x-1 whitespace-nowrap transition-all duration-500 ease-in-out`}>
              <span>All Products</span>
              {/*
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              */}
              {!alwaysHovered && (
                <span className="absolute left-0 bottom-0 h-0.5 bg-current transition-all duration-500 ease-in-out w-0 group-hover:w-full"></span>
              )}
              {/*
              <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md opacity-0 invisible group-hover/allproducts:opacity-100 group-hover/allproducts:visible transition-all duration-200 z-50">
                {['All', 'mens', 'womens', 'T-Shirts', 'Hoodies', 'Jackets', 'Jeans', 'Dresses', 'Skirts', 'Accessories', 'Footwear', 'Hats'].map((cat) => (
                  <Link
                    key={cat}
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize"
                  >
                    {cat === 'All' ? 'All Products' : cat}
                  </Link>
                ))}
              </div>
              */}
            </Link>
          </nav>
          {/* Center Logo */}
          <div className="flex items-center justify-center col-start-2">
            {alwaysHovered ? (
              <Link to="/" className="group cursor-pointer">
                <img src={logo} alt="Timeless Threads" className="h-28 w-auto transition-opacity duration-200 group-hover:opacity-80" />
              </Link>
            ) : (
              <Link to="/" className="group cursor-pointer relative">
                <img src={logoInverted} alt="Timeless Threads" className="h-28 w-auto group-hover:opacity-0 transition-all duration-500 ease-in-out" />
                <img src={logo} alt="Timeless Threads" className="h-28 w-auto absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
              </Link>
            )}
          </div>
          {/* Right Navigation */}
          <nav className="flex items-center gap-x-16 justify-self-start col-start-3">
            {isLoggedIn ? (
              <div className="relative profile-dropdown group/account">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <div className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors overflow-hidden bg-gray-200 flex items-center justify-center">
                    <img
                      src={profilePicUrl || '/api/uploads/default-pfp.png'}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Profile image failed to load:', e.target.src);
                        // Hide the image and show a fallback icon
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      onLoad={() => {
                        console.log('Profile image loaded successfully:', profilePicUrl);
                      }}
                    />
                    {/* Fallback icon when image fails to load */}
                    <svg 
                      className="w-6 h-6 text-gray-500 hidden" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      onError={(e) => {
                        e.target.style.display = 'flex';
                      }}
                    >
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className={`${navTextClass} text-sm font-medium`}>
                    {username}
                  </span>
                  <svg className={`w-4 h-4 ${navTextClass} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 shadow-xl opacity-0 invisible group-hover/account:opacity-100 group-hover/account:visible transition-all duration-200">
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Account
                  </Link>
                  <Link
                    to="/order-history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Order History
                  </Link>
                  <Link
                    to="/product-review"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Product Review
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className={`${navTextClass} px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out uppercase tracking-wider relative group`}>
                <span>Login</span>
                {!alwaysHovered && (
                  <span className="absolute left-0 bottom-0 h-0.5 bg-current transition-all duration-500 ease-in-out w-0 group-hover:w-full"></span>
                )}
              </Link>
            )}
            <Link to="/cart" className={`${navTextClass} px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out flex items-center space-x-2 uppercase tracking-wider relative group`}>
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </div>
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