import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Ruler, Search, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  PRODUCTS,
  STYLE_PROFILES,
  type StyleId,
} from "../data/catalog";
import {
  recommendByStyles,
  planRoom,
  naturalLanguageSearch,
} from "../lib/assistant";
import PageHero, { Breadcrumbs } from "../components/PageHero";
import Reveal from "../components/Reveal";
import SmartImage from "../components/SmartImage";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { formatPrice, cn } from "../lib/format";

export default function Studio() {
  useDocumentMeta({
    title: "Design Studio",
    description:
      "On-site interior design tools: style discovery, dimension-based room planning and natural-language product search across the real UXT catalog.",
    path: "/studio",
  });

  return (
    <>
      <PageHero
        eyebrow="Guided design tools"
        title="The Design Studio"
        description="Three practical tools that read the real UXT catalog — its dimensions, materials, colours and style tags — to help you choose with confidence."
      >
        <Breadcrumbs dark items={[{ label: "Design Studio" }]} />
      </PageHero>

      {/* Honest status */}
      <section className="bg-ivory text-ink">
        <div className="uxt-container pb-4">
          <Reveal className="flex flex-col gap-4 border border-ink/15 bg-mist/60 p-6 md:flex-row md:items-start md:gap-6 md:p-8">
            <Info size={22} strokeWidth={1.5} className="mt-0.5 shrink-0 text-taupe" />
            <div className="text-sm leading-relaxed text-ink/75">
              <p className="font-semibold text-ink">
                How these tools work — and what remains to be connected
              </p>
              <p className="mt-2">
                Every tool below runs entirely in your browser against the live
                product catalog using deterministic rules: style matching,
                dimension clearance checks and query parsing. No external AI
                model is connected and no API keys exist in the frontend. To
                add generative AI, connect a backend endpoint (for example an
                LLM service) that returns the same product IDs; the UI here is
                built to accept those responses unchanged.
              </p>
            </div>
          </Reveal>
        </div>

        <StyleDiscovery />
        <RoomPlanner />
        <NaturalSearch />
      </section>
    </>
  );
}

/* ------------------------- B. Style discovery ------------------------- */

