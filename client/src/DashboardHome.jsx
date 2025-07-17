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
    const username = localStorage.getItem('username') || '';
    return (
      <div className="p-6 bg-custom-cream min-h-screen">
        <h1 className="text-3xl font-bold text-custom-dark mb-2 font-poppins">Admin Dashboard</h1>
        <p className="text-custom-dark font-nunito mb-8">Welcome back, {username} ({role})</p>
        <div className="flex flex-col items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 w-full max-w-4xl">
            <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
              <p className="text-3xl font-bold text-custom-dark font-poppins">{adminStats.totalUsers}</p>
              <p className="text-custom-dark mt-2 font-kanit">Total Users</p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
              <p className="text-3xl font-bold text-custom-dark font-poppins">{adminStats.totalOrders}</p>
              <p className="text-custom-dark mt-2 font-kanit">User Orders Made</p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
              <p className="text-3xl font-bold text-custom-dark font-poppins">{adminStats.completedOrders}</p>
              <p className="text-custom-dark mt-2 font-kanit">Orders Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md mt-8">
          <h2 className="text-xl font-semibold text-custom-dark mb-3 font-kanit">Low Stock Products (Below Restock Threshold)</h2>
          {adminStats.lowStock.length === 0 ? (
            <div className="text-custom-dark">No low stock products.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-custom-dark">Product</th>
                  <th className="px-4 py-2 text-left font-semibold text-custom-dark">Variant</th>
                  <th className="px-4 py-2 text-left font-semibold text-custom-dark">Stock</th>
                  <th className="px-4 py-2 text-left font-semibold text-custom-dark">Restock Threshold</th>
                </tr>
              </thead>
              <tbody>
                {adminStats.lowStock.map(variant => (
                  <tr key={variant.variant_id} className="border-b">
                    <td className="px-4 py-2 text-custom-dark">{variant.product_name}</td>
                    <td className="px-4 py-2 text-custom-dark">{[variant.size, variant.color].filter(Boolean).join(' / ')}</td>
                    <td className="px-4 py-2 font-semibold text-red-600">{variant.stock_quantity}</td>
                    <td className="px-4 py-2 text-custom-dark">{variant.restock_threshold}</td>
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
      <div className="p-6 bg-custom-cream min-h-screen">
        <h1 className="text-3xl font-bold text-custom-dark mb-6 font-poppins">Supplier Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <p className="text-3xl font-bold text-custom-dark font-poppins">{supplierStats.activeOrders}</p>
            <p className="text-custom-dark mt-2 font-kanit">Active Supplier Orders (Pending)</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
            <p className="text-3xl font-bold text-custom-dark font-poppins">{supplierStats.completedOrders}</p>
            <p className="text-custom-dark mt-2 font-kanit">Completed Orders (Delivered)</p>
          </div>
        </div>
      </div>
    );
  }

  return <div className="p-8 text-center text-custom-dark">No dashboard data available.</div>;
};

export default DashboardHome;
