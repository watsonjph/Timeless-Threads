import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import Login from './Login'
import logo from '/images/Timeless.png'
import logoInverted from '/images/Timeless-Inverted.png'
import mainBg from '/images/main.png'
import DashboardLayout from './Dashboard'

import Settings from './Settings'
import Account from './Account'
import OrderHistory from './OrderHistory'
import UserManagement from './UserManagement'
import SupplierPortal from './SupplierPortal';
import ForgotPassword from './ForgotPassword';
import VerifyEmail from './VerifyEmail';
import ResetPassword from './ResetPassword';
import { FaInstagram, FaPaypal } from 'react-icons/fa';
import Marquee from 'react-fast-marquee';
import Navbar from './Navbar';
import ProductCarousel from './ProductCarousel';
import ProductDetails from './ProductDetails';
import About from './About';
import Mens from './Mens';
import Womens from './Womens';
import Cart from './Cart';
import Checkout from './Checkout';
import FAQs from './FAQs';
import Products from './Products';
import FAQBubble from './components/FAQBubble';









// Route Guarding, will improve later na
function isLoggedIn() {
  return !!localStorage.getItem('username');
}

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('username');
  const role = localStorage.getItem('role');
  
  if (!isLoggedIn) {
    return children;
  }
  
  // Only redirect admin and supplier users to dashboard
  // Regular users can access public routes
  if (role === 'admin' || role === 'supplier') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

