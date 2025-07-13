import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/images/Timeless.png'

export default function Login({ isSignUpDefault = false }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSignUp, setIsSignUp] = useState(isSignUpDefault);
  const [signupStep, setSignupStep] = useState(1);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };

  const validatePassword = (pwd) => {
    return pwd.length >= 8 && /[^A-Za-z]/.test(pwd);
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters, includes a number or a special character.');
      return;
    }
    setError('');
    setSignupStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (signupStep === 1) {
        handleNext(e);
        return;
      }
      if (!username || !firstName || !lastName) {
        setError('All fields are required.');
        return;
      }
    } else {
      if (!email || !password) {
        setError('Please enter both email/username and password.');
        return;
      }
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters and include a number or special character.');
      return;
    }
    try {
      const endpoint = isSignUp
        ? 'http://localhost:3000/api/auth/register'
        : 'http://localhost:3000/api/auth/login';
      const body = isSignUp
        ? { email, username, firstName, lastName, password }
        : { email, password };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'An error occurred.');
        setSuccess('');
        return;
      }
      if (isSignUp) {
        setSuccess('Registration successful. You may now log in.');
        setError('');
        setIsSignUp(false);
        setSignupStep(1);
        setEmail('');
        setUsername('');
        setFirstName('');
        setLastName('');
        setPassword('');
      } else {
        // Store username and role in localStorage for dashboard use
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        if (data.id) localStorage.setItem('userId', data.id);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Network error.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-custom-cream px-4 font-poppins">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Timeless Threads" className="h-16 w-auto" />
        </div>
        <h2 className="text-2xl font-bold text-custom-dark mb-6 text-center font-poppins">{isSignUp ? 'Request Sign Up' : 'Employee Login'}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && signupStep === 1 && (
            <>
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
                <label className="block text-custom-dark font-medium mb-1 font-poppins">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-custom-dark rounded focus:outline-none focus:ring-2 focus:ring-custom-dark font-poppins"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <p className="text-xs text-gray-500 mt-1 font-poppins">8+ chars, numbers, special characters</p>
              </div>
              <button
                type="button"
                className="w-full py-2 px-4 bg-custom-dark text-custom-cream font-semibold rounded hover:bg-custom-mint transition font-poppins"
                onClick={handleNext}
              >
                Next
              </button>
            </>
          )}
          {isSignUp && signupStep === 2 && (
            <>
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
                <label className="block text-custom-dark font-medium mb-1 font-poppins">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-custom-dark rounded focus:outline-none focus:ring-2 focus:ring-custom-dark font-poppins"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  required
                />
              </div>
              <div>
                <label className="block text-custom-dark font-medium mb-1 font-poppins">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-custom-dark rounded focus:outline-none focus:ring-2 focus:ring-custom-dark font-poppins"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  autoComplete="family-name"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-custom-dark text-custom-cream font-semibold rounded hover:bg-custom-mint transition font-poppins"
              >
                Request Sign Up
              </button>
              <button
                type="button"
                className="w-full mt-2 py-2 px-4 bg-custom-cream text-custom-dark font-semibold rounded hover:bg-custom-mint transition font-poppins border border-custom-dark"
                onClick={() => { setSignupStep(1); setError(''); }}
              >
                Back
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
                <p className="text-xs text-gray-500 mt-1 font-poppins">8+ chars, numbers, special characters</p>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-custom-dark text-custom-cream font-semibold rounded hover:bg-custom-mint transition font-poppins"
              >
                Employee Login
              </button>
            </>
          )}
          {error && <div className="text-red-600 text-center text-sm font-poppins mb-2">{error}</div>}
          {success && <div className="text-green-600 text-center text-sm font-poppins mb-2">{success}</div>}
        </form>
        <div className="flex justify-between items-center mt-4">
          <button
            className="text-sm text-custom-medium hover:underline font-poppins focus:outline-none bg-transparent border-none"
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
          >
            {isSignUp ? 'Back to Login' : 'Request Sign Up'}
          </button>
          <Link to="/" className="text-sm text-custom-dark hover:underline font-poppins">Back to Home</Link>
        </div>
      </div>
      <p className="mt-8 text-gray-400 text-xs font-poppins">© 2025 Timeless Threads</p>
    </div>
  );
} 