function StyleDiscovery() {
  const [selected, setSelected] = useState<StyleId[]>(["minimalist"]);

  const toggle = (id: StyleId) =>
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id],
    );

  const ranked = useMemo(() => recommendByStyles(selected), [selected]);

  return (
    <section className="uxt-container py-16 md:py-20">
      <Reveal>
        <p className="flex items-center gap-2 eyebrow text-taupe">
          <Sparkles size={14} strokeWidth={1.5} /> 01 — Room style discovery
        </p>
        <h2 className="display-md mt-4 text-ink">WHAT FEELS LIKE HOME?</h2>
        <p className="mt-4 max-w-xl text-sm text-ink/60">
          Choose one or more interior styles. Pieces are ranked by how many of
          your chosen styles they are designed for.
        </p>
      </Reveal>

      <Reveal delay={120} className="mt-8 flex flex-wrap gap-3">
        {STYLE_PROFILES.map((s) => {
          const active = selected.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              aria-pressed={active}
              title={s.description}
              className={cn(
                "border px-5 py-3 text-left transition-colors",
                active
                  ? "border-ink bg-ink text-ivory"
                  : "border-ink/20 text-ink/75 hover:border-ink",
              )}
            >
              <span className="block text-sm font-semibold">{s.name}</span>
              <span
                className={cn(
                  "mt-1 block max-w-[220px] text-xs",
                  active ? "text-ivory/70" : "text-taupe",
                )}
              >
                {s.description}
              </span>
            </button>
          );
        })}
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ranked.slice(0, 4).map((p, i) => {
          const matches = p.styles.filter((s) => selected.includes(s)).length;
          return (
            <Reveal key={p.id} delay={i * 80}>
              <Link
                to={`/product/${p.slug}`}
                className="group block border border-ink/10 bg-ivory"
              >
                <div className="img-frame aspect-[4/5]">
                  <SmartImage
                    src={p.image}
                    alt={p.name}
                    fallbackLabel={p.name}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-medium leading-snug">
                      {p.name}
                    </h3>
                    <span className="shrink-0 text-xs tabular-nums text-taupe">
                      {formatPrice(p.price)}
                    </span>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-taupe">
                    <CheckCircle2 size={13} strokeWidth={1.75} />
                    {matches} of {selected.length} style
                    {selected.length > 1 ? "s" : ""} matched
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------- C. Room planner ------------------------- */

function RoomPlanner() {
  const [width, setWidth] = useState(420);
  const [depth, setDepth] = useState(520);
  const [style, setStyle] = useState<StyleId>("minimalist");
  const [submitted, setSubmitted] = useState<{ w: number; d: number; s: StyleId } | null>(
    null,
  );

  const plan = useMemo(
    () =>
      submitted
        ? planRoom({
            width: submitted.w,
            depth: submitted.d,
            styles: [submitted.s],
          })
        : null,
    [submitted],
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted({ w: width, d: depth, s: style });
  };

  return (
    <section className="bg-mist/50">
      <div className="uxt-container py-16 md:py-20">
        <Reveal>
          <p className="flex items-center gap-2 eyebrow text-taupe">
            <Ruler size={14} strokeWidth={1.5} /> 02 — Room planning assistant
          </p>
          <h2 className="display-md mt-4 text-ink">WILL IT FIT, AND HOW?</h2>
          <p className="mt-4 max-w-xl text-sm text-ink/60">
            Enter room dimensions in centimetres. Each suggestion is checked
            against the product's real measurements with a 75 cm circulation
            allowance.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <form
            onSubmit={submit}
            className="mt-8 grid gap-6 border border-ink/10 bg-ivory p-6 md:grid-cols-4 md:p-8"
          >
            <label className="text-sm">
              <span className="eyebrow text-taupe">Room width (cm)</span>
              <input
                type="number"
                min={150}
                max={1500}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="field mt-2"
                aria-label="Room width in centimetres"
              />
            </label>
            <label className="text-sm">
              <span className="eyebrow text-taupe">Room depth (cm)</span>
              <input
                type="number"
                min={150}
                max={1500}
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="field mt-2"
                aria-label="Room depth in centimetres"
              />
            </label>
            <label className="text-sm">
              <span className="eyebrow text-taupe">Preferred style</span>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as StyleId)}
                className="field mt-2 bg-transparent"
                aria-label="Preferred interior style"
              >
                {STYLE_PROFILES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="btn btn-dark self-end">
              Generate layout guidance
            </button>
          </form>
        </Reveal>

        {plan && (
          <div className="mt-10">
            <Reveal className="flex items-start gap-3 text-sm text-ink/70">
              <AlertTriangle size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-taupe" />
              <p>
                Conceptual planning guidance based on catalog measurements — not
                a scaled rendering or a guaranteed room layout. Always confirm
                doorways, stairs and on-site measurements before ordering.
              </p>
            </Reveal>
            <p className="mt-4 font-serif text-2xl text-ink">{plan.summary}</p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {plan.items.map((item) => (
                <Link
                  key={item.product.id}
                  to={`/product/${item.product.slug}`}
                  className="group flex flex-col border border-ink/10 bg-ivory p-5 transition-colors hover:border-ink"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium leading-snug">
                      {item.product.name}
                    </h3>
                    <span
                      className={cn(
                        "shrink-0 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                        item.fit === "fits" &&
                          "bg-ink text-ivory",
                        item.fit === "tight" &&
                          "bg-accent/60 text-ink",
                        item.fit === "does-not-fit" &&
                          "bg-ink/15 text-taupe line-through decoration-1",
                      )}
                    >
                      {item.fit === "does-not-fit" ? "Too large" : item.fit}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-taupe">
                    {item.note}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------- D. Natural-language search ------------------------- */

function NaturalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof PRODUCTS>([]);
  const [searched, setSearched] = useState(false);

  const run = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setResults(naturalLanguageSearch(query));
    setSearched(true);
  };

  return (
    <section className="uxt-container py-16 md:py-24">
      <Reveal>
        <p className="flex items-center gap-2 eyebrow text-taupe">
          <Search size={14} strokeWidth={1.5} /> 03 — Natural-language product search
        </p>
        <h2 className="display-md mt-4 text-ink">SAY IT THE WAY YOU WOULD.</h2>
        <p className="mt-4 max-w-xl text-sm text-ink/60">
          Your sentence is parsed into catalog filters — category, budget,
          colour, material and room size. Try “show me a compact beige sofa
          under $2,500”.
        </p>
      </Reveal>

      <Reveal delay={120}>
        <form onSubmit={run} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Show me a compact beige sofa under $2,500"
            className="field flex-1 border border-ink/20 bg-ivory px-4 py-4"
            aria-label="Describe the furniture you are looking for"
          />
          <button type="submit" className="btn btn-dark">
            Search catalog
          </button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "Walnut storage piece",
            "Stone coffee table",
            "Linen dining chair under $500",
            "Lighting for an industrial loft",
          ].map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                setQuery(ex);
                setResults(naturalLanguageSearch(ex));
                setSearched(true);
              }}
              className="border border-ink/20 px-3 py-1.5 text-xs text-taupe transition-colors hover:border-ink hover:text-ink"
            >
              {ex}
            </button>
          ))}
        </div>
      </Reveal>

      {searched && (
        <div className="mt-10">
          <p className="text-sm text-taupe">
            {results.length} result{results.length === 1 ? "" : "s"} for “
            {query}”
          </p>
          {results.length === 0 ? (
            <p className="mt-4 max-w-lg text-sm text-ink/65">
              Nothing matched every term. Try broadening the budget or removing
              a colour or material — or browse the full catalog.
            </p>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug}`}
                  className="group block border border-ink/10 bg-ivory"
                >
                  <div className="img-frame aspect-[4/5]">
                    <SmartImage
                      src={p.image}
                      alt={p.name}
                      fallbackLabel={p.name}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 p-4">
                    <h3 className="text-sm font-medium leading-snug">
                      {p.name}
                    </h3>
                    <span className="shrink-0 text-xs tabular-nums text-taupe">
                      {formatPrice(p.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