function Landing() {
  return (
    <div className="font-poppins min-h-screen flex flex-col">
      {/* Hero Section with Full Background Image and animated background */}
      <div className="relative min-h-screen flex flex-col" style={{ minHeight: '60vh' }}>
        <div 
          className="absolute inset-0 w-full h-full animate-landing-bg-zoom-slow z-0"
          style={{
            backgroundImage: `url(${mainBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
                <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          {/* Hero Content */}
          <main className="flex-1 flex flex-col items-center justify-center">
            <div className="max-w-4xl w-full py-24 px-4 sm:px-6 lg:px-8 text-center">
            </div>
          </main>
        </div>
      </div>

      {/* Product Carousel Section */}
      {/* <section className="bg-custom-cream py-4 w-full">
        <div className="px-0 sm:px-0 lg:px-0 w-full">
          <Marquee
            pauseOnHover={true}
            speed={40}
            gradient={false}
            style={{ width: '100%' }}
          >
            {[...Array(8)].map((_, index) => (
              <div key={index} className="flex flex-col items-center bg-white mx-4" style={{padding: '0 0 32px 0', minHeight: '420px', justifyContent: 'flex-end', width: '320px'}}>
                <div className="flex items-center justify-center w-full" style={{height: '340px'}}>
                  <img
                    src={"/images/products/landing-page/test-product.png"}
                    alt="Product"
                    className="object-contain mx-auto"
                    style={{maxHeight: '320px', width: 'auto', maxWidth: '100%'}}
                  />
                </div>
                <div className="w-full text-center mt-2">
                  <div className="text-custom-dark text-sm font-nunito uppercase tracking-widest">TEST_PRODUCT</div>
                  <div className="text-custom-dark text-xs font-nunito mt-1 flex items-center justify-center gap-1">
                    <span style={{fontWeight: 'bold', fontSize: '1rem'}}>₱</span>1,000
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </section> */}

      {/* Opposite Direction Carousel */}
      {/* <section className="bg-custom-cream pt-0 pb-4 w-full">
        <div className="px-0 sm:px-0 lg:px-0 w-full">
          <Marquee
            pauseOnHover={true}
            speed={40}
            gradient={false}
            direction="right"
            style={{ width: '100%' }}
          >
            {[...Array(8)].map((_, index) => (
              <div key={index} className="flex flex-col items-center bg-white mx-4" style={{padding: '0 0 32px 0', minHeight: '420px', justifyContent: 'flex-end', width: '320px'}}>
                <div className="flex items-center justify-center w-full" style={{height: '340px'}}>
                  <img
                    src={"/images/products/landing-page/test-product-2.png"}
                    alt="Product 2"
                    className="object-contain mx-auto"
                    style={{maxHeight: '320px', width: 'auto', maxWidth: '100%'}}
                  />
                </div>
                <div className="w-full text-center mt-2">
                  <div className="text-custom-dark text-sm font-nunito uppercase tracking-widest">TEST_PRODUCT_2</div>
                  <div className="text-custom-dark text-xs font-nunito mt-1 flex items-center justify-center gap-1">
                    <span style={{fontWeight: 'bold', fontSize: '1rem'}}>₱</span>500
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </section> */}
    <ProductCarousel />


      {/* Footer */}
      <footer className="bg-white font-kanit border-t border-custom-medium mt-8">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Left Side - Timeless Threads with Instagram */}
            <div className="flex flex-col items-start space-y-2">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-1">
                Timeless Threads
              </h3>
              <a href="#" className="text-custom-dark hover:text-custom-medium mt-1" aria-label="Instagram">
                <FaInstagram size={18} />
              </a>
            </div>

            {/* Second Column - Help Section */}
            <div className="flex flex-col items-start space-y-2">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-2">
              Help
              </h3>
              <Link to="/faqs#shipping" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">Shipping</Link>
              <Link to="/faqs#returns" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">Returns</Link>
              <Link to="/faqs" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">FAQs</Link>
              <Link to="/faqs#sizing-guide" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">Sizing Guide</Link>
              <Link to="/faqs#product-care" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">Product Care</Link>
              <Link to="/faqs#contact-us" className="text-custom-dark text-[11px] uppercase tracking-widest hover:underline">Contact Us</Link>
            </div>

            {/* Third Column - About Us and Contact Info */}
            <div className="flex flex-col items-start space-y-2">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-2">
                About Us
              </h3>
              <h4 className="text-custom-dark text-[11px] uppercase tracking-widest mt-2 mb-1 font-semibold">Contact Info</h4>
              <span className="text-custom-dark text-[11px] italic">+63 1234567890</span>
            </div>

            {/* Fourth Column - Payment Options Only */}
            <div className="flex flex-col items-start space-y-4 w-full">
              <h3 className="text-custom-dark text-xs font-semibold uppercase tracking-widest mb-2 invisible">Payment Options</h3>
              <div className="flex space-x-3 mt-2">
                <FaPaypal size={22} className="text-custom-dark" />
                <span className="bg-gray-200 rounded px-2 py-1 text-custom-dark text-xs font-bold flex items-center" style={{height:'22px'}}>GCash</span>
              </div>
            </div>
          </div>
          <div className="mt-8 text-custom-dark text-[10px] font-kanit flex flex-wrap items-center gap-2">
            <span>&copy; 2025 TIMELESS THREADS</span>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms & Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function PageTitle({ title }) {
  return <main className="flex-1 p-8 flex flex-col items-center justify-center transition-all duration-300"><h1 className="text-3xl font-bold text-custom-dark mb-4 font-poppins">{title}</h1></main>;
}

// Admin Dashboard - Only accessible by Admin role
function AdminDashboard() {
  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'Employee';
  const stats = [
    { label: "Total Users", value: "Coming Soon" },
    { label: "Total Projects", value: "Coming Soon" },
    { label: "Pending Invoices", value: "Coming Soon" },
  ];
  return (
    <main className="flex-1 p-8 flex flex-col items-center justify-center transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-custom-dark font-poppins">Admin Dashboard</h1>
          <p className="text-gray-600 font-nunito">Welcome back, {username} ({role})</p>
        </div>
        {/* Logo removed for repurposing */}
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 w-full max-w-4xl">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition"
          >
            <p className="text-3xl font-bold text-custom-dark font-poppins">{stat.value}</p>
            <p className="text-gray-600 mt-2 font-kanit">{stat.label}</p>
          </div>
        ))}
      </div>
      {/* Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-3 font-kanit">
          Revenue Overview
        </h2>
        <div className="h-52 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 rounded-lg font-nunito">
          📊 Revenue chart coming soon...
        </div>
      </div>
    </main>
  );
}

// Supplier Dashboard - Only accessible by Supplier role
function SupplierDashboard() {
  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'Employee';
  const stats = [
    { label: "Total Orders", value: "Coming Soon" },
    { label: "Products Listed", value: "Coming Soon" },
    { label: "Revenue", value: "Coming Soon" },
  ];
  return (
    <main className="flex-1 p-8 flex flex-col items-center justify-center transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-custom-dark font-poppins">Supplier Dashboard</h1>
          <p className="text-gray-600 font-nunito">Welcome back, {username} ({role})</p>
        </div>
        {/* Logo removed for repurposing */}
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 w-full max-w-4xl">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition"
          >
            <p className="text-3xl font-bold text-custom-dark font-poppins">{stat.value}</p>
            <p className="text-gray-600 mt-2 font-kanit">{stat.label}</p>
          </div>
        ))}
      </div>
      {/* Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-3 font-kanit">
          Order Overview
        </h2>
        <div className="h-52 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 rounded-lg font-nunito">
          📦 Order chart coming soon...
        </div>
      </div>
    </main>
  );
}

// Dynamic Dashboard - Shows different content based on role
function DynamicDashboard() {
  const role = localStorage.getItem('role');
  
  if (role === 'admin') {
    return <AdminDashboard />;
  } else if (role === 'supplier') {
    return <SupplierDashboard />;
  } else {
    // Fallback - redirect to landing page
    return <Navigate to="/" />;
  }
}

function getRole() {
  return localStorage.getItem('role') || 'Employee';
}

function RoleRoute({ allowedRoles, children }) {
  const role = getRole();
  return allowedRoles.includes(role) ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <div className="relative">
      <Routes>
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Login isSignUpDefault={true} /></PublicRoute>} />
        <Route path="/products/:category/:slug" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/mens" element={<Mens />} />
        <Route path="/womens" element={<Womens />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
        <Route path="/order-history" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />


        <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={
            <RoleRoute allowedRoles={["admin", "supplier"]}>
              <DynamicDashboard />
            </RoleRoute>
          } />

          <Route path="/supplier-portal" element={
            <RoleRoute allowedRoles={["admin", "supplier"]}>
              <SupplierPortal />
            </RoleRoute>
          } />
          <Route path="/settings" element={
            <RoleRoute allowedRoles={["admin", "supplier"]}>
              <Settings />
            </RoleRoute>
          } />
        </Route>

        {/* Standalone admin routes */}
        <Route path="/user-management" element={
          <PrivateRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <UserManagement />
            </RoleRoute>
          </PrivateRoute>
        } />
      </Routes>
      <FAQBubble /> {/* <-- This makes the floating button appear on ALL pages */}
      </div>
    </Router>
  )
}

export default App 