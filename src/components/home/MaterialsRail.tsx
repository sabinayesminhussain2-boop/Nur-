import { MATERIALS } from "../../data/catalog";
import Reveal from "../Reveal";
import SmartImage from "../SmartImage";

export default function MaterialsRail() {
  return (
    <section className="bg-ink text-ivory">
      <div className="uxt-container py-24 md:py-32">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow text-taupe">Materials & craftsmanship</p>
            <h2 className="display-md mt-4">FEEL THE DIFFERENCE.</h2>
            <p className="lead mt-5">
              Materials selected for their character, texture, and ability to
              age beautifully.
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-warmgray">
            Scroll to explore →
          </p>
        </Reveal>
      </div>

      <div
        className="rail-scroll scrollbar-hide overflow-x-auto pb-6"
        role="list"
        aria-label="Materials used in UXT furniture"
      >
        <div className="uxt-container flex gap-5 md:gap-6">
          {MATERIALS.map((m, i) => (
            <figure
              key={m.name}
              role="listitem"
              className="w-[68vw] shrink-0 sm:w-[42vw] md:w-[26vw] lg:w-[21vw]"
            >
              <Reveal delay={(i % 4) * 80}>
                <div className="img-frame aspect-[4/5]">
                  <SmartImage
                    src={m.image}
                    alt={`Close-up texture of ${m.name}`}
                    fallbackLabel={m.name}
                  />
                </div>
                <figcaption className="mt-4 border-t border-ivory/15 pt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">
                    {m.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-warmgray">
                    {m.note}
                  </p>
                </figcaption>
              </Reveal>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
