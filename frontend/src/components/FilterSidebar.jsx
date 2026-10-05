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
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-sm uppercase tracking-[0.25em] text-gray-600"
      >
        {title}
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="space-y-2 pb-4">{children}</div>}
    </div>
  );
};

const Check = ({ label, type = "checkbox", checked, onChange }) => (
  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
    <input
      type={type}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 accent-[#e0626a]"
    />
    {label}
  </label>
);

const FilterSidebar = ({ filters, setFilters, options }) => {
  const toggle = (key, value) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value)
        ? f[key].filter((v) => v !== value)
        : [...f[key], value],
    }));

  const listSection = (title, key, values) => {
  if (!values.length) return null;
  return (
    <Section title={title}>
      {values.map((v) => (
        <Check
          key={v}
          label={v}
          checked={filters[key].includes(v)}
          onChange={() => toggle(key, v)}
        />
      ))}
    </Section>
  );
};

  return (
    <div>
      {/* IN STOCK chip */}
      <button
        onClick={() => setFilters((f) => ({ ...f, inStock: !f.inStock }))}
        className={`mb-4 flex w-full items-center justify-between px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] ${
          filters.inStock
            ? "bg-[#e0777b] text-white"
            : "border border-gray-300 text-gray-600"
        }`}
      >
        In stock
        {filters.inStock && <X size={16} />}
      </button>

      {options.sizes.length > 0 && listSection("Size", "sizes", options.sizes)}

      <Section title="Ready to ship">
        <Check
          label="Ready to ship only"
          checked={filters.readyToShip}
          onChange={() =>
            setFilters((f) => ({ ...f, readyToShip: !f.readyToShip }))
          }
        />
      </Section>

      <Section title="Discount">
        {discounts.map((d) => (
          <Check
            key={d}
            type="radio"
            label={`${d}% and above`}
            checked={filters.minDiscount === d}
            onChange={() => setFilters((f) => ({ ...f, minDiscount: d }))}
          />
        ))}
      </Section>

      <Section title="Price">
        {priceRanges.map((r) => (
          <Check
            key={r.label}
            type="radio"
            label={r.label}
            checked={filters.priceRange === r.label}
            onChange={() => setFilters((f) => ({ ...f, priceRange: r.label }))}
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