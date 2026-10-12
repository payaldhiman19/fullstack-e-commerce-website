import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { getAdmin, saveAdmin } from "../adminAuth";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // already logged in as admin: go straight to the dashboard
  useEffect(() => {
    if (getAdmin()) navigate("/admin/dashboard", { replace: true });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault(); // stop the page from reloading
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });

      // a customer account must not get into the admin panel
      if (data.user?.role !== "admin") {
        setError("This account is not an admin account");
        return;
      }

      saveAdmin(data.token, data.user); // saved under the admin keys only
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-2xl bg-white p-10 shadow-sm">
        <h1 className="text-center text-3xl font-bold">Admin Login</h1>
        <p className="mb-8 mt-2 text-center text-gray-500">Login to access the admin panel</p>

        <label className="mb-2 block text-sm font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin email"
          required
          className="mb-5 w-full rounded-lg border border-black px-4 py-3 outline-none"
        />

        <label className="mb-2 block text-sm font-semibold">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          required
          className="mb-6 w-full rounded-lg border border-black px-4 py-3 outline-none"
        />

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black py-3 text-white disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login as Admin"}
        </button>

        <Link to="/" className="mt-5 block text-center text-sm text-gray-500 underline">
          Back to website
        </Link>
      </form>
    </div>
  );
}

export default AdminLogin;