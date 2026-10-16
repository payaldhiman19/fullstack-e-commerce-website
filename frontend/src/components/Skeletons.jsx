// Put this in: src/components/Skeletons.jsx

// A grey box that gently pulses (pulsing is turned off for people who prefer reduced motion)
const Bone = ({ className = "" }) => (
  <div className={`bg-gray-200 motion-safe:animate-pulse ${className}`} />
);

/* Same shape as your ProductCard, so nothing jumps when real products arrive */
export const ProductCardSkeleton = () => (
  <div aria-hidden="true">
    <Bone className="aspect-[4/5] w-full" />
    <Bone className="mt-3 h-4 w-3/4" />
    <Bone className="mt-2 h-3 w-1/4" />
    <div className="mt-3 flex items-center gap-2">
      <Bone className="h-4 w-16" />
      <Bone className="h-4 w-12" />
    </div>
  </div>
);

/* A grid of card skeletons. Pass the same grid classes your real product grid uses. */
export const ProductGridSkeleton = ({
  count = 8,
  className = "grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4",
}) => (
  <div className={className} role="status" aria-busy="true">
    <span className="sr-only">Loading products</span>
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

/* Placeholder for the whole product detail page */
export const ProductPageSkeleton = () => (
  <div
    className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-2"
    role="status"
    aria-busy="true"
  >
    <span className="sr-only">Loading product</span>

    {/* images */}
    <div className="flex gap-3" aria-hidden="true">
      <div className="hidden flex-col gap-3 md:flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-20 w-16" />
        ))}
      </div>
      <Bone className="aspect-[4/5] w-full" />
    </div>

    {/* details */}
    <div className="flex flex-col gap-4" aria-hidden="true">
      <Bone className="h-3 w-24" />
      <Bone className="h-7 w-3/4" />
      <div className="flex items-center gap-3">
        <Bone className="h-6 w-24" />
        <Bone className="h-5 w-16" />
      </div>
      <Bone className="mt-2 h-3 w-20" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Bone key={i} className="h-10 w-12" />
        ))}
      </div>
      <Bone className="mt-2 h-12 w-full" />
      <div className="mt-4 flex flex-col gap-2">
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-11/12" />
        <Bone className="h-3 w-2/3" />
      </div>
    </div>
  </div>
);