import { Link } from "react-router-dom";
import Reveal from "../Reveal";
import SmartImage from "../SmartImage";

const PRINCIPLES = [
  {
    no: "01",
    title: "CONSIDERED DESIGN",
    body: "Every line, material, and proportion serves a purpose.",
  },
  {
    no: "02",
    title: "HONEST MATERIALS",
    body: "Natural textures and carefully selected finishes define each piece.",
  },
  {
    no: "03",
    title: "MADE TO LAST",
    body: "Furniture designed for everyday living and long-term appreciation.",
  },
];

export default function BrandStory() {
  return (
    <section className="bg-coal text-ivory">
      <div className="uxt-container py-24 md:py-36">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-5">
            <div className="img-frame aspect-[4/5] md:sticky md:top-28">
              <SmartImage
                src="/images/brand-story.webp"
                alt="A minimal luxury interior with a single sculptural furniture piece in dramatic soft light"
                fallbackLabel="Less, but better"
              />
            </div>
          </Reveal>

          <div className="md:col-span-7">
            <Reveal>
              <p className="eyebrow text-taupe">Our philosophy</p>
              <h2 className="display-lg mt-5">LESS, BUT BETTER.</h2>
              <p className="lead mt-7">
                At UXT, we believe exceptional furniture begins with thoughtful
                design. We focus on proportion, material, comfort, and
                craftsmanship to create pieces that feel natural in the spaces
                where life happens.
              </p>
            </Reveal>

            <div className="mt-14">
              {PRINCIPLES.map((p, i) => (
                <Reveal
                  key={p.no}
                  delay={i * 110}
                  className="flex gap-7 border-t border-ivory/12 py-8 last:border-b"
                >
                  <span className="font-serif text-2xl text-accent">{p.no}</span>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.22em]">
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-md leading-relaxed text-warmgray">
                      {p.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <Link to="/about" className="link-arrow mt-10">
                More about UXT <span className="arrow">→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
