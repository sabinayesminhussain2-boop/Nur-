import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES, productsByCategory } from "../data/catalog";
import PageHero, { Breadcrumbs } from "../components/PageHero";
import Reveal from "../components/Reveal";
import SmartImage from "../components/SmartImage";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { cn } from "../lib/format";

const LAYOUT: Record<string, string> = {
  sofas: "md:col-span-7",
  "lounge-chairs": "md:col-span-5",
  "dining-tables": "md:col-span-4",
  "dining-chairs": "md:col-span-4",
  "coffee-tables": "md:col-span-4",
  beds: "md:col-span-5",
  storage: "md:col-span-4",
  lighting: "md:col-span-3",
};

export default function Categories() {
  useDocumentMeta({
    title: "Furniture Categories",
    description:
      "Explore UXT furniture by category — sofas and sectionals, lounge chairs, dining tables and chairs, beds, coffee tables, storage and lighting.",
    path: "/categories",
  });

  return (
    <>
      <PageHero
        eyebrow="Browse the house"
        title="Furniture Categories"
        description="Eight disciplines, one design language. Each category is edited around proportion, material and the way a room is actually used."
      >
        <Breadcrumbs dark items={[{ label: "Categories" }]} />
      </PageHero>

      <section className="bg-ivory text-ink">
        <div className="uxt-container pb-24">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {CATEGORIES.map((cat, i) => {
              const count = productsByCategory(cat.id).length;
              return (
                <Reveal
                  key={cat.id}
                  delay={(i % 3) * 90}
                  className={cn("col-span-1", LAYOUT[cat.id])}
                >
                  <Link
                    to={`/shop?category=${cat.id}`}
                    className="group block"
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
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-80" />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-ivory md:p-8">
                        <div>
                          <h2 className="font-serif text-2xl leading-tight md:text-3xl">
                            {cat.name}
                          </h2>
                          <p className="mt-1 text-sm text-ivory/75">
                            {count} piece{count === 1 ? "" : "s"} · {cat.tagline}
                          </p>
                        </div>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-ivory/40 transition-all duration-500 group-hover:bg-ivory group-hover:text-ink">
                          <ArrowUpRight size={16} strokeWidth={1.5} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
