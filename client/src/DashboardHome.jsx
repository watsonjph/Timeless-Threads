import { useEffect, useState } from "react";
import { dashboardAPI } from './api/apiService';

const DashboardHome = () => {
  const role = localStorage.getItem('role');
  const supplierId = localStorage.getItem('supplierId'); // If you store supplierId for supplier users
  const [adminStats, setAdminStats] = useState(null);
  const [supplierStats, setSupplierStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Dashboard | Timeless Threads";
    setLoading(true);
    setError('');
    if (role === 'admin') {
      dashboardAPI.getAdminStats()
        .then(res => setAdminStats(res.data))
        .catch(() => setError('Failed to fetch admin stats.'))
        .finally(() => setLoading(false));
    } else if (role === 'supplier') {
      dashboardAPI.getSupplierStats(supplierId)
        .then(res => setSupplierStats(res.data))
        .catch(() => setError('Failed to fetch supplier stats.'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [role, supplierId]);

  if (loading) {
    return <div className="p-8 text-center text-custom-dark">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (role === 'admin' && adminStats) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 font-poppins">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <p className="text-3xl font-bold text-blue-600 font-poppins">{adminStats.totalUsers}</p>
            <p className="text-gray-600 mt-2 font-kanit">Total Users</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <p className="text-3xl font-bold text-blue-600 font-poppins">{adminStats.totalOrders}</p>
            <p className="text-gray-600 mt-2 font-kanit">User Orders Made</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <p className="text-3xl font-bold text-blue-600 font-poppins">{adminStats.completedOrders}</p>
            <p className="text-gray-600 mt-2 font-kanit">Orders Completed</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3 font-kanit">Low Stock Products (Below 5)</h2>
          {adminStats.lowStock.length === 0 ? (
            <div className="text-gray-500">No low stock products.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Product</th>
                  <th className="px-4 py-2 text-left font-semibold">Variant</th>
                  <th className="px-4 py-2 text-left font-semibold">Stock</th>
                </tr>
              </thead>
              <tbody>
                {adminStats.lowStock.map(variant => (
                  <tr key={variant.variant_id} className="border-b">
                    <td className="px-4 py-2">{variant.product_name}</td>
                    <td className="px-4 py-2">{[variant.size, variant.color].filter(Boolean).join(' / ')}</td>
                    <td className="px-4 py-2 font-semibold text-red-600">{variant.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  if (role === 'supplier' && supplierStats) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 font-poppins">Supplier Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <p className="text-3xl font-bold text-blue-600 font-poppins">{supplierStats.activeOrders}</p>
            <p className="text-gray-600 mt-2 font-kanit">Active Supplier Orders (Pending)</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <p className="text-3xl font-bold text-blue-600 font-poppins">{supplierStats.completedOrders}</p>
            <p className="text-gray-600 mt-2 font-kanit">Completed Orders (Delivered)</p>
          </div>
        </div>
      </div>
    );
  }

  return <div className="p-8 text-center text-gray-500">No dashboard data available.</div>;
};

export default DashboardHome;
