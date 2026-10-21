import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { adminLogout } from "../adminAuth";

function AdminDashboard() {
  const navigate = useNavigate();
  const [totalProducts, setTotalProducts] = useState(0);
  const [stats, setStats] = useState({ totalOrders: 0, totalSales: 0, totalUsers: 0 });

  useEffect(() => {
    api
      .get("/products", { params: { limit: 1 } })
      .then((res) => setTotalProducts(res.data.total))
      .catch(() => setTotalProducts(0));

    api
      .get("/admin/orders/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("stats error:", err.response?.status, err.response?.data));
  }, []);

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-8 py-5 shadow-sm">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button onClick={handleLogout} className="rounded-lg border px-4 py-2 text-sm">
          Logout
        </button>
      </div>

      <div className="p-8">
        <h2 className="mb-6 text-2xl font-semibold">Dashboard</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Products</p>
            <h3 className="mt-2 text-3xl font-bold">{totalProducts}</h3>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Orders</p>
            <h3 className="mt-2 text-3xl font-bold">{stats.totalOrders}</h3>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Users</p>
            <h3 className="mt-2 text-3xl font-bold">{stats.totalUsers}</h3>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Sales</p>
            <h3 className="mt-2 text-3xl font-bold">
              ₹{Number(stats.totalSales).toLocaleString("en-IN")}
            </h3>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold">Admin Actions</h3>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/admin/products")}
              className="rounded-lg bg-black px-5 py-3 text-white"
            >
              Manage Products
            </button>

            <button
              onClick={() => navigate("/admin/add-product")}
              className="rounded-lg border px-5 py-3"
            >
              + Add Product
            </button>

            <button
              onClick={() => navigate("/admin/bulk-import")}
              className="rounded-lg border px-5 py-3"
            >
              Bulk Import
            </button>

            <button
              onClick={() => navigate("/admin/orders")}
              className="rounded-lg border px-5 py-3"
            >
              Manage Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;