import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Placeholder for role-based redirect
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email/username and password.');
      return;
    }
    if (password.length < 8 || !/[^A-Za-z]/.test(password)) {
      setError('Password must be at least 8 characters and include a number or special character.');
      return;
    }
    // Simulate login and role-based redirect
    // TODO: Replace with real API call and role check
    if (email === 'admin@hydronet.com') {
      navigate('/dashboard'); // Example admin redirect
    } else {
      navigate('/'); // Example user redirect
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-custom-cream px-4 font-poppins">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-custom-dark mb-6 text-center font-spartan">Login / Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-custom-dark font-medium mb-1 font-poppins">Email or Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-custom-medium rounded focus:outline-none focus:ring-2 focus:ring-custom-mint font-poppins"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="block text-custom-dark font-medium mb-1 font-poppins">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-custom-medium rounded focus:outline-none focus:ring-2 focus:ring-custom-mint font-poppins"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <p className="text-xs text-gray-500 mt-1 font-poppins">8+ chars, numbers, special characters</p>
          </div>
          {error && <div className="text-red-600 text-sm font-poppins">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-custom-dark text-custom-cream font-semibold rounded hover:bg-custom-medium transition font-poppins"
          >
            Login / Signup
          </button>
        </form>
        <div className="flex justify-between items-center mt-4">
          <Link to="#" className="text-sm text-custom-medium hover:underline font-poppins">Forgot password?</Link>
          <Link to="/" className="text-sm text-custom-dark hover:underline font-poppins">Back to Home</Link>
        </div>
      </div>
      <p className="mt-8 text-gray-400 text-xs font-poppins">System must be internal-only. Role-based redirect will be implemented.</p>
    </div>
  );
} 