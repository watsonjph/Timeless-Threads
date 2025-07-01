import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'Employee';
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-custom-cream font-poppins">
      <h1 className="text-3xl font-bold text-custom-dark mb-4">Welcome to the Dashboard, {username} ({role})</h1>
      <p className="text-lg text-custom-dark mb-8">Login Successful</p>
      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-custom-dark text-custom-cream rounded hover:bg-custom-medium font-poppins font-semibold transition"
      >
        Logout
      </button>
    </div>
  );
} 