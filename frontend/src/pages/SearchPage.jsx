import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || ""; 
  const [text, setText] = useState(q);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // keep the box in sync when the address changes
  useEffect(() => setText(q), [q]);

  // every time the words change, ask the backend
  useEffect(() => {
    if (!q.trim()) {
      setProducts([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api
      .get("/products", { params: { search: q, limit: 48 } })
      .then((res) => !cancelled && setProducts(res.data.products))
      .catch(() => !cancelled && setProducts([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [q]);

  const submit = (e) => {
    e.preventDefault();
    setParams(text.trim() ? { q: text.trim() } : {});
  };

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-6 sm:px-8">
      <form onSubmit={submit} className="mb-6 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search sarees, kurtas, colors..."
          className="w-full max-w-xl border border-gray-300 px-4 py-2 outline-none"
        />
        <button className="bg-black px-5 py-2 text-sm uppercase tracking-widest text-white">
          Search
        </button>
      </form>

      {!q.trim() ? (
        <p className="py-16 text-center text-gray-500">Type something to search.</p>
      ) : loading ? (
        <p className="py-16 text-center text-gray-500">Searching...</p>
      ) : products.length === 0 ? (
        <p className="py-16 text-center text-gray-500">No products found for "{q}"</p>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500">
            {products.length} results for "{q}"
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default SearchPage;