import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function ManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    api.get("/products", { params: { limit: 100 } })
      .then((res) => setProducts(res.data.products))
      .catch(() => setError("Could not load products"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await api.delete(`/products/${p._id}`);
      setProducts((prev) => prev.filter((x) => x._id !== p._id));
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const shown = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Manage Products ({products.length})</h2>
        <div className="flex gap-3">
          <button onClick={() => navigate("/admin/dashboard")} className="rounded-lg border bg-white px-5 py-2">
            Dashboard
          </button>
          <button onClick={() => navigate("/admin/add-product")} className="rounded-lg bg-black px-5 py-2 text-white">
            + Add Product
          </button>
        </div>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name..."
        className="mb-4 w-full max-w-sm rounded-lg border bg-white px-4 py-2"
      />

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-6 text-center text-gray-500">Loading...</td></tr>
            ) : shown.length === 0 ? (
              <tr><td colSpan="6" className="p-6 text-center text-gray-500">No products found</td></tr>
            ) : (
              shown.map((p) => {
                const stock = (p.sizes || []).reduce((sum, s) => sum + s.stock, 0);
                return (
                  <tr key={p._id} className="border-b">
                    <td className="p-4">
                      <img src={p.images?.[0]} alt="" className="h-16 w-12 rounded object-cover" />
                    </td>
                    <td className="p-4">{p.name}</td>
                    <td className="p-4 capitalize">
                      {p.category}{p.subCategory ? ` / ${p.subCategory}` : ""}
                    </td>
                    <td className="p-4">
                      ₹{p.price}
                      {p.discountPercent > 0 && (
                        <span className="ml-2 text-xs text-pink-600">{p.discountPercent}% off</span>
                      )}
                    </td>
                    <td className={`p-4 ${stock === 0 ? "text-red-600" : ""}`}>
                      {stock === 0 ? "Out of stock" : stock}
                    </td>
                    <td className="space-x-2 p-4">
                      <button
                        onClick={() => navigate(`/admin/edit-product/${p.slug}`)}
                        className="rounded border px-3 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="rounded border border-red-500 px-3 py-1 text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageProducts;