import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
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

  // TODO: Remove the hardcoded stats and get the data from the backend
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
        <Outlet />
      </main>
    </div>
  );
}
