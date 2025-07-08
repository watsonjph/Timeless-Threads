import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import Login from './Login'
import logo from '../public/images/logo.jpg'
import DashboardLayout from './Dashboard'
import ClientManagement from './ClientManagement'


// Route Guarding, will improve later na
function isLoggedIn() {
  return !!localStorage.getItem('username');
}

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  return !isLoggedIn() ? children : <Navigate to="/dashboard" />
}

function Landing() {
  return (
    <div className="font-poppins bg-custom-cream min-h-screen flex flex-col">
      {/* Change this guys pls huhu */}
      <header className="bg-custom-dark shadow-sm font-spartan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="Hydronet Logo" className="h-10 w-10 object-contain rounded" />
              <h1 className="text-2xl font-bold text-custom-cream font-spartan tracking-tight">Hydronet Billing System</h1>
            </div>
            <nav className="space-x-4">
              <Link to="/login" className="text-custom-cream hover:text-custom-mint px-3 py-2 rounded-md text-sm font-medium font-poppins">Login</Link>
              <Link to="/signup" className="bg-custom-mint text-custom-dark px-4 py-2 rounded-md text-sm font-medium hover:bg-custom-medium hover:text-custom-cream font-poppins">Sign Up</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full py-24 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-custom-dark font-spartan mb-2">Welcome to Hydronet</h2>
          <p className="text-lg text-custom-dark font-poppins mb-8">Internal Company Portal</p>
          <div className="flex justify-center">
            <Link to="/login" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-custom-cream bg-custom-medium hover:bg-custom-dark font-poppins transition">Employee Login</Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-custom-dark font-poppins">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-custom-cream">
              &copy; 2025 Hydronet Consultants Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function PageTitle({ title }) {
  return <main className="flex-1 p-8 flex flex-col items-center justify-center transition-all duration-300"><h1 className="text-3xl font-bold text-custom-dark mb-4">{title}</h1></main>;
}

// Temporary, for testing purposes
function DashboardWelcome() {
  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'Employee';
  const stats = [
    { label: "Total Users", value: "Coming Soon" },
    { label: "Total Projects", value: "Coming Soon" },
    { label: "Pending Invoices", value: "Coming Soon" },
  ];
  return (
    <main className="flex-1 p-8 flex flex-col items-center justify-center transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-custom-dark">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {username} ({role})</p>
        </div>
        <img
          src="/images/logo.jpg"
          alt="Hydronet Logo"
          className="h-12 w-12 object-contain rounded shadow"
        />
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 w-full max-w-4xl">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition"
          >
            <p className="text-3xl font-bold text-custom-dark">{stat.value}</p>
            <p className="text-gray-600 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
      {/* Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          Revenue Overview
        </h2>
        <div className="h-52 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 rounded-lg">
          📊 Revenue chart coming soon...
        </div>
      </div>
    </main>
  );
}

function getRole() {
  return localStorage.getItem('role') || 'Employee';
}

function RoleRoute({ allowedRoles, children }) {
  const role = getRole();
  return allowedRoles.includes(role) ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Login isSignUpDefault={true} /></PublicRoute>} />
        <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<DashboardWelcome />} />
          <Route path="/client-management" element={
            <RoleRoute allowedRoles={["Admin", "Project Manager", "Finance Staff", "Employee"]}>
              <ClientManagement />
            </RoleRoute>
          } />
          <Route path="/project-dashboard" element={
            <RoleRoute allowedRoles={["Admin", "Project Manager", "Finance Staff", "Employee"]}>
              <PageTitle title="Project Dashboard" />
            </RoleRoute>
          } />
          <Route path="/project-information" element={
            <RoleRoute allowedRoles={["Admin", "Project Manager", "Finance Staff", "Employee"]}>
              <PageTitle title="Project Information" />
            </RoleRoute>
          } />
          <Route path="/billing-center" element={
            <RoleRoute allowedRoles={["Admin", "Project Manager", "Finance Staff"]}>
              <PageTitle title="Billing Center" />
            </RoleRoute>
          } />
          <Route path="/reporting-hub" element={
            <RoleRoute allowedRoles={["Admin", "Project Manager", "Finance Staff", "Employee"]}>
              <PageTitle title="Reporting Hub" />
            </RoleRoute>
          } />
          <Route path="/user-management" element={
            <RoleRoute allowedRoles={["Admin"]}>
              <PageTitle title="User Management" />
            </RoleRoute>
          } />
          <Route path="/settings" element={
            <RoleRoute allowedRoles={["Admin", "Project Manager", "Finance Staff", "Employee"]}>
              <PageTitle title="Settings Page" />
            </RoleRoute>
          } />
        </Route>
      </Routes>
    </Router>
  )
}

export default App 