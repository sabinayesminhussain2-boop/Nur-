import { Link } from "react-router-dom";
import { COLLECTIONS } from "../../data/catalog";
import Reveal from "../Reveal";
import SmartImage from "../SmartImage";
import { cn } from "../../lib/format";

export default function CollectionsShowcase() {
  return (
    <section className="bg-ink text-ivory">
      <div className="uxt-container py-24 md:py-32">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-taupe">Featured collections</p>
          <h2 className="display-md mt-4">FOUR STORIES IN MATERIAL AND FORM.</h2>
        </Reveal>

        <div className="mt-16 flex flex-col gap-20 md:gap-28">
          {COLLECTIONS.map((coll, i) => (
            <Reveal key={coll.id}>
              <Link
                to={`/collections/${coll.id}`}
                className="group grid items-center gap-8 md:grid-cols-12 md:gap-12"
              >
                <div
                  className={cn(
                    "img-frame aspect-[16/11] md:col-span-7",
                    i % 2 === 1 && "md:order-2",
                  )}
                >
                  <SmartImage
                    src={coll.image}
                    alt={`${coll.name} — ${coll.tagline}`}
                    fallbackLabel={coll.name}
                  />
                </div>
                <div className="md:col-span-5">
                  <p className="eyebrow text-taupe">0{i + 1} — Collection</p>
                  <h3 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">
                    {coll.title}
                  </h3>
                  <p className="mt-3 text-sm uppercase tracking-[0.18em] text-accent">
                    {coll.tagline}
                  </p>
                  <p className="mt-5 leading-relaxed text-warmgray">
                    {coll.description}
                  </p>
                  <span className="link-arrow mt-7">
                    Explore the collection <span className="arrow">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
