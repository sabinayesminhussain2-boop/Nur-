import { Link } from "react-router-dom";
import PageHero, { Breadcrumbs } from "../components/PageHero";
import Reveal from "../components/Reveal";
import SmartImage from "../components/SmartImage";
import Newsletter from "../components/Newsletter";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { MATERIALS } from "../data/catalog";

const PRINCIPLES = [
  {
    no: "01",
    title: "CONSIDERED DESIGN",
    body: "Every line, material, and proportion serves a purpose. We begin each piece with the room it will live in and subtract until only the essential remains.",
  },
  {
    no: "02",
    title: "HONEST MATERIALS",
    body: "Natural textures and carefully selected finishes define each piece. We specify solid wood, stone, linen, bouclé and brushed metal for the way they age, not the way they photograph.",
  },
  {
    no: "03",
    title: "MADE TO LAST",
    body: "Furniture designed for everyday living and long-term appreciation — repairable constructions, replaceable components and finishes that improve with use.",
  },
];

const PROCESS = [
  {
    step: "I",
    title: "Proportion",
    body: "Every UXT piece begins as a scale drawing tested against real room dimensions and the ergonomics of daily use.",
  },
  {
    step: "II",
    title: "Material",
    body: "Finishes are chosen for character and longevity — open-grain oak, honed travertine, looped bouclé and muted brushed metals.",
  },
  {
    step: "III",
    title: "Craft",
    body: "Specialist workshops translate the drawings using traditional joinery alongside precision-made, repeatable components.",
  },
  {
    step: "IV",
    title: "Restraint",
    body: "A piece enters the catalog only when nothing more can be removed without losing its function or its presence.",
  },
];

export default function About() {
  useDocumentMeta({
    title: "About UXT",
    description:
      "UXT designs furniture that transforms the way you experience space — considered design, honest materials and craftsmanship built to last.",
    path: "/about",
  });

  return (
    <>
      <PageHero
        eyebrow="The house of UXT"
        title="FURNITURE THAT TRANSFORMS THE WAY YOU EXPERIENCE SPACE."
        description="UXT is a furniture house working at the intersection of architecture and craft. We design quiet, architectural pieces for the rooms where life happens."
      >
        <Breadcrumbs dark items={[{ label: "About" }]} />
      </PageHero>

      {/* Manifesto image + text */}
      <section className="bg-ivory text-ink">
        <div className="uxt-container grid gap-12 pb-24 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-7">
            <div className="img-frame aspect-[16/11]">
              <SmartImage
                src="/images/editorial-feature.webp"
                alt="A serene UXT living room composed of sculptural furniture in warm neutral tones"
                fallbackLabel="The UXT philosophy"
              />
            </div>
          </Reveal>
          <Reveal delay={150} className="md:col-span-5 md:pt-10">
            <p className="eyebrow text-taupe">Our philosophy</p>
            <h2 className="display-md mt-4">LESS, BUT BETTER.</h2>
            <p className="mt-6 leading-relaxed text-ink/70">
              At UXT, we believe exceptional furniture begins with thoughtful
              design. We focus on proportion, material, comfort, and
              craftsmanship to create pieces that feel natural in the spaces
              where life happens.
            </p>
            <p className="mt-4 leading-relaxed text-ink/70">
              Our work is deliberately quiet. Rather than follow seasonal
              trends, we develop a small catalog of enduring pieces — each one
              designed to combine with the others, and each built to be kept,
              repaired and appreciated for years rather than replaced.
            </p>
          </Reveal>
        </div>

        {/* Principles */}
        <div className="uxt-container pb-24">
          <div className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal
                key={p.no}
                delay={i * 110}
                className="bg-ivory p-8 md:p-10"
              >
                <span className="font-serif text-3xl text-taupe">{p.no}</span>
                <h3 className="mt-5 text-sm font-semibold uppercase tracking-[0.22em]">
                  {p.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ink/65">
                  {p.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="uxt-container pb-28">
          <Reveal>
            <p className="eyebrow text-taupe">How a piece is made</p>
            <h2 className="display-md mt-4 max-w-2xl">FROM DRAWING TO THE ROOM.</h2>
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p, i) => (
              <Reveal key={p.step} delay={i * 100}>
                <div className="border-t border-ink/15 pt-6">
                  <span className="font-serif text-2xl italic text-taupe">
                    {p.step}
                  </span>
                  <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.2em]">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Materials strip */}
      <section className="bg-coal text-ivory">
        <div className="uxt-container py-20 md:py-24">
          <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-taupe">The palette</p>
              <h2 className="display-md mt-3">HONEST MATERIALS, OPENLY SPECIFIED.</h2>
            </div>
            <Link to="/shop" className="link-arrow shrink-0">
              See them in the catalog <span className="arrow">→</span>
            </Link>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {MATERIALS.slice(0, 4).map((m, i) => (
              <Reveal key={m.name} delay={i * 90}>
                <div className="img-frame aspect-square">
                  <SmartImage
                    src={m.image}
                    alt={`${m.name} texture`}
                    fallbackLabel={m.name}
                  />
                </div>
                <p className="mt-3 text-sm font-medium">{m.name}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Newsletter dark={false} />
    </>
  );
}
