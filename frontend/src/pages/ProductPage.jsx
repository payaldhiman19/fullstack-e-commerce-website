// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import api from "../api";

// const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// function Accordion({ title, children }) {
//   const [open, setOpen] = useState(true);
//   return (
//     <div className="border-t py-4">
//       <button
//         onClick={() => setOpen(!open)}
//         className="flex w-full items-center justify-between text-left text-sm uppercase tracking-[0.25em] text-gray-700"
//       >
//         {title}
//         <span className="text-lg">{open ? "⌃" : "⌄"}</span>
//       </button>
//       {open && <div className="mt-4 text-sm text-gray-600">{children}</div>}
//     </div>
//   );
// }

// function ProductPage() {
//   const { slug } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);
//   const [selectedSize, setSelectedSize] = useState("");

//   useEffect(() => {
//     setLoading(true);
//     setActiveImage(0);
//     setSelectedSize("");
//     api.get(`/products/${slug}`)
//       .then((res) => setProduct(res.data))
//       .catch(() => setProduct(null))
//       .finally(() => setLoading(false));
//   }, [slug]);
// if (loading) {
//   return (
//     <div className="mx-auto max-w-6xl px-4 py-6 min-h-screen">
//       <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] animate-pulse">
//         <div className="h-[600px] bg-gray-200" />
//         <div className="space-y-4">
//           <div className="h-4 w-24 bg-gray-200" />
//           <div className="h-8 w-3/4 bg-gray-200" />
//           <div className="h-10 w-40 bg-gray-200" />
//           <div className="h-11 w-full bg-gray-200" />
//           <div className="h-11 w-full bg-gray-200" />
//         </div>
//       </div>
//     </div>
//   );
// }
//   const { addToCart } = useCart();
 
//   if (!product) {
//     return (
//       <div className="p-10">
//         <p className="mb-4">Product not found.</p>
//         <Link to="/" className="underline">Back to home</Link>
//       </div>
//     );
//   }

//   const {
//     name, brand, images = [], price, comparePrice, discountPercent,
//     rating, reviewCount, sizes = [], description, category,
//   } = product;

//   const allSoldOut = sizes.length > 0 && sizes.every((s) => s.stock <= 0);
//   const discount =
//     discountPercent ||
//     (comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0);

//   const details = [
//     ["Fabric", product.fabric],
//     ["Dupatta Fabric", product.dupattaFabric],
//     ["Color", product.color],
//     ["Neckline", product.neckline],
//     ["Sleeve", product.sleeve],
//     ["Pattern", product.pattern],
//     ["Occasion", product.occasion],
//     ["Technique", product.technique],
//     ["Care", product.care],
//     ["Model Size", product.modelSize],
//     ["Model Height", product.modelHeight],
//   ].filter(([, value]) => value);

//   const handleAddToCart = () => {
//   if (!selectedSize) return;
//   addToCart(product, selectedSize);
// };
//   return (
//     <div className="mx-auto max-w-6xl px-4 py-6">
//       <p className="mb-4 text-xs uppercase tracking-widest text-gray-500">
//         <Link to="/">Home</Link> / {category}
//       </p>

//       <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
      
//         <div className="flex flex-col-reverse gap-3 md:flex-row">
//           <div className="flex gap-2 md:flex-col">
//             {images.map((img, i) => (
//               <img
//                 key={img}
//                 src={img}
//                 alt=""
//                 onClick={() => setActiveImage(i)}
//                 className={`h-24 w-20 cursor-pointer object-cover ${
//                   i === activeImage ? "ring-2 ring-black" : "opacity-80"
//                 }`}
//               />
//             ))}
//           </div>
//           <img
//             src={images[activeImage]}
//             alt={name}
//             className="w-full object-cover md:max-h-[680px]"
//           />
//         </div>

//         <div>
//           <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{brand}</p>
//           <h1 className="mt-1 text-2xl text-gray-900">{name}</h1>

//           {reviewCount > 0 && (
//             <div className="mt-2 flex items-center gap-3 text-sm">
//               <span className="bg-green-700 px-2 py-0.5 text-white">{rating} ★</span>
//               <span className="text-gray-500">{reviewCount} reviews</span>
//             </div>
//           )}

//           <div className="mt-4 flex flex-wrap items-center gap-3">
//             <span className="text-3xl text-[#e0626a]">{fmt(price)}</span>
//             {comparePrice > price && (
//               <span className="text-gray-500 line-through">{fmt(comparePrice)}</span>
//             )}
//             {discount > 0 && (
//               <span className="bg-[#e0626a] px-2 py-0.5 text-xs text-white">{discount}% off</span>
//             )}
//           </div>
//           <p className="mt-1 text-xs text-gray-500">Inclusive of all taxes</p>

