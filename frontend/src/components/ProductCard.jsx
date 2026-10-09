import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { isWished, toggleWish } = useWishlist();
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);
  const [index, setIndex] = useState(0);
  const [picker, setPicker] = useState(false); // is the size picker open?

  const {
    _id,
    name,
    slug,
    brand,
    images = [],
    price,
    comparePrice,
    discountPercent,
    offerLabel,
    isReadyToShip,
    isNewArrival,
    sizes = [],
  } = product;

  const discount =
    discountPercent ??
    (comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0);

  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

  const soldOut = sizes.length > 0 && sizes.every((s) => s.stock <= 0);
 
  useEffect(() => {
    if (!hovered || picker || images.length < 2) {
      setIndex(0);
      return;
    }
    setIndex(1); // show the next picture immediately
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 1000);
    return () => clearInterval(timer);
  }, [hovered, picker, images.length]);

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleQuickAdd = (e) => {
    stop(e);
    if (sizes.length === 1) {
      addToCart(product, sizes[0].size); // only one size: add straight away
      return;
    }
    setPicker((open) => !open);
  };

  const pickSize = (e, size) => {
    stop(e);
    addToCart(product, size); // adds to the cart and opens the drawer
    setPicker(false);
  };

  return (
    <Link to={`/products/${slug}`} className="block">
      <div
        className="group relative aspect-[4/5] overflow-hidden bg-pink-100"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setPicker(false);
        }}
      >
        {images.map((img, i) => (
          <img
            key={img}
            src={img}
            alt={name}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {isNewArrival && (
          <span className="absolute left-2 top-2 z-10 bg-[#e0626a] px-1.5 py-0.5 text-[11px] text-white">
            NEW
          </span>
        )}

        <button
          onClick={(e) => {
            stop(e);
            toggleWish(_id);
          }}
          aria-label="Add to wishlist"
          className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none shadow ${
            isWished(_id) ? "bg-white text-[#e0626a]" : "bg-black/30 text-white"
          }`}
        >
          {isWished(_id) ? "♥" : "♡"}
        </button>

        {offerLabel && (
          <span className="absolute bottom-2 left-2 z-10 bg-white px-2 py-1 text-xs tracking-wide text-gray-800">
            {offerLabel}
          </span>
        )}

        {soldOut ? (
          <span className="absolute bottom-2 right-2 z-10 bg-black/70 px-2 py-1 text-[11px] uppercase text-white">
            Sold out
          </span>
        ) : (
          <button
            onClick={handleQuickAdd}
            aria-label="Quick add to cart"
            className="absolute bottom-2 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow transition duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
          >
            <Plus size={18} />
          </button>
        )}

        {/* size picker */}
        {picker && (
          <div className="absolute inset-x-0 bottom-0 z-20 bg-white/95 p-3" onClick={stop}>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-gray-500">Select size</p>
              <button
                onClick={(e) => {
                  stop(e);
                  setPicker(false);
                }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s.size}
                  disabled={s.stock <= 0}
                  onClick={(e) => pickSize(e, s.size)}
                  className="min-w-[40px] border px-2 py-1 text-sm hover:border-black disabled:cursor-not-allowed disabled:text-gray-300 disabled:line-through"
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <h3 className="mt-3 truncate text-base text-gray-800" title={name}>
        {name}
      </h3>
      <p className="mt-1 text-sm uppercase tracking-[0.25em] text-gray-400">RIVANA</p>

      <div className="mt-2 flex items-center gap-2">
        <span className="font-semibold text-[#e0626a]">{fmt(price)}</span>
        {comparePrice > price && (
          <span className="text-sm text-gray-500 line-through">{fmt(comparePrice)}</span>
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