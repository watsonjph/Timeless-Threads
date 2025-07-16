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

    const fetchUserProfilePic = async (userId) => {
      try {
        const res = await fetch(`/api/auth/user/${userId}`);
        const data = await res.json();
        if (res.ok && data.has_profile_pic && data.profile_pic_url) {
          setProfilePicUrl(data.profile_pic_url);
        } else {
          // Use default profile picture
          setProfilePicUrl('/api/uploads/default-pfp.png');
        }
      } catch (err) {
        // Fallback to default profile picture
        setProfilePicUrl('/api/uploads/default-pfp.png');
      }
    };

    checkLoginStatus();
  }, []);



  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setProfilePicUrl('');
    setUsername('');
    navigate('/');
  };



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
            {isLoggedIn ? (
              <div className="relative profile-dropdown group">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <img
                    src={profilePicUrl || '/api/uploads/default-pfp.png'}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 hover:border-gray-400 transition-colors"
                    onError={(e) => {
                      e.target.src = '/api/uploads/default-pfp.png';
                    }}
                  />
                  <span className={`${navTextClass} text-sm font-medium`}>
                    {username}
                  </span>
                  <svg className={`w-4 h-4 ${navTextClass} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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