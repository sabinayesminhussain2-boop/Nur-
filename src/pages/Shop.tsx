import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, SearchX } from "lucide-react";
import {
  PRODUCTS,
  CATEGORIES,
  type Product,
} from "../data/catalog";
import ProductCard from "../components/ProductCard";
import FilterPanel, {
  DEFAULT_FILTERS,
  type ShopFilters,
} from "../components/shop/FilterPanel";
import PageHero, { Breadcrumbs } from "../components/PageHero";
import { naturalLanguageSearch } from "../lib/assistant";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useRevealGroup } from "../hooks/useReveal";

type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

const SORT_LABELS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const categoryParam = params.get("category");

  const [filters, setFilters] = useState<ShopFilters>({
    ...DEFAULT_FILTERS,
    categories: categoryParam ? [categoryParam] : [],
  });
  const [sort, setSort] = useState<SortKey>("featured");
  const [mobileFilters, setMobileFilters] = useState(false);
  const gridRef = useRevealGroup<HTMLDivElement>();

  // React to category links arriving via URL (header Living / Dining etc.)
  useEffect(() => {
    setFilters((f) => ({
      ...f,
      categories: categoryParam ? [categoryParam] : [],
    }));
  }, [categoryParam]);

  useDocumentMeta({
    title: "Shop All Furniture",
    description:
      "Browse the full UXT catalog — sofas, lounge chairs, dining tables, beds, storage and lighting, with finishes, materials and dimensions on every piece.",
    path: "/shop",
  });

  const activeCategoryName =
    filters.categories.length === 1
      ? CATEGORIES.find((c) => c.id === filters.categories[0])?.name
      : null;

  const filtered = useMemo(() => {
    let base: Product[] = PRODUCTS;

    if (query.trim()) {
      const ids = new Set(naturalLanguageSearch(query).map((p) => p.id));
      base = base.filter((p) => ids.has(p.id));
    }

    const result = base.filter((p) => {
      if (filters.categories.length && !filters.categories.includes(p.category))
        return false;
      if (p.price > filters.maxPrice) return false;
      if (
        filters.materials.length &&
        !filters.materials.some((m) => p.materials.includes(m))
      )
        return false;
      if (
        filters.colors.length &&
        !filters.colors.some((c) => p.colors.some((pc) => pc.name === c))
      )
        return false;
      if (filters.availability !== "all" && p.availability !== filters.availability)
        return false;
      return true;
    });

    switch (sort) {
      case "newest":
        return [...result].sort(
          (a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)),
        );
      case "price-asc":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...result].sort((a, b) => b.price - a.price);
      default:
        return result;
    }
  }, [filters, sort, query]);

  const activeChipCount =
    filters.categories.length +
    filters.materials.length +
    filters.colors.length +
    (filters.availability !== "all" ? 1 : 0) +
    (filters.maxPrice < DEFAULT_FILTERS.maxPrice ? 1 : 0);

  const resetAll = () => {
    setFilters(DEFAULT_FILTERS);
    setSort("featured");
    if (query || categoryParam) setParams({});
  };

  return (
    <>
      <PageHero
        eyebrow={activeCategoryName ? "Category" : "The complete catalog"}
        title={activeCategoryName ?? "Shop All Furniture"}
        description="Sculptural seating, honest wood and stone, and lighting designed to last. Every piece lists its real dimensions, materials and finishes."
      >
        <div className="mt-8">
          <Breadcrumbs
            dark
            items={[
              { label: "Shop", to: "/shop" },
              ...(activeCategoryName
                ? [{ label: activeCategoryName }]
                : []),
            ]}
          />
        </div>
      </PageHero>

      <section className="bg-ivory text-ink">
        <div className="uxt-container grid gap-12 pb-24 md:grid-cols-12 md:gap-10">
          {/* Sidebar */}
          <aside className="hidden md:col-span-3 md:block">
            <div className="sticky top-28">
              <div className="flex items-center justify-between">
                <h2 className="eyebrow">Filters</h2>
                {activeChipCount > 0 && (
                  <button
                    onClick={resetAll}
                    className="text-xs text-taupe underline underline-offset-4 hover:text-ink"
                  >
                    Clear all ({activeChipCount})
                  </button>
                )}
              </div>
              <div className="mt-8">
                <FilterPanel filters={filters} onChange={setFilters} />
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="md:col-span-9">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-5">
              <div>
                <p className="text-sm text-taupe" aria-live="polite">
                  {filtered.length} piece{filtered.length === 1 ? "" : "s"}
                  {query && (
                    <>
                      {" "}
                      for <span className="text-ink">“{query}”</span>
                    </>
                  )}
                </p>
                {query && (
                  <p className="mt-1 text-xs text-taupe">
                    Natural-language search translated into catalog filters.
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <label htmlFor="sort" className="eyebrow text-taupe">
                  Sort
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="border-b border-ink/30 bg-transparent py-1.5 text-sm focus:outline-none"
                >
                  {SORT_LABELS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <button
                  className="flex items-center gap-2 border border-ink/20 px-4 py-2 text-xs uppercase tracking-[0.18em] md:hidden"
                  onClick={() => setMobileFilters(true)}
                >
                  <SlidersHorizontal size={14} strokeWidth={1.5} /> Filters
                  {activeChipCount > 0 && ` (${activeChipCount})`}
                </button>
              </div>
            </div>

            {/* Active chips */}
            {activeChipCount > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {filters.categories.map((id) => {
                  const c = CATEGORIES.find((x) => x.id === id);
                  return (
                    <Chip
                      key={id}
                      onRemove={() =>
                        setFilters({
                          ...filters,
                          categories: filters.categories.filter((x) => x !== id),
                        })
                      }
                    >
                      {c?.name}
                    </Chip>
                  );
                })}
                {filters.materials.map((m) => (
                  <Chip
                    key={m}
                    onRemove={() =>
                      setFilters({
                        ...filters,
                        materials: filters.materials.filter((x) => x !== m),
                      })
                    }
                  >
                    {m}
                  </Chip>
                ))}
                {filters.colors.map((c) => (
                  <Chip
                    key={c}
                    onRemove={() =>
                      setFilters({
                        ...filters,
                        colors: filters.colors.filter((x) => x !== c),
                      })
                    }
                  >
                    {c}
                  </Chip>
                ))}
                {filters.maxPrice < DEFAULT_FILTERS.maxPrice && (
                  <Chip
                    onRemove={() =>
                      setFilters({ ...filters, maxPrice: DEFAULT_FILTERS.maxPrice })
                    }
                  >
                    Under ${filters.maxPrice.toLocaleString()}
                  </Chip>
                )}
                {filters.availability !== "all" && (
                  <Chip
                    onRemove={() =>
                      setFilters({ ...filters, availability: "all" })
                    }
                  >
                    {filters.availability === "in-stock"
                      ? "In stock"
                      : "Made to order"}
                  </Chip>
                )}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-5 py-28 text-center">
                <SearchX size={36} strokeWidth={1.25} className="text-taupe" />
                <h2 className="font-serif text-3xl">No pieces match those filters.</h2>
                <p className="max-w-sm text-sm text-taupe">
                  Try widening the price range or removing a material or colour
                  filter.
                </p>
                <button onClick={resetAll} className="btn btn-outline-dark">
                  Reset filters
                </button>
              </div>
            ) : (
              <div
                ref={gridRef}
                className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map((p) => (
                  <div key={p.id} className="reveal">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            )}

            <p className="mt-14 border-t border-ink/10 pt-6 text-xs leading-relaxed text-taupe">
              Sample inventory: availability labels and lead times are
              illustrative for this prototype and are not connected to a live
              inventory or fulfilment system. Prices are demo prices.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-[85] md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-ink/60"
            onClick={() => setMobileFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto bg-ivory p-6">
            <div className="flex items-center justify-between">
              <h2 className="eyebrow">Filters</h2>
              <button
                onClick={() => setMobileFilters(false)}
                aria-label="Close filters"
                className="p-2 -mr-2"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            <div className="mt-8">
              <FilterPanel filters={filters} onChange={setFilters} />
            </div>
            <button
              className="btn btn-dark mt-10 w-full"
              onClick={() => setMobileFilters(false)}
            >
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Chip({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-2 border border-ink/20 px-3 py-1.5 text-xs uppercase tracking-[0.12em]">
      {children}
      <button
        onClick={onRemove}
        aria-label={`Remove filter ${children}`}
        className="text-taupe hover:text-ink"
      >
        <X size={12} strokeWidth={2} />
      </button>
    </span>
  );
}
