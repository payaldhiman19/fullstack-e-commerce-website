
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";

  const [text, setText] = useState(q);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Reference for the search results heading
  const resultsRef = useRef(null);

  // Keep the search box in sync when the URL changes
  useEffect(() => {
    setText(q);
  }, [q]);

  // Fetch products whenever the search query changes
  useEffect(() => {
    if (!q.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    api
      .get("/products", {
        params: { search: q, limit: 48 },
      })
      .then((res) => {
        if (!cancelled) {
          setProducts(res.data.products);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [q]);

  // Scroll to the results after products finish loading
  useEffect(() => {
    if (!loading && q.trim() && products.length > 0) {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [loading, q, products]);

  // Handle search form submission
  const submit = (e) => {
    e.preventDefault();

    setParams(text.trim() ? { q: text.trim() } : {});
  };

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-6 sm:px-8">
      {/* Search form */}
      <form onSubmit={submit} className="mb-6 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search sarees, kurtas, colors..."
          className="w-full max-w-xl border border-gray-300 px-4 py-2 outline-none"
        />

        <button
          type="submit"
          className="bg-black px-5 py-2 text-sm uppercase tracking-widest text-white"
        >
          Search
        </button>
      </form>

      {/* Search results */}
      {!q.trim() ? (
        <p className="py-16 text-center text-gray-500">
          Type something to search.
        </p>
      ) : loading ? (
        <p className="py-16 text-center text-gray-500">
          Searching...
        </p>
      ) : products.length === 0 ? (
        <p className="py-16 text-center text-gray-500">
          No products found for "{q}"
        </p>
      ) : (
        <>
          {/* Results heading */}
          <div ref={resultsRef} className="scroll-mt-36">
            <p className="mb-4 text-sm text-gray-500">
              {products.length} results for "{q}"
            </p>
          </div>

          {/* Product grid */}
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

