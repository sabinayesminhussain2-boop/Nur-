import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { COLLECTIONS, productsByCollection } from "../data/catalog";
import Reveal from "../components/Reveal";
import SmartImage from "../components/SmartImage";
import { Breadcrumbs } from "../components/PageHero";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export default function Collections() {
  useDocumentMeta({
    title: "Collections",
    description:
      "The Forma, Atelier, Still and Elements collections — four design stories in material, proportion and form.",
    path: "/collections",
  });

  return (
    <div className="bg-ink text-ivory">
      <section className="uxt-container pt-36 md:pt-44">
        <Breadcrumbs items={[{ label: "Collections" }]} />
        <div className="mt-8 max-w-3xl">
          <p className="eyebrow text-taupe">The collections</p>
          <h1 className="display-lg mt-4">FOUR WAYS OF THINKING ABOUT A ROOM.</h1>
          <p className="lead mt-6">
            Each UXT collection approaches the home from a different principle —
            sculptural form, workshop craft, calm restraint, or the raw
            character of material.
          </p>
        </div>
      </section>

      <section className="uxt-container py-16 md:py-24">
        <div className="flex flex-col gap-24 md:gap-32">
          {COLLECTIONS.map((coll, i) => (
            <Reveal key={coll.id}>
              <Link
                to={`/collections/${coll.id}`}
                className="group grid gap-8 md:grid-cols-12 md:gap-12"
              >
                <div
                  className={`img-frame aspect-[16/10] md:col-span-8 ${
                    i % 2 === 1 ? "md:order-2" : ""
                  }`}
                >
                  <SmartImage
                    src={coll.image}
                    alt={`${coll.name} — ${coll.tagline}`}
                    fallbackLabel={coll.name}
                  />
                </div>
                <div className="flex flex-col justify-center md:col-span-4">
                  <span className="eyebrow text-taupe">
                    0{i + 1} — {productsByCollection(coll.id).length} pieces
                  </span>
                  <h2 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">
                    {coll.title}
                  </h2>
                  <p className="mt-3 text-sm uppercase tracking-[0.16em] text-accent">
                    {coll.tagline}
                  </p>
                  <p className="mt-5 leading-relaxed text-warmgray">
                    {coll.description}
                  </p>
                  <span className="link-arrow mt-7 self-start">
                    Enter collection <span className="arrow">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-24 border-t border-ivory/10 pt-12">
          <Link to="/shop" className="group flex items-center justify-between gap-6">
            <span className="font-serif text-2xl text-warmgray transition-colors group-hover:text-ivory md:text-4xl">
              Browse every piece across all collections
            </span>
            <ArrowRight
              size={28}
              strokeWidth={1.25}
              className="shrink-0 transition-transform duration-500 group-hover:translate-x-2"
            />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
