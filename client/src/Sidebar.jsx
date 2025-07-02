// WILL FIX SPACING LATER, ALSO ADD ANIMATIONS!!
import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSettings, FiMenu, FiX, FiUsers, FiGrid, FiInfo, FiDollarSign, FiBarChart2, FiUserCheck } from 'react-icons/fi';
import logo from '../public/images/logo.jpg';

// Navigation links configuration
const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/client-management', label: 'Client Management', icon: FiUsers },
  { to: '/project-dashboard', label: 'Project Dashboard', icon: FiGrid },
  { to: '/project-information', label: 'Project Information', icon: FiInfo },
  { to: '/billing-center', label: 'Billing Center', icon: FiDollarSign },
  { to: '/reporting-hub', label: 'Reporting Hub', icon: FiBarChart2 },
  { to: '/user-management', label: 'User Management', icon: FiUserCheck },
];

export default function Sidebar({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);

  // Utility class for hiding/showing text smoothly
  const textClass = collapsed
    ? 'opacity-0 max-w-[10px] overflow-hidden'
    : 'opacity-100 overflow-visible';

  const ICON_CONTAINER_CLASSES = "h-16 flex items-center justify-center px-4";
  const ICON_SIZE = 24;

  // Handler for sidebar click when collapsed (expands sidebar unless hamburger is clicked)
  const handleSidebarClick = (e) => {
    if (e.target.closest('button[data-hamburger]')) return;
    setCollapsed(false);
  };

  // Render the sidebar header (logo/title or hamburger/close button)
  const renderHeader = () => {
    if (collapsed) {
      return (
        <div className={ICON_CONTAINER_CLASSES + " w-full"}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-custom-cream focus:outline-none flex items-center justify-center pointer-events-auto w-full h-full"
            aria-label="Expand sidebar"
            data-hamburger
          >
            <FiMenu size={ICON_SIZE} />
          </button>
        </div>
      );
    }
    return (
      <>
        <div className="flex items-center flex-1 min-w-0 space-x-2 px-4 h-16">
          <img src={logo} alt="Hydronet Logo" className="h-8 w-8 object-contain rounded" />
          <span className={`text-lg font-bold font-spartan tracking-tight whitespace-nowrap ${textClass}`}>Hydronet Billing</span>
        </div>
        <div className={ICON_CONTAINER_CLASSES}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-custom-cream focus:outline-none flex items-center justify-center w-full h-full"
            aria-label="Collapse sidebar"
          >
            <FiX size={ICON_SIZE} />
          </button>
        </div>
      </>
    );
  };

  // Render a nav item (either as a Link or a non-interactive div)
  const renderNavItem = (link) => {
    const Icon = link.icon;
    if (collapsed) {
      return (
        <div
          key={link.to}
          className={ICON_CONTAINER_CLASSES + " font-poppins text-base pointer-events-none select-none w-full"}
          title={link.label}
        >
          <Icon size={ICON_SIZE} />
        </div>
      );
    }
    return (
      <Link
        key={link.to}
        to={link.to}
        tabIndex={0}
        className={`flex items-center h-16 px-4 gap-3 font-poppins text-base w-full ` +
          (location.pathname === link.to
            ? 'bg-custom-medium text-custom-cream font-bold shadow-sm'
            : 'hover:bg-custom-mint')}
        title={link.label}
      >
        <Icon size={ICON_SIZE} />
        <span className={textClass}>{link.label}</span>
      </Link>
    );
  };

  // Render the settings and logout section
  const renderFooter = () => {
    if (collapsed) {
      return (
        <>
          <div
            className={ICON_CONTAINER_CLASSES + " font-poppins text-base mb-2 pointer-events-none select-none w-full"}
            title="Settings Page"
          >
            <FiSettings size={ICON_SIZE} />
          </div>
          <div
            className={ICON_CONTAINER_CLASSES + " bg-custom-medium text-custom-cream font-poppins text-base font-semibold pointer-events-none select-none w-full"}
            title="Logout"
          >
            <FiX size={ICON_SIZE} />
          </div>
        </>
      );
    }
    return (
      <>
        <Link
          to="/settings"
          tabIndex={0}
          className={`flex items-center h-16 px-4 gap-3 font-poppins text-base mb-2 w-full ` +
            (location.pathname === '/settings'
              ? 'bg-custom-medium text-custom-cream font-bold shadow-sm'
              : 'hover:bg-custom-mint')}
        >
          <FiSettings size={ICON_SIZE} />
          <span className={textClass}>Settings Page</span>
        </Link>
        <button
          onClick={onLogout}
          tabIndex={0}
          className="flex items-center h-16 px-4 gap-3 bg-custom-medium hover:bg-custom-dark text-custom-cream font-poppins text-base font-semibold w-full"
        >
          <FiX size={ICON_SIZE} />
          <span className={textClass}>Logout</span>
        </button>
      </>
    );
  };

  return (
    <aside
      ref={sidebarRef}
      className={`h-screen bg-custom-dark text-custom-cream flex flex-col justify-between fixed z-20
        ${collapsed ? 'w-20' : 'w-64'}
        hidden md:flex
        shadow-lg
        ${collapsed ? 'cursor-pointer' : ''}
      `}
      style={{ minWidth: collapsed ? '5rem' : '16rem' }}
      onClick={collapsed ? handleSidebarClick : undefined}
    >
      {/* Sidebar Header */}
      <div>
        <div className="flex">
          {renderHeader()}
        </div>
        {/* Navigation Links */}
        <nav className="mt-6 flex-1">
          {navLinks.map(renderNavItem)}
        </nav>
      </div>
      {/* Settings and Logout */}
      <div className="mb-4">
        {renderFooter()}
      </div>
    </aside>
  );
} 