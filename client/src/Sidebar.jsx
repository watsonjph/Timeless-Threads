// WILL FIX SPACING LATER, ALSO ADD ANIMATIONS!!
import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSettings, FiMenu, FiX, FiUsers, FiGrid, FiUserCheck, FiTruck, FiShoppingBag, FiClipboard, FiCheckSquare } from 'react-icons/fi';
import logo from '/images/Timeless.png'
import logoInverted from '/images/Timeless-Inverted.png'

// Navigation links configuration
const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },

  { to: '/supplier-portal', label: 'Supplier Portal', icon: FiTruck },
  { to: '/user-management', label: 'User Management', icon: FiUserCheck },
];

// Kinda wacky, but it works lol
const getRole = () => localStorage.getItem('role') || 'Employee';

const filterNavLinksByRole = (role) => {
  return navLinks.filter(link => {
    if (link.to === '/user-management') {
      return role === 'admin'; // Only admin sees User Management
    }
    if (link.to === '/supplier-portal') {
      return role === 'admin' || role === 'supplier'; // Both admin and supplier see Supplier Portal
    }
    if (link.to === '/dashboard') {
      return role === 'admin' || role === 'supplier';
    }
    // All roles can see other links
    return true;
  });
};

export default function Sidebar({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);
  const role = getRole();

  // Utility class for hiding/showing text smoothly
  const textClass = collapsed
    ? 'opacity-0 max-w-[10px] overflow-hidden'
    : 'opacity-100 overflow-visible';

  const ICON_CONTAINER_CLASSES = "h-16 flex items-center justify-center px-4";
  const ICON_SIZE = 22; // Use a consistent icon size everywhere

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
          <img src={logoInverted} alt="Timeless Threads" className={`h-8 w-auto ${textClass}`} />
        </div>
        <div className={ICON_CONTAINER_CLASSES}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-custom-cream focus:outline-none flex items-center justify-center w-full h-full cursor-pointer"
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
          <Icon size={ICON_SIZE} className="align-middle" />
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
            ? 'bg-custom-dark text-custom-cream font-bold shadow-sm'
            : 'hover:bg-custom-mint')}
        title={link.label}
      >
        <Icon size={ICON_SIZE} className="align-middle" />
        <span className={textClass}>{link.label}</span>
      </Link>
    );
  };

  // Render the Order Approval link (admin only)
  const renderOrderApproval = () => {
    if (role !== 'admin') return null;
    if (collapsed) {
      return (
        <div
          className={ICON_CONTAINER_CLASSES + ' font-poppins text-base pointer-events-auto select-none w-full cursor-pointer'}
          title="Order Approval"
          onClick={() => window.location.href = '/order-approval'}
        >
          <FiCheckSquare size={ICON_SIZE} className="align-middle" />
        </div>
      );
    }
    return (
      <Link
        to="/order-approval"
        tabIndex={0}
        className={`flex items-center h-16 px-4 gap-3 font-poppins text-base w-full hover:bg-custom-mint text-custom-cream cursor-pointer` +
          (location.pathname === '/order-approval' ? ' bg-custom-dark font-bold shadow-sm' : '')}
        title="Order Approval"
      >
        <FiCheckSquare size={ICON_SIZE} className="align-middle" />
        <span className={textClass}>Order Approval</span>
      </Link>
    );
  };

  // Render the Order Management link (admin only)
  const renderOrderManagement = () => {
    if (role !== 'admin') return null;
    if (collapsed) {
      return (
        <div
          className={ICON_CONTAINER_CLASSES + ' font-poppins text-base pointer-events-auto select-none w-full cursor-pointer'}
          title="Order Management"
          onClick={() => window.location.href = '/order-management'}
        >
          <FiClipboard size={ICON_SIZE} className="align-middle" />
        </div>
      );
    }
    return (
      <Link
        to="/order-management"
        tabIndex={0}
        className={`flex items-center h-16 px-4 gap-3 font-poppins text-base w-full hover:bg-custom-mint text-custom-cream cursor-pointer` +
          (location.pathname === '/order-management' ? ' bg-custom-dark font-bold shadow-sm' : '')}
        title="Order Management"
      >
        <FiClipboard size={ICON_SIZE} className="align-middle" />
        <span className={textClass}>Order Management</span>
      </Link>
    );
  };

  // Render the Access Shop button
  const renderAccessShop = () => {
    if (role !== 'admin' && role !== 'supplier') return null;
    if (collapsed) {
      return (
        <div
          className={ICON_CONTAINER_CLASSES + ' font-poppins text-base mb-2 pointer-events-auto select-none w-full cursor-pointer'}
          title="Access Shop"
          onClick={() => window.location.href = '/'}
        >
          <FiShoppingBag size={ICON_SIZE} className="align-middle" />
        </div>
      );
    }
    return (
      <button
        className={
          'flex items-center h-16 px-4 gap-3 font-poppins text-base mb-2 w-full hover:bg-custom-mint text-custom-cream cursor-pointer' +
          (location.pathname === '/' ? ' bg-custom-dark font-bold shadow-sm' : '')
        }
        onClick={() => window.location.href = '/'}
        tabIndex={0}
      >
        <FiShoppingBag size={ICON_SIZE} className="align-middle" />
        <span className={textClass}>Access Shop</span>
      </button>
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
            className={ICON_CONTAINER_CLASSES + " bg-custom-dark text-custom-cream font-poppins text-base font-semibold pointer-events-none select-none w-full"}
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
            ? 'bg-custom-dark text-custom-cream font-bold shadow-sm'
            : 'hover:bg-custom-mint')}
        >
          <FiSettings size={ICON_SIZE} />
          <span className={textClass}>Settings</span>
        </Link>
        <button
          onClick={onLogout}
          tabIndex={0}
          className="flex items-center h-16 px-4 gap-3 hover:bg-custom-dark text-custom-cream font-poppins text-base font-semibold w-full cursor-pointer"
        >
          <FiX size={ICON_SIZE} />
          <span className={textClass}>Logout</span>
        </button>
      </>
    );
  };

  // Render the navigation links in the correct order for admin
  const renderAdminNav = () => {
    if (role !== 'admin') return null;
    return (
      <>
        {renderNavItem({ to: '/dashboard', label: 'Dashboard', icon: FiGrid })}
        {renderOrderApproval()}
        {renderNavItem({ to: '/supplier-portal', label: 'Supplier Portal', icon: FiTruck })}
        {renderNavItem({ to: '/user-management', label: 'User Management', icon: FiUserCheck })}
        {renderOrderManagement()}
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
          {role === 'admin' ? renderAdminNav() : filterNavLinksByRole(role).map(renderNavItem)}
        </nav>
        {/* Access Shop Button */}
        {renderAccessShop()}
      </div>
      {/* Settings and Logout */}
      <div className="mb-4">
        {renderFooter()}
      </div>
    </aside>
  );
} 