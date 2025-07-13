import { useEffect } from "react";

const DashboardHome = () => {
  useEffect(() => {
    document.title = "Dashboard | Timeless Threads";
  }, []);

  const stats = [
    { label: "Total Users", value: 42 },
    { label: "Total Projects", value: 17 },
    { label: "Pending Invoices", value: 5 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 font-poppins">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition"
          >
            <p className="text-3xl font-bold text-blue-600 font-poppins">{stat.value}</p>
            <p className="text-gray-600 mt-2 font-kanit">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-3 font-kanit">
          Revenue Overview
        </h2>
        <div className="h-52 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 rounded-lg font-nunito">
          📊 Chart Coming Soon
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
