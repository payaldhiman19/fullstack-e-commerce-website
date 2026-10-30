import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, ExternalLink, Search } from "lucide-react";
import api from "../api";

// a smaller, faster preview made by Cloudinary (the original file is untouched)
const thumb = (url) =>
  url.includes("res.cloudinary.com") && url.includes("/upload/")
    ? url.replace("/upload/", "/upload/f_auto,q_auto,w_400,ar_3:4,c_fill,g_auto/")
    : url;

function MediaLibrary() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");

  // load ALL products (100 per request, until there are no more pages)
  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      try {
        let page = 1;
        let pages = 1;
        let all = [];

        do {
          const { data } = await api.get("/products", { params: { page, limit: 100 } });
          all = all.concat(data.products || []);
          pages = data.pages || 1;
          page += 1;
        } while (page <= pages);

        if (!cancelled) setProducts(all);
      } catch {
        if (!cancelled) setError("Could not load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAll();

    return () => {
      cancelled = true;
    };
  }, []);

  // one tile per photo; if a photo is used by several products it appears once
  const photos = useMemo(() => {
    const map = new Map();

    products.forEach((p) => {
      (p.images || [])
        .filter((u) => typeof u === "string" && u.trim())
        .forEach((url) => {
          if (!map.has(url)) map.set(url, { url, products: [] });
          map.get(url).products.push({ _id: p._id, name: p.name, slug: p.slug });
        });
    });

    return [...map.values()];
  }, [products]);

  // search by product name, category or sub category
  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return photos;

    const matches = new Set(
      products
        .filter((p) =>
          [p.name, p.category, p.subcategory, p.subCategory]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q))
        )
        .map((p) => p._id)
    );

    return photos.filter((ph) => ph.products.some((p) => matches.has(p._id)));
  }, [photos, products, search]);

  const copyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Media library</h1>
          <p className="mt-1 text-sm text-gray-500">
            {loading
              ? "Loading photos..."
              : `${photos.length} photo${photos.length === 1 ? "" : "s"} from ${products.length} product${products.length === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-500">
          {photos.length === 0
            ? "No photos yet. Add a product with photos and they will appear here."
            : "No photos match your search."}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {shown.map(({ url, products: owners }) => (
            <div key={url}>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                <img src={thumb(url)} alt="" loading="lazy" className="h-full w-full object-cover" />

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => copyUrl(url)}
                    className="flex items-center gap-1 rounded bg-white px-2 py-1 text-xs hover:bg-gray-100"
                  >
                    {copied === url ? <Check size={12} /> : <Copy size={12} />}
                    {copied === url ? "Copied" : "Copy link"}
                  </button>

                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open full size"
                    title="Open full size"
                    className="flex h-7 w-7 items-center justify-center rounded bg-white hover:bg-gray-100"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <Link
                to={`/admin/edit-product/${owners[0].slug}`}
                title={owners.map((o) => o.name).join(", ")}
                className="mt-2 block truncate text-sm text-gray-800 hover:underline"
              >
                {owners[0].name}
              </Link>
              {owners.length > 1 && (
                <p className="text-xs text-gray-500">+{owners.length - 1} more product{owners.length > 2 ? "s" : ""}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MediaLibrary;