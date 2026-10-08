import { useEffect, useState } from "react";
import api from "../api";
import ProductCard from "./ProductCard";

const TABS = [
  { key: "all", label: "All", query: {} },
  { key: "new", label: "New Arrivals", query: { isNew: "true" } },
  { key: "best", label: "Bestsellers", query: { bestseller: "true" } },
  { key: "rts", label: "Ready to Ship", query: { readyToShip: "true" } },
  { key: "sale", label: "On Sale", query: { sale: "true" } },
];

const PER_PAGE = 8;

function ProductList() {
  const [tab, setTab] = useState("all");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // switching tab starts again from page 1
  const changeTab = (key) => {
    if (key === tab) return;
    setTab(key);
    setPage(1);
    setProducts([]);
  };

  // runs whenever the tab or page changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const query = TABS.find((t) => t.key === tab).query;

    api
      .get("/products", { params: { ...query, page, limit: PER_PAGE } })
      .then((res) => {
        if (cancelled) return;
        // page 1 replaces the list, later pages are added to the end
        setProducts((prev) =>
          page === 1 ? res.data.products : [...prev, ...res.data.products]
        );
        setPages(res.data.pages);
      })
      .catch(() => !cancelled && setError("Could not load products"))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [tab, page]);

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8">
      <h2 className="mb-5 text-center text-xl tracking-[0.25em] text-gray-800">
        SHOP THE COLLECTION
      </h2>

      {/* tabs */}
      <div className="mb-8 flex flex-wrap justify-center gap-x-6 gap-y-2 border-b pb-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => changeTab(t.key)}
            className={`pb-1 text-sm uppercase tracking-widest transition-colors ${
              tab === t.key
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="py-16 text-center text-gray-500">{error}</p>
      ) : products.length === 0 && !loading ? (
        <p className="py-16 text-center text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
          {products.map((p, i) => (
            <div
              key={p._id}
              className="card-in"
              style={{ animationDelay: `${(i % PER_PAGE) * 80}ms` }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}

      {loading && <p className="py-10 text-center text-gray-500">Loading...</p>}

      {!loading && page < pages && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="border border-black px-8 py-3 text-sm uppercase tracking-widest hover:bg-black hover:text-white"
          >
            Load more
          </button>
        </div>
      )}
    </section>
  );
}

export default ProductList;