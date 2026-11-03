
import { useEffect, useState } from "react";
import api from "../api";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/contact")
      .then((res) => setMessages(res.data))
      .catch((err) => {
        setError(
          err.response?.data?.message || "Failed to load messages"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/contact/${id}/read`);

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === id ? { ...msg, status: "read" } : msg
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update message"
      );
    }
  };

  if (loading) {
    return <p>Loading messages...</p>;
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">
        Customer Messages
      </h2>

      {error && (
        <p className="mb-4 text-sm text-red-600">{error}</p>
      )}

      {messages.length === 0 ? (
        <p className="text-gray-500">No messages received yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="rounded-lg border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{msg.name}</h3>

                <span
                  className={`text-sm ${
                    msg.status === "unread"
                      ? "font-medium text-orange-600"
                      : "text-gray-500"
                  }`}
                >
                  {msg.status}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                {msg.email}
              </p>

              <p className="mt-4 whitespace-pre-wrap text-gray-700">
                {msg.message}
              </p>

              <p className="mt-3 text-xs text-gray-400">
                {new Date(msg.createdAt).toLocaleString()}
              </p>

              {msg.status === "unread" && (
                <button
                  onClick={() => markAsRead(msg._id)}
                  className="mt-4 text-sm font-medium underline"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminMessages;
