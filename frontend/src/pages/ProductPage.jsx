import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import api from "../api";

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-gray-200 py-4">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className="flex w-full items-center justify-between text-left text-sm uppercase tracking-widest"
      >
        <span>{title}</span>
        <span className="text-xl">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="mt-4 text-sm leading-7 text-gray-600">
          {children}
        </div>
      )}
    </div>
  );
}

function ProductPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { isWished, toggleWish } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [related, setRelated] = useState([]);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");

  // Fetch product information
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setProduct(null);
    setActiveImage(0);
    setSelectedSize("");
    setRelated([]);
    setImageViewerOpen(false);
    setDeliveryMessage("");

    api
      .get(`/products/${slug}`)
      .then((res) => {
        if (!cancelled) {
          setProduct(res.data);
        }
      })
      .catch((error) => {
        console.error("Unable to fetch product:", error);

        if (!cancelled) {
          setProduct(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Fetch related products
  useEffect(() => {
    if (!product?.category) return;

    let cancelled = false;

    api
      .get("/products", {
        params: {
          category: product.category,
          limit: 5,
        },
      })
      .then((res) => {
        if (cancelled) return;

        const products = Array.isArray(res.data)
          ? res.data
          : res.data.products || [];

        setRelated(
          products
            .filter((item) => item._id !== product._id)
            .slice(0, 4)
        );
      })
      .catch((error) => {
        console.error("Unable to fetch related products:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [product]);

  // Keyboard controls for the full-screen image viewer
  useEffect(() => {
    if (!imageViewerOpen || !product) return;

    const images = (product.images || []).filter(
      (image) => typeof image === "string" && image.trim()
    );

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setImageViewerOpen(false);
      }

      if (event.key === "ArrowRight" && images.length > 1) {
        setActiveImage((current) => (current + 1) % images.length);
      }

      if (event.key === "ArrowLeft" && images.length > 1) {
        setActiveImage((current) =>
          current === 0 ? images.length - 1 : current - 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Prevent background scrolling while the viewer is open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [imageViewerOpen, product]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8">
        <div className="grid animate-pulse gap-8 lg:grid-cols-2">
          <div className="aspect-[3/4] bg-gray-200" />

          <div className="space-y-5 py-4">
            <div className="h-4 w-32 bg-gray-200" />
            <div className="h-8 w-3/4 bg-gray-200" />
            <div className="h-7 w-40 bg-gray-200" />
            <div className="h-12 w-full bg-gray-200" />
            <div className="h-12 w-full bg-gray-200" />
            <div className="h-14 w-full bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl">Product not found</h1>

        <p className="mt-3 text-sm text-gray-500">
          This product may be unavailable.
        </p>

        <Link
          to="/"
          className="mt-6 border border-black px-8 py-3 text-sm uppercase tracking-widest hover:bg-black hover:text-white"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const {
    _id,
    name,
    brand,
    images = [],
    price,
    comparePrice,
    discountPercent,
    rating,
    reviewCount,
    sizes = [],
    description,
    category,
  } = product;

  const productImages = images.filter(
    (image) => typeof image === "string" && image.trim()
  );

  const activeImageUrl = productImages[activeImage];

  const allSoldOut =
    sizes.length > 0 &&
    sizes.every((size) => Number(size.stock) <= 0);

  const discount =
    discountPercent ||
    (Number(comparePrice) > Number(price)
      ? Math.round(
          ((Number(comparePrice) - Number(price)) /
            Number(comparePrice)) *
            100
        )
      : 0);

  const selectedSizeData = sizes.find(
    (size) => size.size === selectedSize
  );

  const selectedStock = selectedSizeData
    ? Number(selectedSizeData.stock)
    : undefined;

  const details = [
    ["Fabric", product.fabric],
    ["Dupatta Fabric", product.dupattaFabric],
    ["Color", product.color],
    ["Neckline", product.neckline],
    ["Sleeve", product.sleeve],
    ["Pattern", product.pattern],
    ["Occasion", product.occasion],
    ["Technique", product.technique],
    ["Care Instructions", product.care],
    ["Model Size", product.modelSize],
    ["Model Height", product.modelHeight],
  ].filter(([, value]) => value);

  const showPreviousImage = () => {
    setActiveImage((current) =>
      current === 0 ? productImages.length - 1 : current - 1
    );
  };

  const showNextImage = () => {
    setActiveImage((current) => (current + 1) % productImages.length);
  };

  const handleAddToCart = () => {
    if (!selectedSize || allSoldOut) return;

    addToCart(product, selectedSize);
  };

  // This adds the product to the cart.
  // Connect your checkout route here to make Buy Now go directly to checkout.
  const handleBuyNow = () => {
    if (!selectedSize || allSoldOut) return;

    addToCart(product, selectedSize);
  };

  const checkDelivery = () => {
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setDeliveryMessage("Please enter a valid 6-digit pincode.");
      return;
    }

    setDeliveryMessage(
      "Pincode format is valid. Confirm delivery availability at checkout."
    );
  };

  return (
    <main className="w-full bg-white">
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-gray-500"
        >
          <Link to="/" className="hover:text-black">
            Home
          </Link>

          <span>/</span>

          <span>{category}</span>

          <span>/</span>

          <span className="line-clamp-1 text-gray-800">{name}</span>
        </nav>

        {/* Main product layout */}
        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 xl:gap-16">
          {/* LEFT: Sticky image gallery */}
          <section className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
              {/* Image thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 sm:w-[84px] sm:shrink-0 sm:flex-col sm:overflow-x-hidden sm:overflow-y-auto sm:pb-0 lg:max-h-[calc(100vh-7rem)]">
                  {productImages.map((image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      onClick={() => setActiveImage(index)}
                      aria-label={`View image ${index + 1}`}
                      aria-pressed={activeImage === index}
                      className={`h-20 w-16 shrink-0 overflow-hidden border sm:h-[108px] sm:w-full ${
                        activeImage === index
                          ? "border-black"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${name}, view ${index + 1}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image - click to open full screen */}
              <div className="relative min-w-0 flex-1 overflow-hidden bg-[#f7f5f2]">
                {activeImageUrl ? (
                  <button
                    type="button"
                    onClick={() => setImageViewerOpen(true)}
                    aria-label="Open full-screen product image"
                    className="block w-full cursor-zoom-in"
                  >
                    <img
                      src={activeImageUrl}
                      alt={name}
                      className="aspect-[3/4] w-full object-cover"
                    />
                  </button>
                ) : (
                  <div className="flex aspect-[3/4] items-center justify-center text-sm text-gray-400">
                    Product image unavailable
                  </div>
                )}

                {discount > 0 && (
                  <span className="absolute left-3 top-3 bg-[#e0626a] px-3 py-1 text-xs uppercase tracking-wider text-white">
                    {discount}% off
                  </span>
                )}

                {productImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={showPreviousImage}
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl shadow hover:bg-white"
                    >
                      ‹
                    </button>

                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={showNextImage}
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl shadow hover:bg-white"
                    >
                      ›
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setImageViewerOpen(true)}
                  className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-2 text-xs uppercase tracking-wider shadow hover:bg-white"
                >
                  View image ⤢
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT: Product information scrolls with the page */}
          <section className="min-w-0">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              {brand || "RIVANA"}
            </p>

            <div className="mt-3 flex items-start justify-between gap-4">
              <h1 className="text-2xl font-normal leading-snug text-gray-900 sm:text-3xl">
                {name}
              </h1>

              <button
                type="button"
                onClick={() => toggleWish(_id)}
                aria-label={
                  isWished(_id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                aria-pressed={isWished(_id)}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-2xl ${
                  isWished(_id)
                    ? "border-[#e0626a] text-[#e0626a]"
                    : "border-gray-300 text-gray-600 hover:border-black"
                }`}
              >
                {isWished(_id) ? "♥" : "♡"}
              </button>
            </div>

            {/* Rating */}
            {Number(reviewCount) > 0 && (
              <div className="mt-4 flex items-center gap-3 text-sm">
                <span className="bg-green-700 px-2 py-1 text-white">
                  {Number(rating || 0).toFixed(1)} ★
                </span>

                <span className="text-gray-500">
                  {reviewCount} reviews
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-medium text-[#c75e65]">
                {fmt(price)}
              </span>

              {Number(comparePrice) > Number(price) && (
                <span className="text-lg text-gray-400 line-through">
                  {fmt(comparePrice)}
                </span>
              )}

              {discount > 0 && (
                <span className="border border-[#e0626a] px-2 py-1 text-xs text-[#c75e65]">
                  SAVE {discount}%
                </span>
              )}
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Inclusive of all taxes
            </p>

            <div className="my-6 border-t border-gray-200" />

            {/* Sizes */}
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium uppercase tracking-widest">
                Select size
              </p>

              <button
                type="button"
                onClick={() => setSizeChartOpen(true)}
                className="border-b border-gray-500 pb-1 text-xs uppercase tracking-wider hover:border-black"
              >
                Size guide
              </button>
            </div>

            {sizes.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const soldOut = Number(size.stock) <= 0;
                  const selected = selectedSize === size.size;

                  return (
                    <button
                      type="button"
                      key={size.size}
                      disabled={soldOut}
                      onClick={() => setSelectedSize(size.size)}
                      aria-pressed={selected}
                      className={`min-w-[52px] border px-4 py-3 text-sm transition ${
                        soldOut
                          ? "cursor-not-allowed border-gray-200 text-gray-300"
                          : selected
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-black"
                      }`}
                    >
                      <span className={soldOut ? "line-through" : ""}>
                        {size.size}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                No sizes are configured for this product.
              </p>
            )}

            {selectedSize &&
              selectedStock !== undefined &&
              selectedStock > 0 &&
              selectedStock <= 3 && (
                <p className="mt-3 text-sm text-[#c75e65]">
                  Only {selectedStock} left in size {selectedSize}!
                </p>
              )}

            {allSoldOut && (
              <p className="mt-3 text-sm text-red-600">
                This product is currently out of stock.
              </p>
            )}

            {/* Add to cart and Buy now */}
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={!selectedSize || allSoldOut}
                onClick={handleAddToCart}
                className="min-h-[52px] border border-black px-5 py-3 text-sm uppercase tracking-widest transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white"
              >
                {allSoldOut
                  ? "Out of stock"
                  : selectedSize
                    ? "Add to cart"
                    : "Select a size"}
              </button>

              <button
                type="button"
                disabled={!selectedSize || allSoldOut}
                onClick={handleBuyNow}
                className="min-h-[52px] bg-black px-5 py-3 text-sm uppercase tracking-widest text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Buy now
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-gray-500">
              Secure shopping · Quality products
            </p>

            {/* Delivery checker */}
            <div className="mt-8 border border-gray-200 p-4 sm:p-5">
              <h2 className="text-sm font-medium uppercase tracking-wider">
                Check delivery availability
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Enter your pincode to check delivery information.
              </p>

              <div className="mt-4 flex border-b border-gray-400">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(event) => {
                    setPincode(
                      event.target.value.replace(/\D/g, "").slice(0, 6)
                    );
                    setDeliveryMessage("");
                  }}
                  placeholder="Enter 6-digit pincode"
                  aria-label="Delivery pincode"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={checkDelivery}
                  className="px-2 text-sm font-medium uppercase tracking-wider hover:text-[#c75e65]"
                >
                  Check
                </button>
              </div>

              {deliveryMessage && (
                <p className="mt-3 text-sm text-gray-600">
                  {deliveryMessage}
                </p>
              )}
            </div>

            {/* Benefits */}
            <div className="mt-6 grid grid-cols-3 gap-3 border-y border-gray-200 py-5 text-center">
              <div>
                <span className="text-xl">↗</span>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-gray-600 sm:text-xs">
                  Secure payment
                </p>
              </div>

              <div>
                <span className="text-xl">◇</span>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-gray-600 sm:text-xs">
                  Quality products
                </p>
              </div>

              <div>
                <span className="text-xl">♡</span>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-gray-600 sm:text-xs">
                  Made with care
                </p>
              </div>
            </div>

            {/* Product information accordions */}
            <div className="mt-5">
              {description && (
                <Accordion title="Product description">
                  <p className="whitespace-pre-line">{description}</p>
                </Accordion>
              )}

              {details.length > 0 && (
                <Accordion title="Product specifications">
                  <table className="w-full border-collapse">
                    <tbody>
                      {details.map(([label, value]) => (
                        <tr
                          key={label}
                          className="border-b border-gray-100 last:border-0"
                        >
                          <td className="w-1/2 py-3 pr-4 text-gray-500">
                            {label}
                          </td>

                          <td className="py-3 text-gray-800">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Accordion>
              )}

              <Accordion title="Shipping information">
                <p>
                  Delivery availability and estimated delivery dates
                  should be confirmed at checkout. The pincode checker
                  currently validates the pincode format only.
                </p>
              </Accordion>

              <Accordion title="Returns and exchanges">
                <p>
                  Please check Rivana's return and exchange policy
                  before placing your order.
                </p>
              </Accordion>
            </div>
          </section>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-gray-200 pt-10 sm:mt-20 sm:pt-14">
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                Discover more
              </p>

              <h2 className="mt-3 text-xl font-normal uppercase tracking-[0.2em] sm:text-2xl">
                You may also like
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-7">
              {related.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Full-screen product image viewer */}
      {imageViewerOpen && productImages.length > 0 && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-white"
          role="dialog"
          aria-modal="true"
          aria-label="Product image viewer"
          onClick={() => setImageViewerOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="Close image viewer"
            onClick={() => setImageViewerOpen(false)}
            className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white text-3xl text-gray-700 shadow-md hover:bg-gray-100 sm:right-6 sm:top-6"
          >
            ×
          </button>

          {/* Previous image */}
          {productImages.length > 1 && (
            <button
              type="button"
              aria-label="Previous image"
              onClick={(event) => {
                event.stopPropagation();
                showPreviousImage();
              }}
              className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-3xl text-gray-700 shadow-md hover:bg-gray-100 sm:left-8"
            >
              ‹
            </button>
          )}

          {/* Full-size image */}
          <div
            className="flex h-full w-full items-center justify-center px-16 py-16 sm:px-24"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={productImages[activeImage]}
              alt={`${name}, image ${activeImage + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Next image */}
          {productImages.length > 1 && (
            <button
              type="button"
              aria-label="Next image"
              onClick={(event) => {
                event.stopPropagation();
                showNextImage();
              }}
              className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-3xl text-gray-700 shadow-md hover:bg-gray-100 sm:right-8"
            >
              ›
            </button>
          )}

          {/* Image counter */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white px-5 py-2 text-sm text-gray-700 shadow">
            {activeImage + 1} / {productImages.length}
          </div>
        </div>
      )}

      {/* Size guide modal */}
      {sizeChartOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSizeChartOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-chart-title"
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto bg-white p-5 sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h2
                id="size-chart-title"
                className="text-lg uppercase tracking-widest"
              >
                Size guide
              </h2>

              <button
                type="button"
                aria-label="Close size guide"
                onClick={() => setSizeChartOpen(false)}
                className="flex h-9 w-9 items-center justify-center text-2xl hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Select an available size below. Actual garment measurements
              can be added to your product data for a detailed size chart.
            </p>

            {sizes.length > 0 ? (
              <table className="mt-6 w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-300 text-left">
                    <th className="py-3 pr-3 font-medium">Size</th>
                    <th className="py-3 pr-3 font-medium">
                      Availability
                    </th>
                    <th className="py-3 text-right font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sizes.map((size) => {
                    const soldOut = Number(size.stock) <= 0;

                    return (
                      <tr
                        key={size.size}
                        className="border-b border-gray-100"
                      >
                        <td className="py-3 pr-3">{size.size}</td>

                        <td className="py-3 pr-3">
                          {soldOut ? "Sold out" : "Available"}
                        </td>

                        <td className="py-3 text-right">
                          <button
                            type="button"
                            disabled={soldOut}
                            onClick={() => {
                              setSelectedSize(size.size);
                              setSizeChartOpen(false);
                            }}
                            className="border border-gray-300 px-3 py-2 text-xs uppercase tracking-wider hover:border-black disabled:cursor-not-allowed disabled:text-gray-300"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="mt-5 text-sm text-gray-500">
                No size information is available for this product.
              </p>
            )}

            <button
              type="button"
              onClick={() => setSizeChartOpen(false)}
              className="mt-6 w-full bg-black py-3 text-sm uppercase tracking-widest text-white hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default ProductPage;