
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";

const SearchPage = () => {
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const resultsRef = useRef(null);

  // Fetch products whenever the search keyword changes
  useEffect(() => {
    const keyword = q.trim();

    if (!keyword) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    api
      .get("/products", {
        params: {
          search: keyword,
          limit: 48,
        },
      })
      .then((res) => {
        if (!cancelled) {
          setProducts(res.data.products || []);
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

  // Scroll to results after loading
  useEffect(() => {
    if (!loading && q.trim() && products.length > 0) {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [loading, q, products]);

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-6 sm:px-8">
      {/* Search results */}
      {!q.trim() ? (
        <p className="py-16 text-center text-gray-500">
          Enter a keyword in the navbar search box.
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
          <div ref={resultsRef} className="scroll-mt-36">
            <p className="mb-4 text-sm text-gray-500">
              {products.length} results for "{q}"
            </p>
          </div>

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