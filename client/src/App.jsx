import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import Login from './Login'
import logo from '/images/Timeless.png'
import logoInverted from '/images/Timeless-Inverted.png'
import mainBg from '/images/main.png'
import DashboardLayout from './Dashboard'
import ClientManagement from './ClientManagement'
import Settings from './Settings'
import SupplierPortal from './SupplierPortal';


// Route Guarding, will improve later na
function isLoggedIn() {
  return !!localStorage.getItem('username');
}

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  return !isLoggedIn() ? children : <Navigate to="/dashboard" />
}

function Landing() {
  return (
    <div className="font-poppins min-h-screen flex flex-col">
      {/* Hero Section with Full Background Image */}
      <div 
        className="relative min-h-screen flex flex-col"
        style={{
          backgroundImage: `url(${mainBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Header with transparent background */}
        <header className="bg-transparent hover:bg-white transition-all duration-500 ease-in-out font-poppins group">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Left Navigation */}
              <nav className="flex items-center space-x-8">
                <Link to="/mens" className="text-white group-hover:text-black px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out">Men's</Link>
                <Link to="/womens" className="text-white group-hover:text-black px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out">Women's</Link>
                <Link to="/products" className="text-white group-hover:text-black px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out">All Products</Link>
              </nav>
              
              {/* Center Logo */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <img src={logoInverted} alt="Timeless Threads" className="h-20 w-auto group-hover:opacity-0 transition-all duration-500 ease-in-out" />
                <img src={logo} alt="Timeless Threads" className="h-20 w-auto absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
              </div>
              
              {/* Right Navigation */}
              <nav className="flex items-center space-x-6">
                <Link to="/login" className="text-white group-hover:text-black px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out">Login</Link>
                <Link to="/cart" className="text-white group-hover:text-black px-3 py-2 text-base font-medium font-kanit transition-all duration-500 ease-in-out flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  <span>Cart</span>
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="max-w-4xl w-full py-24 px-4 sm:px-6 lg:px-8 text-center">
          </div>
        </main>
      </div>

      {/* Product Carousel Section */}
      <section className="bg-custom-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-custom-dark font-poppins text-center mb-12">
            Featured Products
          </h2>
          
          {/* Product Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Clean Blank Product Cards */}
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-64 bg-custom-medium"></div>
                <div className="p-4">
                  <div className="h-4 bg-custom-medium rounded mb-2"></div>
                  <div className="h-3 bg-custom-medium rounded mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-16 bg-custom-medium rounded"></div>
                    <div className="h-8 w-24 bg-custom-dark rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-custom-dark font-poppins">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-custom-cream">
              &copy; 2025 Timeless Threads. All rights reserved.
            </p>
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

function getRole() {
  return localStorage.getItem('role') || 'Employee';
}

function RoleRoute({ allowedRoles, children }) {
  const role = getRole();
  return allowedRoles.includes(role) ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Login isSignUpDefault={true} /></PublicRoute>} />
        <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={
            <RoleRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </RoleRoute>
          } />
          <Route path="/client-management" element={
            <RoleRoute allowedRoles={["Admin", "Project Manager", "Finance Staff", "Employee"]}>
              <ClientManagement />
            </RoleRoute>
          } />
          <Route path="/supplier-portal" element={
            <RoleRoute allowedRoles={["Admin", "Project Manager", "Finance Staff", "Employee"]}>
              <SupplierPortal />
            </RoleRoute>
          } />
          <Route path="/user-management" element={
            <RoleRoute allowedRoles={["Admin"]}>
              <PageTitle title="User Management" />
            </RoleRoute>
          } />
          <Route path="/settings" element={
            <RoleRoute allowedRoles={["Admin", "Project Manager", "Finance Staff", "Employee"]}>
              <Settings />
            </RoleRoute>
          } />
        </Route>
      </Routes>
    </Router>
  )
}

export default App 