import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronDown, Star } from "lucide-react";
import { catalog } from "../data/catalog";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-sm uppercase tracking-[0.2em] text-gray-700"
      >
        {title}
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pb-4 text-sm leading-relaxed text-gray-600">{children}</div>}
    </div>
  );
};

const ProductView = ({ product }) => {
  const { addToCart } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState("");
  const [error, setError] = useState("");

  const {
    name, brand, images, price, comparePrice, discountPercent, sizes,
    rating, reviewCount, description, care, offerLabel, isReadyToShip,
    modelSize, modelHeight,
  } = product;

  const needsSize = sizes.length > 0 && sizes[0].size !== "Free";
  const inStock = sizes.some((s) => s.stock > 0);

  const details = [
    ["Fabric", product.fabric],
    ["Color", product.color],
    ["Neckline", product.neckline],
    ["Sleeve", product.sleeve],
    ["Pattern", product.pattern],
    ["Occasion", product.occasion],
    ["Technique", product.technique],
    ["Model wearing", modelSize && `Size ${modelSize}${modelHeight ? `, height ${modelHeight}` : ""}`],
  ].filter(([, v]) => v);

  const handleAdd = (openCart = true) => {
    if (needsSize && !size) {
      setError("Please select a size");
      return false;
    }
    setError("");
    addToCart({ ...product, selectedSize: size });
    return true;
  };

  const related = catalog
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  return (
    <section className="mx-auto max-w-[1300px] px-4 py-6 sm:px-8">
      {/* Breadcrumb */}
      <p className="mb-4 text-xs uppercase tracking-widest text-gray-500">
        <Link to="/" className="hover:underline">Home</Link> /{" "}
        <Link to={`/${product.category}`} className="hover:underline">
          {product.category}
        </Link>
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
        {/* GALLERY */}
        <div className="flex flex-col-reverse gap-3 md:flex-row">
          <div className="flex gap-2 overflow-x-auto md:max-h-[640px] md:flex-col md:overflow-y-auto">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActiveImg(i)}
                className={`h-24 w-20 shrink-0 overflow-hidden border-2 ${
                  i === activeImg ? "border-black" : "border-transparent"
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="relative flex-1 bg-pink-100">
            <img
              src={images[activeImg]}
              alt={name}
              className="aspect-[3/4] w-full object-cover"
            />
            {offerLabel && (
              <span className="absolute bottom-3 left-3 bg-white px-2 py-1 text-xs tracking-wide">
                {offerLabel}
              </span>
            )}
          </div>
        </div>

        {/* INFO */}
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{brand}</p>
          <h1 className="mt-2 text-2xl text-gray-800">{name}</h1>

          {rating > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <span className="flex items-center gap-1 bg-green-700 px-2 py-0.5 text-white">
                {rating} <Star size={12} fill="white" />
              </span>
              {reviewCount} reviews
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-[#e0626a]">{fmt(price)}</span>
            {comparePrice > price && (
              <span className="text-gray-500 line-through">{fmt(comparePrice)}</span>
            )}
            {discountPercent > 0 && (
              <span className="bg-[#e0626a] px-2 py-0.5 text-xs text-white">
                {discountPercent}% off
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">Inclusive of all taxes</p>

          {isReadyToShip && (
            <span className="mt-3 inline-block border border-gray-800 px-2 py-0.5 text-[11px] font-bold italic uppercase">
              Ready to ship ⚡
            </span>
          )}

          {/* Sizes */}
          {needsSize && (
            <div className="mt-6">
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-gray-700">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const out = s.stock === 0;
                  return (
                    <button
                      key={s.size}
                      disabled={out}
                      onClick={() => { setSize(s.size); setError(""); }}
                      className={`h-11 min-w-[3rem] border px-3 text-sm ${
                        size === s.size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-gray-800 hover:border-black"
                      } ${out ? "cursor-not-allowed text-gray-300 line-through hover:border-gray-300" : ""}`}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              disabled={!inStock}
              onClick={() => handleAdd()}
              className="flex-1 border border-black py-3 text-sm uppercase tracking-widest hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
            >
              {inStock ? "Add to bag" : "Out of stock"}
            </button>
            <button
              disabled={!inStock}
              onClick={() => handleAdd()}
              className="flex-1 bg-[#e0626a] py-3 text-sm uppercase tracking-widest text-white disabled:bg-gray-300"
            >
              Buy now
            </button>
          </div>

          {/* Accordions */}
          <div className="mt-8 border-t border-gray-200">
            <Accordion title="Description">{description}</Accordion>
            <Accordion title="Product details">
              <table className="w-full">
                <tbody>
                  {details.map(([k, v]) => (
                    <tr key={k} className="border-b border-gray-100 last:border-0">
                      <td className="w-1/3 py-2 text-gray-500">{k}</td>
                      <td className="py-2 text-gray-800">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Accordion>
            <Accordion title="Care instructions">{care}</Accordion>
            <Accordion title="Shipping & returns">
              Free shipping on prepaid orders. Orders are dispatched within 2–5
              business days. Returns and exchanges are accepted within 7 days of
              delivery, subject to the store policy.
            </Accordion>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-center text-lg uppercase tracking-[0.25em] text-gray-800">
            You may also like
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

const ProductPage = () => {
  const { slug } = useParams();
  const product = catalog.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="py-32 text-center text-gray-500">
        <p className="text-lg">Product not found</p>
        <Link to="/" className="mt-3 inline-block underline">Back to home</Link>
      </div>
    );
  }

  return <ProductView key={slug} product={product} />;
};

export default ProductPage;