import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useUi } from "../context/UiContext";
import { naturalLanguageSearch } from "../lib/assistant";
import { CATEGORIES } from "../data/catalog";
import { formatPrice } from "../lib/format";
import SmartImage from "./SmartImage";

const EXAMPLES = [
  "Compact beige sofa under $2,500",
  "Walnut storage",
  "Stone coffee table",
  "Linen dining chair",
];

export default function SearchOverlay() {
  const { searchOpen, closeSearch } = useUi();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      document.body.style.overflow = "hidden";
      const t = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => window.clearTimeout(t);
    }
    document.body.style.overflow = "";
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeSearch();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSearch]);

  const results = useMemo(
    () => (query.trim().length > 1 ? naturalLanguageSearch(query).slice(0, 6) : []),
    [query],
  );

  if (!searchOpen) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    closeSearch();
  };

  return (
    <div
      className="fixed inset-0 z-[85] flex flex-col bg-ink/97 backdrop-blur-lg"
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      <div className="uxt-container flex items-center justify-between py-5">
        <span className="eyebrow text-warmgray">Search UXT</span>
        <button
          onClick={closeSearch}
          aria-label="Close search"
          className="p-2 -mr-2"
        >
          <X size={22} strokeWidth={1.5} />
        </button>
      </div>

      <div className="uxt-container">
        <form onSubmit={submit}>
          <div className="flex items-center gap-4 border-b border-ivory/25 pb-4">
            <Search size={26} strokeWidth={1.25} className="text-warmgray" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Try “compact beige sofa under $2,500”"
              className="w-full bg-transparent font-serif text-2xl text-ivory placeholder:text-warmgray/60 focus:outline-none sm:text-4xl"
              aria-label="Search products"
            />
          </div>
        </form>

        {query.trim().length <= 1 && (
          <div className="py-8">
            <p className="eyebrow mb-4 text-warmgray">Try a natural query</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setQuery(ex)}
                  className="border border-ivory/20 px-4 py-2 text-sm text-warmgray transition-colors hover:border-accent hover:text-ivory"
                >
                  {ex}
                </button>
              ))}
            </div>
            <p className="eyebrow mb-4 mt-10 text-warmgray">Categories</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  to={`/shop?category=${c.id}`}
                  onClick={closeSearch}
                  className="link-arrow"
                >
                  {c.name} <span className="arrow">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {query.trim().length > 1 && (
          <div className="py-6">
            <p className="eyebrow mb-5 text-warmgray">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
            {results.length === 0 ? (
              <p className="text-warmgray">
                No pieces match — try a category, material or budget.
              </p>
            ) : (
              <ul className="divide-y divide-ivory/10 border-y border-ivory/10">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/product/${p.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-5 py-4 transition-opacity hover:opacity-80"
                    >
                      <div className="img-frame h-20 w-20 shrink-0">
                        <SmartImage
                          src={p.image}
                          alt={p.name}
                          fallbackLabel={p.name}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{p.name}</p>
                        <p className="text-sm text-warmgray">{p.material}</p>
                      </div>
                      <span className="text-sm tabular-nums text-warmgray">
                        {formatPrice(p.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={submit}
              className="link-arrow mt-6"
              disabled={!query.trim()}
            >
              View all matching products <span className="arrow">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
