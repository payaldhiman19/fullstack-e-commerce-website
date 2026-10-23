
import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

export const priceRanges = [
  { label: "Under ₹2,000", min: 0, max: 2000 },
  { label: "₹2,000 – ₹5,000", min: 2000, max: 5000 },
  { label: "₹5,000 – ₹8,000", min: 5000, max: 8000 },
  { label: "Above ₹8,000", min: 8000, max: Infinity },
];

const discounts = [10, 20, 30, 50];

const Section = ({ title, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className="flex w-full items-center justify-between py-5 text-sm uppercase tracking-[0.25em] text-gray-600"
      >
        {title}
        <ChevronDown
          size={18}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && <div className="space-y-3 pb-4">{children}</div>}
    </div>
  );
};

const Check = ({ label, type = "checkbox", checked, onChange }) => (
  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
    <input
      type={type}
      checked={Boolean(checked)}
      onChange={onChange}
      className="h-4 w-4 accent-[#e0626a]"
    />
    {label}
  </label>
);

const normalize = (value) =>
  String(value ?? "").trim().toLowerCase();

// Remove duplicates regardless of capitalization
const uniqueOptions = (values = []) => {
  const seen = new Set();

  return values.filter((value) => {
    const normalized = normalize(value);

    if (!normalized || seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);
    return true;
  });
};

const FilterSidebar = ({ filters, setFilters, options }) => {
  const toggle = (key, value) => {
    setFilters((previous) => {
      const current = previous[key] || [];

      const exists = current.some(
        (item) => normalize(item) === normalize(value)
      );

      return {
        ...previous,
        [key]: exists
          ? current.filter(
              (item) => normalize(item) !== normalize(value)
            )
          : [...current, value],
      };
    });
  };

  // Render each filter section with unique options
  const listSection = (title, key, values = []) => {
    const uniqueValues = uniqueOptions(values);

    if (!uniqueValues.length) return null;

    return (
      <Section key={key} title={title}>
        {uniqueValues.map((value) => (
          <Check
            key={normalize(value)}
            label={value}
            checked={(filters[key] || []).some(
              (item) => normalize(item) === normalize(value)
            )}
            onChange={() => toggle(key, value)}
          />
        ))}
      </Section>
    );
  };

  return (
    <div>
      {/* In-stock filter */}
      <button
        type="button"
        aria-pressed={filters.inStock}
        onClick={() =>
          setFilters((previous) => ({
            ...previous,
            inStock: !previous.inStock,
          }))
        }
        className={`mb-4 flex w-full items-center justify-between px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] ${
          filters.inStock
            ? "bg-[#e0777b] text-white"
            : "border border-gray-300 text-gray-600"
        }`}
      >
        In stock
        {filters.inStock && <X size={16} />}
      </button>

      {listSection("Size", "sizes", options.sizes)}

      <Section title="Ready to ship">
        <Check
          label="Ready to ship only"
          checked={filters.readyToShip}
          onChange={() =>
            setFilters((previous) => ({
              ...previous,
              readyToShip: !previous.readyToShip,
            }))
          }
        />
      </Section>

      <Section title="Discount">
        {discounts.map((discount) => (
          <Check
            key={discount}
            type="radio"
            label={`${discount}% and above`}
            checked={filters.minDiscount === discount}
            onChange={() =>
              setFilters((previous) => ({
                ...previous,
                minDiscount:
                  previous.minDiscount === discount ? 0 : discount,
              }))
            }
          />
        ))}
      </Section>

      <Section title="Price">
        {priceRanges.map((range) => (
          <Check
            key={range.label}
            type="radio"
            label={range.label}
            checked={filters.priceRange === range.label}
            onChange={() =>
              setFilters((previous) => ({
                ...previous,
                priceRange:
                  previous.priceRange === range.label
                    ? ""
                    : range.label,
              }))
            }
          />
        ))}
      </Section>

      {listSection("Color", "colors", options.colors)}
      {listSection("Shop by category", "types", options.types)}
      {listSection("Pattern", "patterns", options.patterns)}
      {listSection("Occasion", "occasions", options.occasions)}
    </div>
  );
};

export default FilterSidebar;