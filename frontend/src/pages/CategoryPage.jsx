// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import { SlidersHorizontal } from "lucide-react";
// import FilterSidebar, { priceRanges } from "../components/FilterSidebar";
// import ProductCard from "../components/ProductCard";
// import api from "../api";

// const emptyFilters = {
//   inStock: true,
//   sizes: [],
//   readyToShip: false,
//   minDiscount: 0,
//   priceRange: "",
//   colors: [],
//   types: [],
//   patterns: [],
//   occasions: [],
// };

// // Which API query each nav page uses
// const pageQuery = (slug) => {
//   switch (slug) {
//     case "new":
//       return { isNew: "true" };
//     case "bestsellers":
//       return { bestseller: "true" };
//     case "ready-to-ship":
//       return { readyToShip: "true" };
//     case "tyohar-sale":
//       return { minDiscount: 50 };
//     case "luxe":
//       return { minPrice: 5000 };
//     default:
//       return { category: slug };
//   }
// };

// const unique = (arr) => [...new Set(arr.filter(Boolean))];

// const CategoryView = ({ category }) => {
//   const [filters, setFilters] = useState(emptyFilters);
//   const [sort, setSort] = useState("featured");
//   const [showFilters, setShowFilters] = useState(false);

//   const [base, setBase] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//  //fetch from backend

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);
//     setError("");
//     //api --paramenter wth category based result
//     api
//       .get("/products", { params: { ...pageQuery(category), limit: 100 } })
//       .then((res) => {
//         if (!cancelled) setBase(res.data.products);
//       })
//       .catch(() => {
//         if (!cancelled) setError("Could not load products");
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });
//     return () => {
//       cancelled = true;
//     };
//   }, [category]);

//   const options = useMemo(
//     () => ({
//       sizes: unique(
//         base.flatMap((p) => (p.sizes || []).map((s) => s.size))
//       ).filter((s) => !/^free/i.test(s)),
//       colors: unique(base.map((p) => p.color)),
//       types: unique(base.map((p) => p.subCategory)),
//       patterns: unique(base.map((p) => p.pattern)),
//       occasions: unique(base.map((p) => p.occasion)),
//     }),
//     [base]
//   );

//   const products = useMemo(() => {
//     const range = priceRanges.find((r) => r.label === filters.priceRange);

//     let list = base.filter((p) => {
//       const sizes = p.sizes || [];
//       const discount = p.discountPercent || 0;

//       if (filters.inStock && !sizes.some((s) => s.stock > 0)) return false;
//       if (filters.readyToShip && !p.isReadyToShip) return false;
//       if (discount < filters.minDiscount) return false;
//       if (range && (p.price < range.min || p.price >= range.max)) return false;
//       if (filters.colors.length && !filters.colors.includes(p.color)) return false;
//       if (filters.types.length && !filters.types.includes(p.subCategory)) return false;
//       if (filters.patterns.length && !filters.patterns.includes(p.pattern)) return false;
//       if (filters.occasions.length && !filters.occasions.includes(p.occasion)) return false;
//       if (
//         filters.sizes.length &&
//         !sizes.some((s) => filters.sizes.includes(s.size) && s.stock > 0)
//       )
//         return false;
//       return true;
//     });

//     if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
//     if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
//     if (sort === "discount")
//       list = [...list].sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
//     return list;
//   }, [base, filters, sort]);

//   const title = category.replace(/-/g, " ").toUpperCase();

//   return (
//     <section className="mx-auto max-w-[1600px] px-4 py-6 sm:px-8">
//       <div className="mb-6 flex items-center justify-between">
//         <div>
//           <h1 className="text-xl tracking-[0.2em] text-gray-800">{title}</h1>
//           <p className="text-sm text-gray-500">
//             {loading ? "Loading..." : `${products.length} products`}
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center gap-2 border border-gray-300 px-3 py-2 text-sm lg:hidden"
//           >
//             <SlidersHorizontal size={16} /> Filters
//           </button>

//           <select
//             value={sort}
//             onChange={(e) => setSort(e.target.value)}
//             className="border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 outline-none"
//           >
//             <option value="featured">Featured</option>
//             <option value="price-asc">Price: Low to High</option>
//             <option value="price-desc">Price: High to Low</option>
//             <option value="discount">Discount</option>
//           </select>
//         </div>
//       </div>

//       <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
//         <aside
//           className={`${showFilters ? "block" : "hidden"} lg:sticky lg:top-4 lg:block lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:pr-4`}
//         >
//           <FilterSidebar
//             filters={filters}
//             setFilters={setFilters}
//             options={options}
//           />
//         </aside>

//         {loading ? (
//           <p className="py-24 text-center text-gray-500">Loading products...</p>
//         ) : error ? (
//           <p className="py-24 text-center text-gray-500">{error}</p>
//         ) : products.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-24 text-gray-500">
//             <p className="text-lg">No products found</p>
//             <button
//               onClick={() => setFilters(emptyFilters)}
//               className="mt-3 border border-black px-4 py-2 text-sm uppercase tracking-widest text-black"
//             >
//               Clear filters
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
//             {products.map((p) => (
//               <ProductCard key={p._id} product={p} />
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// // key={category} resets the filters whenever you switch nav pages
// const CategoryPage = () => {
//   const { category } = useParams();
//   return <CategoryView key={category} category={category} />;
// };

// export default CategoryPage;






import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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

