import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const STATUSES = [
  ["placed", "Placed"],
  ["packed", "Packed"],
  ["shipped", "Shipped"],
  ["out_for_delivery", "Out for delivery"],
  ["delivered", "Delivered"],
  ["cancelled", "Cancelled"],
];

// One order card. It keeps its own edits until you click Save.
function OrderRow({ order, onSaved }) {
  const [status, setStatus] = useState(order.orderStatus || "placed");
  const [courier, setCourier] = useState(order.courier || "");
  const [trackingId, setTrackingId] = useState(order.trackingId || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const { data } = await api.put(`/admin/orders/${order._id}/status`, {
        orderStatus: status,
        courier,
        trackingId,
      });
      onSaved(data);
      setMsg("Saved");
    } catch (err) {
      setMsg(err.response?.data?.error || "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const a = order.address || {};
  const inputCls = "w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black";

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      {/* top line */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
        <span>
          #{order._id.slice(-6).toUpperCase()} · {new Date(order.createdAt).toLocaleString("en-IN")}
        </span>
        <span>
          {order.paymentMethod === "cod" ? "Cash on delivery" : "Paid online"} ({order.paymentStatus})
        </span>
      </div>

      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {/* left: customer and items */}
        <div className="text-sm text-gray-800">
          <p className="font-medium">
            {a.name} · {a.phone}
          </p>
          {order.user?.email && <p className="text-gray-500">{order.user.email}</p>}
          <p className="mt-1 text-gray-600">
            {a.line1}, {a.city}, {a.state} {a.pincode}
          </p>

          <div className="mt-3 space-y-1 border-t pt-3">
            {order.items.map((it, i) => (
              <p key={i}>
                {it.name} · Size {it.size} · Qty {it.qty}
              </p>
            ))}
            <p className="pt-1 font-semibold">Total: {fmt(order.amount)}</p>
          </div>
        </div>

        {/* right: status controls */}
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Delivery status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
              {STATUSES.map(([value, text]) => (
                <option key={value} value={value}>
                  {text}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Courier</label>
              <input
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                placeholder="e.g. Delhivery"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Tracking ID</label>
              <input
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Tracking number"
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-black px-5 py-2 text-sm text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            {msg && <span className="text-sm text-gray-600">{msg}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get("/admin/orders", { params: filter === "all" ? {} : { status: filter } })
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.response?.data?.error || "Could not load orders"))
      .finally(() => setLoading(false));
  }, [filter]);

  // replace the saved order in the list so the screen stays up to date
  const handleSaved = (updated) =>
    setOrders((prev) =>
      prev.map((o) => (o._id === updated._id ? { ...o, ...updated, user: o.user } : o))
    );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Manage Orders</h1>
          <Link to="/admin/dashboard" className="text-sm underline">
            ← Back to dashboard
          </Link>
        </div>

        {/* status filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[["all", "All"], ...STATUSES].map(([value, text]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                filter === value ? "border-black bg-black text-white" : "bg-white text-gray-700"
              }`}
            >
              {text}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <OrderRow key={o._id} order={o} onSaved={handleSaved} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}