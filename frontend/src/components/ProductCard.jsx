import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.slug}`} className="block">
      <div className="relative overflow-hidden rounded-lg bg-white shadow-sm">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="aspect-[3/4] w-full object-cover"
        />

        {product.discountPercent > 0 && (
          <span className="absolute left-2 top-2 rounded bg-pink-600 px-2 py-1 text-xs font-semibold text-white">
            {product.discountPercent}% OFF
          </span>
        )}
      </div>

      <div className="mt-2">
        <h3 className="truncate text-sm font-medium">{product.name}</h3>

        <p className="mt-1 text-sm">
          <span className="font-semibold">₹{product.price}</span>
          {product.comparePrice > product.price && (
            <span className="ml-2 text-gray-400 line-through">
              ₹{product.comparePrice}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;