import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    api.get("/products", { params: { limit: 1 } })
      .then((res) => setTotalProducts(res.data.total))
      .catch(() => setTotalProducts(0));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
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
            <h3 className="mt-2 text-3xl font-bold">0</h3>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Users</p>
            <h3 className="mt-2 text-3xl font-bold">0</h3>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Sales</p>
            <h3 className="mt-2 text-3xl font-bold">₹0</h3>
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

            <button disabled className="rounded-lg border px-5 py-3 text-gray-400">
              Manage Orders (soon)
            </button>

            <button disabled className="rounded-lg border px-5 py-3 text-gray-400">
              Manage Users (soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;