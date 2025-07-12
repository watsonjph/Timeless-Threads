import React, { useState } from 'react';

export default function SupplierPortal() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'suppliers', label: 'Suppliers', icon: '🏢' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  const renderOverview = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-lg font-medium">Overview Content</p>
          <p className="text-sm">Content will be added here</p>
        </div>
      </div>
    </div>
  );

  const renderSuppliers = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-2">🏢</div>
          <p className="text-lg font-medium">Suppliers Content</p>
          <p className="text-sm">Content will be added here</p>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-lg font-medium">Orders Content</p>
          <p className="text-sm">Content will be added here</p>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-2">📈</div>
          <p className="text-lg font-medium">Analytics Content</p>
          <p className="text-sm">Content will be added here</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'suppliers':
        return renderSuppliers();
      case 'orders':
        return renderOrders();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-custom-dark">Supplier Portal</h1>
          <p className="text-gray-600">Manage your suppliers and purchase orders</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-2">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab.id
                  ? 'bg-custom-medium text-custom-cream'
                  : 'text-gray-600 hover:text-custom-dark hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderContent()}
    </div>
  );
} 