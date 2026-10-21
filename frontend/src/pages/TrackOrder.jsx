import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const STEPS = [
  ["placed", "Order placed"],
  ["packed", "Packed"],
  ["shipped", "Shipped"],
  ["out_for_delivery", "Out for delivery"],
  ["delivered", "Delivered"],
];

export default function TrackOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
//fetch specific id 
  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data)) //store the returned order in state
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);  //why id instead of []-- becoz the effect should run again when user navigates from one order to another

  if (loading) return <p className="p-10">Loading...</p>;

  if (!order) {
    return (
      <p className="p-10">
        Order not found.{" "}
        <Link to="/orders" className="underline">
          Back to my orders
        </Link>
      </p>
    );
  }

  const status = order.orderStatus || "placed";
  const current = STEPS.findIndex(([key]) => key === status);
  const cancelled = status === "cancelled";

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-8">
      <Link to="/orders" className="text-xs uppercase tracking-widest text-gray-500">
        ← My orders
      </Link>

      <h1 className="mb-1 mt-3 text-xl uppercase tracking-[0.25em] text-gray-800">Track order</h1>
      <p className="mb-6 text-xs text-gray-500">
        Order ID: {order._id} · Placed on {new Date(order.createdAt).toLocaleDateString("en-IN")}
      </p>

      {/* timeline */}
      {cancelled ? (
        <p className="mb-8 border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          This order was cancelled.
        </p>
      ) : (
        <ol className="mb-8 space-y-6 border-l-2 border-gray-200 pl-6">
          {STEPS.map(([key, text], i) => {
            const done = i <= current;
            return (
              <li key={key} className="relative">
                <span
                  className={`absolute -left-[33px] top-0.5 h-4 w-4 rounded-full border-2 ${
                    done ? "border-black bg-black" : "border-gray-300 bg-white"
                  }`}
                />
                <p className={`text-sm ${done ? "text-gray-900" : "text-gray-400"}`}>{text}</p>
              </li>
            );
          })}
        </ol>
      )}

      {order.trackingId && (
        <p className="mb-6 text-sm text-gray-700">
          Courier: {order.courier || "-"} · Tracking ID: {order.trackingId}
        </p>
      )}

      {/* items */}
      <div className="mb-6 border p-4 text-sm">
        {order.items.map((it, i) => (
          <div key={i} className="flex justify-between py-1">
            <span>
              {it.name} · Size {it.size} · Qty {it.qty}
            </span>
            <span>{fmt(it.price * it.qty)}</span>
          </div>
        ))}
        <div className="mt-3 flex justify-between border-t pt-3 font-semibold">
          <span>Total</span>
          <span>{fmt(order.amount)}</span>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Payment: {order.paymentMethod === "cod" ? "Cash on delivery" : "Paid online"}
          {order.paymentStatus ? ` (${order.paymentStatus})` : ""}
        </p>
      </div>

      {/* address */}
      <div className="text-sm text-gray-700">
        <p className="mb-1 text-xs uppercase tracking-widest text-gray-500">Delivery address</p>
        <p>
          {order.address?.name}, {order.address?.phone}
        </p>
        <p>
          {order.address?.line1}, {order.address?.city}, {order.address?.state}{" "}
          {order.address?.pincode}
        </p>
      </div>
    </div>
  );
}