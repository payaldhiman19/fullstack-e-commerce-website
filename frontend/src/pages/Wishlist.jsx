import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";

const Wishlist = () => {
  const { ids } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch once per visit; removals are handled below without refetching
  useEffect(() => {
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    api
      .get("/products", { params: { ids: ids.join(","), limit: 100 } })
      .then((res) => setProducts(res.data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // un-hearting a card removes it from this page straight away
  const shown = products.filter((p) => ids.includes(p._id));

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-6 sm:px-8">
      <h1 className="mb-1 text-xl tracking-[0.2em] text-gray-800">WISHLIST</h1>
      <p className="mb-6 text-sm text-gray-500">{ids.length} items</p>

      {loading ? (
        <p className="py-24 text-center text-gray-500">Loading...</p>
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-gray-500">
          <p className="text-lg">Your wishlist is empty</p>
          <Link
            to="/"
            className="mt-3 border border-black px-4 py-2 text-sm uppercase tracking-widest text-black"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
          {shown.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Wishlist;