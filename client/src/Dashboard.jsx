import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'Employee';
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-custom-cream flex">
      {/* Sidebar for desktop */}
      <Sidebar onLogout={handleLogout} />
      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-custom-dark text-custom-cream p-2 rounded focus:outline-none"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FiMenu size={24} />
      </button>
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <Sidebar onLogout={() => { setSidebarOpen(false); handleLogout(); }} />
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
      <div className="flex-1 ml-0 md:ml-64">
        <Outlet />
      </div>
    </div>
  );
} 