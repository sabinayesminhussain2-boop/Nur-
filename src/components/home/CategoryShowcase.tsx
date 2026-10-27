import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "../../data/catalog";
import Reveal from "../Reveal";
import SmartImage from "../SmartImage";
import { cn } from "../../lib/format";

const SPANS: Record<string, string> = {
  sofas: "md:col-span-7",
  "lounge-chairs": "md:col-span-5",
  "dining-tables": "md:col-span-4",
  "dining-chairs": "md:col-span-4",
  "coffee-tables": "md:col-span-4",
  beds: "md:col-span-5",
  storage: "md:col-span-4",
  lighting: "md:col-span-3",
};

export default function CategoryShowcase() {
  return (
    <section className="bg-ivory text-ink">
      <div className="uxt-container py-24 md:py-32">
        <Reveal className="flex flex-col gap-6 border-b border-ink/10 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-taupe">Shop by category</p>
            <h2 className="display-md mt-4">FURNITURE, CATEGORISED BY ROOM.</h2>
          </div>
          <Link to="/categories" className="link-arrow shrink-0">
            View all categories <span className="arrow">→</span>
          </Link>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {CATEGORIES.map((cat, i) => (
            <Reveal
              key={cat.id}
              delay={(i % 3) * 90}
              className={cn(SPANS[cat.id], "col-span-1")}
            >
              <Link
                to={`/shop?category=${cat.id}`}
                className="group block"
                aria-label={`Shop ${cat.name}`}
              >
                <div
                  className={cn(
                    "img-frame relative",
                    cat.wide ? "aspect-[16/9]" : "aspect-[4/3]",
                  )}
                >
                  <SmartImage
                    src={cat.image}
                    alt={`${cat.name} — ${cat.tagline}`}
                    fallbackLabel={cat.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-ivory md:p-8">
                    <h3 className="font-serif text-2xl leading-tight md:text-3xl">
                      {cat.name}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm font-light text-ivory/75">
                      {cat.tagline}
                    </p>
                    <span className="mt-4 inline-flex translate-y-2 items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      Discover <ArrowUpRight size={14} strokeWidth={1.5} />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
