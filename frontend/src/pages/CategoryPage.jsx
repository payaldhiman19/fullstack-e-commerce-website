import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import FilterSidebar, { priceRanges } from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import api from "../api";

const emptyFilters = {
  inStock: true,
  sizes: [],
  readyToShip: false,
  minDiscount: 0,
  priceRange: "",
  colors: [],
  types: [],
  patterns: [],
  occasions: [],
};

// Which API query each nav page uses
const pageQuery = (slug) => {
  switch (slug) {
    case "new":
      return { isNew: "true" };
    case "bestsellers":
      return { bestseller: "true" };
    case "ready-to-ship":
      return { readyToShip: "true" };
    case "tyohar-sale":
      return { minDiscount: 50 };
    case "luxe":
      return { minPrice: 5000 };
    default:
      return { category: slug };
  }
};

const unique = (arr) => [...new Set(arr.filter(Boolean))];

const CategoryView = ({ category }) => {
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const [base, setBase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 //fetch from backend

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    //api --paramenter wth category based result
    api
      .get("/products", { params: { ...pageQuery(category), limit: 100 } })
      .then((res) => {
        if (!cancelled) setBase(res.data.products);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load products");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category]);

  const options = useMemo(
    () => ({
      sizes: unique(
        base.flatMap((p) => (p.sizes || []).map((s) => s.size))
      ).filter((s) => !/^free/i.test(s)),
      colors: unique(base.map((p) => p.color)),
      types: unique(base.map((p) => p.subCategory)),
      patterns: unique(base.map((p) => p.pattern)),
      occasions: unique(base.map((p) => p.occasion)),
    }),
    [base]
  );

  const products = useMemo(() => {
    const range = priceRanges.find((r) => r.label === filters.priceRange);

    let list = base.filter((p) => {
      const sizes = p.sizes || [];
      const discount = p.discountPercent || 0;

      if (filters.inStock && !sizes.some((s) => s.stock > 0)) return false;
      if (filters.readyToShip && !p.isReadyToShip) return false;
      if (discount < filters.minDiscount) return false;
      if (range && (p.price < range.min || p.price >= range.max)) return false;
      if (filters.colors.length && !filters.colors.includes(p.color)) return false;
      if (filters.types.length && !filters.types.includes(p.subCategory)) return false;
      if (filters.patterns.length && !filters.patterns.includes(p.pattern)) return false;
      if (filters.occasions.length && !filters.occasions.includes(p.occasion)) return false;
      if (
        filters.sizes.length &&
        !sizes.some((s) => filters.sizes.includes(s.size) && s.stock > 0)
      )
        return false;
      return true;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "discount")
      list = [...list].sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    return list;
  }, [base, filters, sort]);

  const title = category.replace(/-/g, " ").toUpperCase();

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-6 sm:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl tracking-[0.2em] text-gray-800">{title}</h1>
          <p className="text-sm text-gray-500">
            {loading ? "Loading..." : `${products.length} products`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-gray-300 px-3 py-2 text-sm lg:hidden"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discount">Discount</option>
          </select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside
          className={`${showFilters ? "block" : "hidden"} lg:sticky lg:top-4 lg:block lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:pr-4`}
        >
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            options={options}
          />
        </aside>

        {loading ? (
          <p className="py-24 text-center text-gray-500">Loading products...</p>
        ) : error ? (
          <p className="py-24 text-center text-gray-500">{error}</p>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <p className="text-lg">No products found</p>
            <button
              onClick={() => setFilters(emptyFilters)}
              className="mt-3 border border-black px-4 py-2 text-sm uppercase tracking-widest text-black"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// key={category} resets the filters whenever you switch nav pages
const CategoryPage = () => {
  const { category } = useParams();
  return <CategoryView key={category} category={category} />;
};

export default CategoryPage;