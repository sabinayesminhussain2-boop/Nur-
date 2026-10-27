import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ARTICLES } from "../data/journal";
import PageHero, { Breadcrumbs } from "../components/PageHero";
import Reveal from "../components/Reveal";
import SmartImage from "../components/SmartImage";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { cn } from "../lib/format";

export default function Journal() {
  const [category, setCategory] = useState<string>("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(ARTICLES.map((a) => a.category)))],
    [],
  );
  const articles =
    category === "All"
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === category);

  useDocumentMeta({
    title: "Design Journal",
    description:
      "The UXT design journal — guides on timeless interiors, choosing furniture, understanding materials and composing balanced rooms.",
    path: "/journal",
  });

  const [lead, ...rest] = articles;

  return (
    <>
      <PageHero
        eyebrow="The UXT journal"
        title="Design Journal"
        description="Practical, opinionated writing on interiors, materials and the discipline of choosing furniture that lasts."
      >
        <Breadcrumbs dark items={[{ label: "Journal" }]} />
      </PageHero>

      <section className="bg-ivory text-ink">
        <div className="uxt-container pb-24">
          <div className="flex flex-wrap gap-2 border-b border-ink/10 pb-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={cn(
                  "border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors",
                  category === c
                    ? "border-ink bg-ink text-ivory"
                    : "border-ink/20 text-taupe hover:border-ink hover:text-ink",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {lead && (
            <Reveal className="pt-12">
              <Link
                to={`/journal/${lead.slug}`}
                className="group grid gap-8 md:grid-cols-12 md:gap-12"
              >
                <div className="img-frame aspect-[16/10] md:col-span-7">
                  <SmartImage
                    src={lead.cover}
                    alt={lead.title}
                    fallbackLabel={lead.title}
                  />
                </div>
                <div className="flex flex-col justify-center md:col-span-5">
                  <p className="eyebrow text-taupe">
                    {lead.category} · {lead.readingTime} · {lead.date}
                  </p>
                  <h2 className="mt-4 font-serif text-3xl leading-tight transition-opacity group-hover:opacity-75 md:text-4xl">
                    {lead.title}
                  </h2>
                  <p className="mt-5 leading-relaxed text-ink/65">
                    {lead.intro}
                  </p>
                  <span className="link-arrow mt-7 self-start">
                    Read the article <span className="arrow">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
            {rest.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) * 100}>
                <Link to={`/journal/${a.slug}`} className="group block">
                  <div className="img-frame aspect-[4/3]">
                    <SmartImage
                      src={a.cover}
                      alt={a.title}
                      fallbackLabel={a.title}
                    />
                  </div>
                  <p className="eyebrow mt-5 text-taupe">
                    {a.category} · {a.readingTime}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl leading-snug transition-opacity group-hover:opacity-75">
                    {a.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink/60">
                    {a.intro}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
