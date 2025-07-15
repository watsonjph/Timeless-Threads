import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!password) {
      setError('Please enter a new password.');
      return;
    }
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Password reset successful! You may now log in.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.error || 'Failed to reset password.');
      }
    } catch {
      setError('Network error.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-poppins">
      <div className="bg-white p-8 rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            className="w-full px-4 py-2 border border-custom-dark rounded"
            placeholder="New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-custom-dark text-custom-cream font-semibold rounded hover:bg-custom-mint transition"
          >
            Reset Password
          </button>
        </form>
        {error && <div className="text-red-600 mt-2">{error}</div>}
        {message && <div className="text-green-600 mt-2">{message}</div>}
      </div>
    </div>
  );
} 