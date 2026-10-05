import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

const ProductCard = ({ product }) => {
  const { isWished, toggleWish } = useWishlist();

  const {
    _id,
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
            e.preventDefault(); // don't follow the card link
            toggleWish(_id);
          }}
          aria-label="Add to wishlist"
          className={`absolute right-3 top-3 text-2xl leading-none drop-shadow ${
            isWished(_id) ? "text-[#e0626a]" : "text-white"
          }`}
        >
          {isWished(_id) ? "♥" : "♡"}
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