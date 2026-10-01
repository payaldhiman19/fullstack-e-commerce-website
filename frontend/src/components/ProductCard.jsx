// import { Link } from "react-router-dom";
//  -------   backend one----correct one
//  function ProductCard({ product }) {
//   return (
//     <Link to={`/product/${product.slug}`} className="block">
//       <div className="relative overflow-hidden rounded-lg bg-white shadow-sm">
//         <img
//           src={product.images?.[0]}
//           alt={product.name}
//           className="aspect-[3/4] w-full object-cover"
//         />

//         {product.discountPercent > 0 && (
//           <span className="absolute left-2 top-2 rounded bg-pink-600 px-2 py-1 text-xs font-semibold text-white">
//             {product.discountPercent}% OFF
//           </span>
//         )}
//       </div>

//       <div className="mt-2">
//         <h3 className="truncate text-sm font-medium">{product.name}</h3>

//         <p className="mt-1 text-sm">
//           <span className="font-semibold">₹{product.price}</span>
//           {product.comparePrice > product.price && (
//             <span className="ml-2 text-gray-400 line-through">
//               ₹{product.comparePrice}
//             </span>
//           )}
//         </p>
//       </div>
//     </Link>
//   );
// }

// export default ProductCard;


import { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [wishlisted, setWishlisted] = useState(false);

  const {
    name,
    slug,
    brand,
    images,
    price,
    comparePrice,
    discountPercent,
    offerLabel,
    isReadyToShip,
    isNewArrival,
  } = product;

  const discount =
    discountPercent ??
    (comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0);

  const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <Link to={`/products/${slug}`} className="block">
      <div className="relative aspect-[4/5] overflow-hidden bg-pink-100">
        <img
          src={images?.[0]}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {isNewArrival && (
          <span className="absolute left-2 top-2 bg-[#e0626a] px-1.5 py-0.5 text-[11px] text-white">
            NEW
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault(); // don't follow the link
            setWishlisted(!wishlisted);
          }}
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 text-2xl leading-none text-white drop-shadow"
        >
          {wishlisted ? "♥" : "♡"}
        </button>

        {offerLabel && (
          <span className="absolute bottom-2 left-2 bg-white px-2 py-1 text-xs tracking-wide text-gray-800">
            {offerLabel}
          </span>
        )}
      </div>

      <h3 className="mt-3 truncate text-base text-gray-800" title={name}>
        {name}
      </h3>
      <p className="mt-1 text-sm uppercase tracking-[0.25em] text-gray-400">
        {brand}
      </p>

      <div className="mt-2 flex items-center gap-2">
        <span className="font-semibold text-[#e0626a]">{fmt(price)}</span>
        {comparePrice > price && (
          <span className="text-sm text-gray-500 line-through">
            {fmt(comparePrice)}
          </span>
        )}
        {discount > 0 && (
          <span className="bg-[#e0626a] px-1.5 py-0.5 text-xs text-white">
            {discount}% off
          </span>
        )}
      </div>

      {isReadyToShip && (
        <span className="mt-2 inline-block border border-gray-800 px-2 py-0.5 text-[11px] font-bold italic uppercase">
          Ready to ship ⚡
        </span>
      )}
    </Link>
  );
};

export default ProductCard;


// import { useState } from "react";

// const ProductCard = ({ product }) => {
//   const [wishlisted, setWishlisted] = useState(false);

//   const {
//     name,
//     brand,
//     images,
//     price,
//     comparePrice,
//     discountPercent,
//     offerLabel,
//     isReadyToShip,
//   } = product;

//   const discount =
//     discountPercent ??
//     (comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0);

//   const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

//   return (
//     <div className="cursor-pointer">
//       {/* Image */}
//       <div className="relative aspect-[4/5] overflow-hidden bg-pink-100">
//         <img
//           src={images?.[0]}
//           alt={name}
//           className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
//         />

//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             setWishlisted(!wishlisted);
//           }}
//           aria-label="Add to wishlist"
//           className="absolute right-3 top-3 text-2xl leading-none text-white drop-shadow"
//         >
//           {wishlisted ? "♥" : "♡"}
//         </button>

//         {offerLabel && (
//           <span className="absolute bottom-2 left-2 bg-white px-2 py-1 text-xs tracking-wide text-gray-800">
//             {offerLabel}
//           </span>
//         )}
//       </div>

//       {/* Details */}
//       <h3 className="mt-3 truncate text-base text-gray-800" title={name}>
//         {name}
//       </h3>
//       <p className="mt-1 text-sm uppercase tracking-[0.25em] text-gray-400">
//         {brand}
//       </p>

//       <div className="mt-2 flex items-center gap-2">
//         <span className="font-semibold text-[#e0626a]">{fmt(price)}</span>
//         {comparePrice > price && (
//           <span className="text-sm text-gray-500 line-through">
//             {fmt(comparePrice)}
//           </span>
//         )}
//         {discount > 0 && (
//           <span className="bg-[#e0626a] px-1.5 py-0.5 text-xs text-white">
//             {discount}% off
//           </span>
//         )}
//       </div>

//       {isReadyToShip && (
//         <span className="mt-2 inline-block border border-gray-800 px-2 py-0.5 text-[11px] font-bold italic uppercase">
//           Ready to ship ⚡
//         </span>
//       )}
//     </div>
//   );
// };

// export default ProductCard;