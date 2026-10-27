import { ALL_COLORS, ALL_MATERIALS, CATEGORIES, PRICE_BOUNDS } from "../../data/catalog";
import { cn } from "../../lib/format";

export interface ShopFilters {
  categories: string[];
  maxPrice: number;
  materials: string[];
  colors: string[];
  availability: "all" | "in-stock" | "made-to-order";
}

export const DEFAULT_FILTERS: ShopFilters = {
  categories: [],
  maxPrice: PRICE_BOUNDS[1],
  materials: [],
  colors: [],
  availability: "all",
};

function toggle(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export default function FilterPanel({
  filters,
  onChange,
}: {
  filters: ShopFilters;
  onChange: (next: ShopFilters) => void;
}) {
  const set = (patch: Partial<ShopFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col gap-10">
      <fieldset>
        <legend className="eyebrow text-taupe">Category</legend>
        <ul className="mt-4 space-y-2.5">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(c.id)}
                  onChange={() =>
                    set({ categories: toggle(filters.categories, c.id) })
                  }
                  className="h-4 w-4 accent-[#171615]"
                />
                <span className="text-ink/80">{c.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="eyebrow text-taupe">
          Max price — ${filters.maxPrice.toLocaleString()}
        </legend>
        <input
          type="range"
          min={PRICE_BOUNDS[0]}
          max={PRICE_BOUNDS[1]}
          step={50}
          value={filters.maxPrice}
          onChange={(e) => set({ maxPrice: Number(e.target.value) })}
          className="mt-5 w-full accent-[#171615]"
          aria-label="Maximum price"
        />
        <div className="mt-2 flex justify-between text-xs text-taupe">
          <span>${PRICE_BOUNDS[0]}</span>
          <span>${PRICE_BOUNDS[1].toLocaleString()}</span>
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow text-taupe">Material</legend>
        <ul className="mt-4 space-y-2.5">
          {ALL_MATERIALS.map((m) => (
            <li key={m}>
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={filters.materials.includes(m)}
                  onChange={() => set({ materials: toggle(filters.materials, m) })}
                  className="h-4 w-4 accent-[#171615]"
                />
                <span className="text-ink/80">{m}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="eyebrow text-taupe">Colour</legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {ALL_COLORS.map((c) => {
            const active = filters.colors.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                title={c.name}
                aria-pressed={active}
                aria-label={c.name}
                onClick={() => set({ colors: toggle(filters.colors, c.name) })}
                className={cn(
                  "h-8 w-8 rounded-full border border-ink/15 ring-1 ring-inset ring-white/30 transition-all",
                  active && "ring-2 ring-ink ring-offset-2 ring-offset-ivory",
                )}
                style={{ backgroundColor: c.hex }}
              />
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow text-taupe">Availability</legend>
        <div className="mt-4 flex flex-col gap-2.5 text-sm">
          {(
            [
              ["all", "All pieces"],
              ["in-stock", "In stock (demo)"],
              ["made-to-order", "Made to order (demo)"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="availability"
                checked={filters.availability === value}
                onChange={() => set({ availability: value })}
                className="h-4 w-4 accent-[#171615]"
              />
              <span className="text-ink/80">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
