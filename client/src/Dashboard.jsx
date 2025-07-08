import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'Employee';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    document.title = "Dashboard | Hydronet";
  }, []);

  const stats = [
    { label: "Total Users", value: 42 },
    { label: "Total Projects", value: 17 },
    { label: "Pending Invoices", value: 5 },
  ];

  return (
    <div className="min-h-screen bg-custom-cream flex font-poppins">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-custom-dark text-custom-cream p-2 rounded focus:outline-none"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FiMenu size={24} />
      </button>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <Sidebar onLogout={() => { setSidebarOpen(false); handleLogout(); }} />
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 p-6 transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {username} ({role})</p>
          </div>
          <img
            src="/images/logo.jpg"
            alt="Hydronet Logo"
            className="h-12 w-12 object-contain rounded shadow"
          />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition"
            >
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Revenue Overview
          </h2>
          <div className="h-52 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 rounded-lg">
            📊 Revenue chart coming soon...
          </div>
        </div>
      </main>
    </div>
  );
}
