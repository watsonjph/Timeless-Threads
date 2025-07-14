import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import logo from '/images/Timeless.png';
import Navbar from './Navbar';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      setMessage('');
      return;
    }
    // Simulate sending reset email, TEMPORARY will host a backend later
    setMessage('If an account with that email exists, a reset link has been sent.');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-custom-cream font-poppins">
      <Navbar alwaysHovered={true} />
      <div className="flex flex-col justify-center items-center flex-1">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 relative">
          <button
            className="absolute top-4 left-4 text-custom-dark hover:text-custom-mint focus:outline-none cursor-pointer"
            onClick={() => navigate('/login')}
            aria-label="Back to Login"
          >
            <FaArrowLeft size={22} />
          </button>
          {/* Remove the logo above the forgot password header */}
          {/* <div className="flex justify-center mb-6">
            <img src={logo} alt="Timeless Threads" className="h-24 w-auto" />
          </div> */}
          <h2 className="text-2xl font-bold text-custom-dark mb-6 text-center font-poppins">Forgot Password</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-custom-dark font-medium mb-1 font-poppins">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-custom-dark rounded focus:outline-none focus:ring-2 focus:ring-custom-dark font-poppins"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-custom-dark text-custom-cream font-semibold rounded hover:bg-custom-mint transition font-poppins"
            >
              Send Reset Link
            </button>
            {error && <div className="text-red-600 text-center text-sm font-poppins mb-2">{error}</div>}
            {message && <div className="text-green-600 text-center text-sm font-poppins mb-2">{message}</div>}
          </form>
        </div>
        <p className="mt-8 text-gray-400 text-xs font-poppins">© 2025 Timeless Threads</p>
      </div>
    </div>
  );
} 