// Heading and short description for each page (edit the wording freely)
const pageInfo = {
  new: {
    title: "NEW ARRIVALS",
    text: "Be the first to own the season's most coveted styles. Explore fresh silhouettes, rich fabrics and festive colours added every week.",
  },
  bestsellers: {
    title: "BESTSELLERS",
    text: "The pieces our customers keep coming back for, from everyday kurtas to wedding favourites.",
  },
  "tyohar-sale": {
    title: "TYOHAR SALE",
    text: "Festive favourites at half the price or less. Grab your size before it sells out.",
  },
  "ready-to-ship": {
    title: "READY TO SHIP",
    text: "In stock and on its way to you quickly, so you can look festive without the wait.",
  },
  luxe: {
    title: "LUXE",
    text: "Our premium collection, with heavier work, finer fabrics and statement pieces for big occasions.",
  },
  womenswear: {
    title: "WOMENSWEAR",
    text: "Sarees, suit sets, lehengas and more, for every occasion from casual days to weddings.",
  },
  menswear: {
    title: "MENSWEAR",
    text: "Kurtas, sherwanis and festive sets with comfortable fits for the modern wardrobe.",
  },
  kidswear: {
    title: "KIDSWEAR",
    text: "Soft, comfortable ethnic wear for little ones, made for festivals and family celebrations.",
  },
};

const unique = (arr) => [...new Set(arr.filter(Boolean))];
const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());

// The round images row (one circle per sub category)
const TypeCircles = ({ tiles, active, onPick, loading }) => {
  // grey placeholders while products load, so the page doesn't jump
  if (loading) {
    return (
      <div className="mb-8 flex justify-center gap-6 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex animate-pulse flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-gray-200 sm:h-28 sm:w-28 lg:h-32 lg:w-32" />
            <div className="mt-3 h-3 w-16 bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  // Show the row even when there is only one available subcategory.
  if (tiles.length === 0) return null;

  return (
    <div className="mb-8 w-full overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto flex w-max min-w-full justify-center gap-5 px-2 sm:gap-7">
        {tiles.map(({ type, image }) => {
          const on = active.includes(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => onPick(type)}
              aria-pressed={on}
              className="group flex w-24 shrink-0 flex-col items-center sm:w-28 lg:w-32"
            >
              <span
                className={`relative block h-24 w-24 overflow-hidden rounded-full bg-stone-100 shadow-sm transition duration-200 sm:h-28 sm:w-28 lg:h-32 lg:w-32 ${
                  on
                    ? "ring-2 ring-[#e0626a] ring-offset-2"
                    : "ring-1 ring-gray-200 group-hover:ring-[#e0626a]"
                }`}
              >
                {image ? (
                  <img
                    src={image}
                    alt={titleCase(type)}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-2xl font-medium tracking-widest text-[#e0626a]">
                    {titleCase(type).charAt(0)}
                  </span>
                )}
              </span>
              <span
                className={`mt-3 text-center text-xs uppercase tracking-wider sm:text-sm ${
                  on ? "font-semibold text-[#e0626a]" : "text-gray-700 group-hover:text-black"
                }`}
              >
                {titleCase(type)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const CategoryView = ({ category, type }) => {
  // ?type=saree in the address pre-selects that circle
  const [filters, setFilters] = useState({
    ...emptyFilters,
    types: type ? [type] : [],
  });
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [readMore, setReadMore] = useState(false);

  const [base, setBase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // fetch from backend, with the right query for this page
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
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

  // one circle per sub category, using the first product's photo
  const typeTiles = useMemo(() => {
    const map = new Map();
    base.forEach((p) => {
      const t = p.subCategory?.trim();
      if (!t) return;

      // Support common image formats returned by the API.
      const firstImage = Array.isArray(p.images) ? p.images[0] : p.images;
      const image =
        (typeof firstImage === "string" ? firstImage : firstImage?.url) ||
        p.image ||
        p.thumbnail ||
        "";

      if (!map.has(t)) map.set(t, { type: t, image, count: 0 });
      else if (!map.get(t).image && image) map.get(t).image = image;
      map.get(t).count += 1;
    });
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [base]);

  // click a circle to select it, click it again to clear
  const pickType = (t) =>
    setFilters((f) => ({
      ...f,
      types: f.types.length === 1 && f.types[0] === t ? [] : [t],
    }));

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

  const info = pageInfo[category];
  const title = info?.title || category.replace(/-/g, " ").toUpperCase();

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-6 sm:px-8">
      {/* heading + description */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl tracking-[0.2em] text-[#e0626a] sm:text-3xl">{title}</h1>
        {info?.text && (
          <>
            <p
              className={`mx-auto mt-3 max-w-3xl text-gray-700 ${
                readMore ? "" : "line-clamp-1"
              }`}
            >
              {info.text}
            </p>
            <button
              onClick={() => setReadMore(!readMore)}
              className="mt-1 text-sm font-semibold text-[#e0626a]"
            >
              {readMore ? "− Less" : "+ More"}
            </button>
          </>
        )}
      </div>

      {/* circles */}
      <TypeCircles
        tiles={typeTiles}
        active={filters.types}
        onPick={pickType}
        loading={loading}
      />

      {/* toolbar: count, selected-type chip, filters button, sort */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-gray-500">
            {loading ? "Loading..." : `${products.length} products`}
          </p>
          {filters.types.map((t) => (
            <button
              key={t}
              onClick={() => pickType(t)}
              className="rounded-full border border-[#e0626a] px-3 py-1 text-xs text-[#e0626a]"
            >
              {titleCase(t)} ✕
            </button>
          ))}
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

const CategoryPage = () => {
  const { category } = useParams();
  const [params] = useSearchParams();
  const type = (params.get("type") || "").toLowerCase();
  // the key resets the filters whenever the page or the type changes
  return <CategoryView key={`${category}|${type}`} category={category} type={type} />;
};

export default CategoryPage;