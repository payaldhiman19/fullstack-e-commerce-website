import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`; //formats an amount

const label = (s) => (s || "placed").replace(/_/g, " ");

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders/my")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        if (err.response?.status === 401) setError("Please log in to see your orders.");
        else setError("Could not load your orders. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-xl uppercase tracking-[0.25em] text-gray-800">My Orders</h1>

      {error ? (
        <p className="text-gray-600">{error}</p>
      ) : orders.length === 0 ? (
        <div className="text-gray-500">
          <p>You have no orders yet.</p>
          <Link to="/" className="mt-3 inline-block underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="border p-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Placed on {new Date(o.createdAt).toLocaleDateString("en-IN")}</span>
                <span className="bg-gray-100 px-2 py-0.5 text-xs uppercase tracking-wider text-gray-700">
                  {label(o.orderStatus)}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-sm text-gray-800">
                {o.items.map((it, i) => (
                  <p key={i}>
                    {it.name} · Size {it.size} · Qty {it.qty}
                  </p>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-semibold">{fmt(o.amount)}</span>
                <Link
                  to={`/orders/${o._id}`}
                  className="border border-black px-4 py-2 text-xs uppercase tracking-widest"
                >
                  Track order
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}