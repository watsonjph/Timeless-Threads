import React from 'react';

export default function Dashboard() {
  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'Employee';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-custom-cream font-poppins">
      <h1 className="text-3xl font-bold text-custom-dark mb-4">Welcome to the Dashboard, {username} ({role})</h1>
      <p className="text-lg text-custom-dark">Login Successful</p>
    </div>
  );
} 