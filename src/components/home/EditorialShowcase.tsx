import { Link } from "react-router-dom";
import Reveal from "../Reveal";
import SmartImage from "../SmartImage";

export default function EditorialShowcase() {
  return (
    <section id="editorial" className="bg-ink text-ivory">
      <div className="uxt-container py-24 md:py-36">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          {/* Left: text column */}
          <Reveal className="md:col-span-4 md:pt-4">
            <p className="eyebrow text-taupe">The UXT philosophy</p>
            <h2 className="display-md mt-5">THE ART OF LIVING WELL</h2>
            <p className="lead mt-6">
              Every detail matters. Discover furniture designed to bring
              balance, character, and quiet sophistication to your space.
            </p>
            <Link to="/about" className="link-arrow mt-8">
              Explore our design philosophy <span className="arrow">→</span>
            </Link>
          </Reveal>

          {/* Right: editorial image composition */}
          <div className="md:col-span-8">
            <Reveal className="img-frame aspect-[16/10] w-full">
              <SmartImage
                src="/images/editorial-feature.webp"
                alt="A serene luxury living room with a sculptural linen sofa, stone surfaces and soft natural window light"
                fallbackLabel="The Art of Living Well"
              />
            </Reveal>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <Reveal delay={120} className="img-frame aspect-[4/5]">
                <SmartImage
                  src="/images/editorial-2.webp"
                  alt="An elegant dining room with a solid oak table, upholstered chairs and sculptural pendant lighting"
                  fallbackLabel="Dining"
                />
              </Reveal>
              <div className="flex flex-col justify-between gap-8">
                <Reveal delay={220} className="img-frame aspect-[4/3]">
                  <SmartImage
                    src="/images/editorial-3.webp"
                    alt="A quiet reading corner with a contemporary lounge chair and stone side table in warm light"
                    fallbackLabel="Lounge"
                  />
                </Reveal>
                <Reveal delay={300}>
                  <div className="border-t border-ivory/15 pt-6">
                    <p className="eyebrow text-taupe">Considered since day one</p>
                    <p className="mt-4 font-serif text-2xl leading-snug text-ivory/90">
                      “We design furniture the way architects design rooms —
                      proportion first, decoration never.”
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
