import { useEffect, useState } from "react";
import api from "../api";

function AdminDashboard() {
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

  const cards = [
    ["Total Products", totalProducts],
    ["Total Orders", stats.totalOrders],
    ["Total Users", stats.totalUsers],
    ["Total Sales", `₹${Number(stats.totalSales).toLocaleString("en-IN")}`],
  ];

  return (
    <div className="p-4 sm:p-8">
      <h2 className="mb-6 text-2xl font-semibold">Dashboard</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <h3 className="mt-2 text-3xl font-bold">{value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;