//           {/* Sizes */}
//           <p className="mb-3 mt-6 text-sm uppercase tracking-[0.25em] text-gray-700">Size</p>
//           <div className="flex flex-wrap gap-2">
//             {sizes.map((s) => {
//               const soldOut = s.stock <= 0;
//               return (
//                 <button
//                   key={s.size}
//                   disabled={soldOut}
//                   onClick={() => setSelectedSize(s.size)}
//                   className={`h-11 min-w-[48px] border px-3 text-sm ${
//                     soldOut ? "cursor-not-allowed text-gray-300 line-through" : "hover:border-black"
//                   } ${selectedSize === s.size ? "border-black bg-black text-white" : ""}`}
//                 >
//                   {s.size}
//                 </button>
//               );
//             })}
//           </div>

//           {/* Buttons */}
//           <div className="mt-6 grid grid-cols-2 gap-3">
//             {allSoldOut ? (
//               <>
//                 <button disabled className="border py-3 text-sm uppercase tracking-widest text-gray-400">
//                   Out of stock
//                 </button>
//                 <button disabled className="bg-gray-300 py-3 text-sm uppercase tracking-widest text-white">
//                   Buy now
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button
//                   disabled={!selectedSize}
//                   onClick={handleAddToCart}
//                   className="border border-black py-3 text-sm uppercase tracking-widest disabled:border-gray-300 disabled:text-gray-400"
//                 >
//                   {selectedSize ? "Add to cart" : "Select a size"}
//                 </button>
//                 <button
//                   disabled={!selectedSize}
//                   className="bg-black py-3 text-sm uppercase tracking-widest text-white disabled:bg-gray-300"
//                 >
//                   Buy now
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Accordions */}
//           <div className="mt-8">
//             {description && (
//               <Accordion title="Description">
//                 <p>{description}</p>
//               </Accordion>
//             )}
//             {details.length > 0 && (
//               <Accordion title="Product details">
//                 <table className="w-full">
//                   <tbody>
//                     {details.map(([label, value]) => (
//                       <tr key={label} className="border-b last:border-0">
//                         <td className="w-1/2 py-2.5 text-gray-500">{label}</td>
//                         <td className="py-2.5 text-gray-800">{value}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </Accordion>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductPage;




import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import api from "../api";

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

function Accordion({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-t py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left text-sm uppercase tracking-[0.25em] text-gray-700"
      >
        {title}
        <span className="text-lg">{open ? "⌃" : "⌄"}</span>
      </button>
      {open && <div className="mt-4 text-sm text-gray-600">{children}</div>}
    </div>
  );
}

