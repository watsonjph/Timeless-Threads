import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const [message, setMessage] = useState('Verifying...');
  const navigate = useNavigate();
  const email = new URLSearchParams(window.location.search).get('email');

  useEffect(() => { // Verify email, SendGrid is used for this
    async function verify() {
      if (!email) {
        setMessage('Invalid verification link.');
        return;
      }
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (res.ok) {
          // Store username and role in localStorage for dashboard use
          localStorage.setItem('username', data.username);
          localStorage.setItem('role', data.role);
          if (data.id) localStorage.setItem('userId', data.id);
          
          // Dispatch custom event to notify Navbar of login
          window.dispatchEvent(new CustomEvent('userLogin', { 
            detail: { username: data.username, userId: data.id } 
          }));
          
          // Check for returnTo parameter
          const returnTo = localStorage.getItem('returnTo');
          localStorage.removeItem('returnTo'); // Clean up
          
          // Redirect based on role and returnTo
          if (returnTo === 'checkout') {
            navigate('/checkout', { state: { success: 'Registration successful! You may now complete your purchase.' } });
          } else if (data.role && data.role.toLowerCase() === 'user') {
            navigate('/', { state: { success: 'Registration successful! You may now log in.' } });
          } else {
            navigate('/dashboard', { state: { success: 'Registration successful! You may now log in.' } });
          }
        } else {
          setMessage(data.error || 'Verification failed.');
        }
      } catch {
        setMessage('Network error.');
      }
    }
    verify();
    // eslint-disable-next-line,
  }, [email]);

  return (
    <div className="min-h-screen flex items-center justify-center font-poppins">
      <div className="bg-white p-8 rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        <p>{message}</p>
      </div>
    </div>
  );
} 