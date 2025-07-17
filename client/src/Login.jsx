import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '/images/Timeless.png'
import { FaArrowLeft } from 'react-icons/fa';
import Navbar from './Navbar';

export default function Login({ isSignUpDefault = false }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  // Remove firstName and lastName
  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSignUp, setIsSignUp] = useState(isSignUpDefault);
  // Remove signupStep state
  // const [signupStep, setSignupStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  // Get return URL from query parameters
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get('returnTo');

  useEffect(() => { // Handle success message from verify email , bad code lol
    if (location.state && location.state.success) {
      setSuccess(location.state.success);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const validateEmail = (email) => { // Regex for email validation
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };

  const validatePassword = (pwd) => { // Updated password validation
    return pwd.length >= 8 && /\d/.test(pwd) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
  };

  // Remove handleNext, merge its logic into handleSubmit

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (!email || !username || !password || !confirmPassword) {
        setError('Please fill out all fields.');
        return;
      }
      if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      if (!validatePassword(password)) {
        setError('Password must be at least 8 characters and include a number and a special character.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    } else {
      if (!email || !password) {
        setError('Please enter both email/username and password.');
        return;
      }
    }
    try {
      const endpoint = isSignUp
  ? 'http://localhost:3000/api/auth/register'
  : 'http://localhost:3000/api/auth/login';
      const body = isSignUp
        ? { email, username, password }
        : { email, password };

        console.log('Sending login request with:', body);

      const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include'  
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'An error occurred.');
        setSuccess('');
        return;
      }
      if (isSignUp) {
        if (returnTo) {
          localStorage.setItem('returnTo', returnTo);
        }
        setSuccess('Registration successful! Please check your email to verify your account.');
        setError('');
        setIsSignUp(false);
        setEmail('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      } else {
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        if (data.id) localStorage.setItem('userId', data.id);
        if (data.supplierId) {
          localStorage.setItem('supplierId', data.supplierId);
        } else {
          localStorage.removeItem('supplierId');
        }
        // Set session expiry for 30 minutes from now
        const expiresAt = Date.now() + 30 * 60 * 1000;
        localStorage.setItem('expiresAt', expiresAt);
        window.dispatchEvent(new CustomEvent('userLogin', { 
          detail: { username: data.username, userId: data.id } 
        }));
        if (returnTo === 'checkout') {
          navigate('/checkout');
        } else if (data.role === 'admin' || data.role === 'supplier') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError('Network error.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-custom-cream font-poppins">
      <Navbar alwaysHovered={true} />
      <div className="flex flex-col justify-center items-center flex-1">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 relative">
          <h2 className="text-2xl font-bold text-custom-dark mb-6 text-center font-poppins">{isSignUp ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-custom-dark font-medium mb-1 font-poppins">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-custom-dark rounded focus:outline-none focus:ring-2 focus:ring-custom-dark font-poppins"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-custom-dark font-medium mb-1 font-poppins">Username</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-custom-dark rounded focus:outline-none focus:ring-2 focus:ring-custom-dark font-poppins"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-custom-dark font-medium mb-1 font-poppins">Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-custom-dark rounded focus:outline-none focus:ring-2 focus:ring-custom-dark font-poppins"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-custom-dark font-medium mb-1 font-poppins">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-custom-dark rounded focus:outline-none focus:ring-2 focus:ring-custom-dark font-poppins"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-custom-dark text-custom-cream font-semibold rounded hover:bg-custom-mint transition font-poppins"
              >
                Sign Up
              </button>
            </>
          )}
          {!isSignUp && (
            <>
              <div>
                <label className="block text-custom-dark font-medium mb-1 font-poppins">Email or Username</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-custom-dark rounded focus:outline-none focus:ring-2 focus:ring-custom-dark font-poppins"
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
                  className="w-full px-4 py-2 border border-custom-dark rounded focus:outline-none focus:ring-2 focus:ring-custom-dark font-poppins"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-custom-dark text-custom-cream font-semibold rounded hover:bg-custom-mint transition font-poppins"
              >
                Login
              </button>
            </>
          )}
          {error && <div className="text-red-600 text-center text-sm font-poppins mb-2">{error}</div>}
          {success && <div className="text-green-600 text-center text-sm font-poppins mb-2">{success}</div>}
        </form>
          <div className="flex justify-between items-center mt-6">
            <button
              className="text-sm text-custom-dark font-medium hover:text-custom-mint transition-colors font-poppins focus:outline-none bg-transparent border-none cursor-pointer"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            >
              {isSignUp ? 'Back to Login' : "Don't have an account? Sign up"}
            </button>
            <Link to="/forgot-password" className="text-sm text-custom-dark hover:text-custom-mint transition-colors font-poppins">Forgot Password?</Link>
          </div>
        </div>
        <p className="mt-8 text-gray-400 text-xs font-poppins">© 2025 Timeless Threads</p>
      </div>
    </div>
  );
} 