function ProductPage() {
  // ---- all hooks go here, before any early return ----
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { isWished, toggleWish } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [related, setRelated] = useState([]);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });

  // load the product
  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    setSelectedSize("");
    setRelated([]);
    api
      .get(`/products/${slug}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);
  useEffect(() => {
  window.scrollTo(0, 0);
}, [slug]);3

  // load more products from the same category
  useEffect(() => {
    if (!product?.category) return;
    let cancelled = false;
    api
      .get("/products", { params: { category: product.category, limit: 5 } })
      .then((res) => {
        if (cancelled) return;
        setRelated(res.data.products.filter((p) => p._id !== product._id).slice(0, 4));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [product]);

  // ---- early returns come after all hooks ----
  if (loading) {
    return (
      <div className="mx-auto min-h-screen max-w-6xl px-4 py-6">
        <div className="grid animate-pulse gap-8 md:grid-cols-[1.2fr_1fr]">
          <div className="h-[600px] bg-gray-200" />
          <div className="space-y-4">
            <div className="h-4 w-24 bg-gray-200" />
            <div className="h-8 w-3/4 bg-gray-200" />
            <div className="h-10 w-40 bg-gray-200" />
            <div className="h-11 w-full bg-gray-200" />
            <div className="h-11 w-full bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10">
        <p className="mb-4">Product not found.</p>
        <Link to="/" className="underline">Back to home</Link>
      </div>
    );
  }

  const {
    _id, name, brand, images = [], price, comparePrice, discountPercent,
    rating, reviewCount, sizes = [], description, category,
  } = product;

  const allSoldOut = sizes.length > 0 && sizes.every((s) => s.stock <= 0);
  const discount =
    discountPercent ||
    (comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0);
  const selectedStock = sizes.find((s) => s.size === selectedSize)?.stock;

  const details = [
    ["Fabric", product.fabric],
    ["Dupatta Fabric", product.dupattaFabric],
    ["Color", product.color],
    ["Neckline", product.neckline],
    ["Sleeve", product.sleeve],
    ["Pattern", product.pattern],
    ["Occasion", product.occasion],
    ["Technique", product.technique],
    ["Care", product.care],
    ["Model Size", product.modelSize],
    ["Model Height", product.modelHeight],
  ].filter(([, value]) => value);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize); // also opens the cart drawer
  };

  const handleBuyNow = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize);
    // later: navigate("/checkout");
  };

  const handleZoomMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      on: true,
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* breadcrumb */}
      <p className="mb-4 text-xs uppercase tracking-widest text-gray-500">
        <Link to="/" className="hover:text-black">Home</Link>
        {" / "}
        <Link to={`/${category}`} className="hover:text-black">{category}</Link>
        {" / "}
        <span className="text-gray-800">{name}</span>
      </p>

      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
        {/* gallery */}
        <div className="flex flex-col-reverse gap-3 md:flex-row">
          <div className="flex gap-2 md:flex-col">
            {images.map((img, i) => (
              <img
                key={img}
                src={img}
                alt=""
                onClick={() => setActiveImage(i)}
                className={`h-24 w-20 cursor-pointer object-cover ${
                  i === activeImage ? "ring-2 ring-black" : "opacity-80 hover:opacity-100"
                }`}
              />
            ))}
          </div>

          <div
            className="w-full cursor-zoom-in overflow-hidden"
            onPointerMove={handleZoomMove}
            onPointerLeave={() => setZoom((z) => ({ ...z, on: false }))}
          >
            <img
              src={images[activeImage]}
              alt={name}
              style={{ transformOrigin: `${zoom.x}% ${zoom.y}%` }}
              className={`w-full object-cover transition-transform duration-200 md:max-h-[680px] ${
                zoom.on ? "scale-150" : "scale-100"
              }`}
            />
          </div>
        </div>

        {/* details */}
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{brand}</p>

          <div className="mt-1 flex items-start justify-between gap-4">
            <h1 className="text-2xl text-gray-900">{name}</h1>
            <button
              onClick={() => toggleWish(_id)}
              aria-label="Add to wishlist"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xl ${
                isWished(_id) ? "border-[#e0626a] text-[#e0626a]" : "text-gray-500"
              }`}
            >
              {isWished(_id) ? "♥" : "♡"}
            </button>
          </div>

          {reviewCount > 0 && (
            <div className="mt-2 flex items-center gap-3 text-sm">
              <span className="bg-green-700 px-2 py-0.5 text-white">{rating} ★</span>
              <span className="text-gray-500">{reviewCount} reviews</span>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-3xl text-[#e0626a]">{fmt(price)}</span>
            {comparePrice > price && (
              <span className="text-gray-500 line-through">{fmt(comparePrice)}</span>
            )}
            {discount > 0 && (
              <span className="bg-[#e0626a] px-2 py-0.5 text-xs text-white">{discount}% off</span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">Inclusive of all taxes</p>

          {/* sizes */}
          <p className="mb-3 mt-6 text-sm uppercase tracking-[0.25em] text-gray-700">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const soldOut = s.stock <= 0;
              return (
                <button
                  key={s.size}
                  disabled={soldOut}
                  onClick={() => setSelectedSize(s.size)}
                  className={`h-11 min-w-[48px] border px-3 text-sm ${
                    soldOut ? "cursor-not-allowed text-gray-300 line-through" : "hover:border-black"
                  } ${selectedSize === s.size ? "border-black bg-black text-white" : ""}`}
                >
                  {s.size}
                </button>
              );
            })}
          </div>

          {selectedSize && selectedStock <= 3 && (
            <p className="mt-3 text-sm text-[#e0626a]">Only {selectedStock} left!</p>
          )}

          {/* buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {allSoldOut ? (
              <>
                <button disabled className="border py-3 text-sm uppercase tracking-widest text-gray-400">
                  Out of stock
                </button>
                <button disabled className="bg-gray-300 py-3 text-sm uppercase tracking-widest text-white">
                  Buy now
                </button>
              </>
            ) : (
              <>
                <button
                  disabled={!selectedSize}
                  onClick={handleAddToCart}
                  className="border border-black py-3 text-sm uppercase tracking-widest disabled:border-gray-300 disabled:text-gray-400"
                >
                  {selectedSize ? "Add to cart" : "Select a size"}
                </button>
                <button
                  disabled={!selectedSize}
                  onClick={handleBuyNow}
                  className="bg-black py-3 text-sm uppercase tracking-widest text-white disabled:bg-gray-300"
                >
                  Buy now
                </button>
              </>
            )}
          </div>

          {/* accordions */}
          <div className="mt-8">
            {description && (
              <Accordion title="Description">
                <p>{description}</p>
              </Accordion>
            )}
            {details.length > 0 && (
              <Accordion title="Product details">
                <table className="w-full">
                  <tbody>
                    {details.map(([label, value]) => (
                      <tr key={label} className="border-b last:border-0">
                        <td className="w-1/2 py-2.5 text-gray-500">{label}</td>
                        <td className="py-2.5 text-gray-800">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Accordion>
            )}
          </div>
        </div>
      </div>

      {/* related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-center text-lg tracking-[0.25em] text-gray-800">
            YOU MAY ALSO LIKE
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductPage;