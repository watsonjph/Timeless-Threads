import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import Login from './Login'
import logo from '../public/images/logo.jpg'
import Dashboard from './Dashboard'

// Route Guarding, will improve later na
function isLoggedIn() {
  return !!localStorage.getItem('username')
}

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  return !isLoggedIn() ? children : <Navigate to="/dashboard" />
}

function Landing() {
  return (
    <div className="font-poppins bg-custom-cream min-h-screen flex flex-col">
      {/* Change this guys pls huhu */}
      <header className="bg-custom-dark shadow-sm font-spartan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="Hydronet Logo" className="h-10 w-10 object-contain rounded" />
              <h1 className="text-2xl font-bold text-custom-cream font-spartan tracking-tight">Hydronet Billing System</h1>
            </div>
            <nav className="space-x-4">
              <Link to="/login" className="text-custom-cream hover:text-custom-mint px-3 py-2 rounded-md text-sm font-medium font-poppins">Login</Link>
              <Link to="/signup" className="bg-custom-mint text-custom-dark px-4 py-2 rounded-md text-sm font-medium hover:bg-custom-medium hover:text-custom-cream font-poppins">Sign Up</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full py-24 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-custom-dark font-spartan mb-2">Welcome to Hydronet</h2>
          <p className="text-lg text-custom-dark font-poppins mb-8">Internal Company Portal</p>
          <div className="flex justify-center">
            <Link to="/login" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-custom-cream bg-custom-medium hover:bg-custom-dark font-poppins transition">Employee Login</Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-custom-dark font-poppins">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-custom-cream">
              &copy; 2025 Hydronet Consultants Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Login isSignUpDefault={true} /></PublicRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  )
}

export default App 