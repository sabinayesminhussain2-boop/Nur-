import { Link } from "react-router-dom";
import { ARTICLES } from "../../data/journal";
import Reveal from "../Reveal";
import SmartImage from "../SmartImage";

export default function JournalPreview() {
  const featured = ARTICLES.slice(0, 3);
  return (
    <section className="bg-ivory text-ink">
      <div className="uxt-container py-24 md:py-32">
        <Reveal className="flex flex-col gap-6 border-b border-ink/10 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-taupe">Design journal</p>
            <h2 className="display-md mt-4">NOTES ON CONSIDERED LIVING.</h2>
          </div>
          <Link to="/journal" className="link-arrow shrink-0">
            All articles <span className="arrow">→</span>
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {featured.map((a, i) => (
            <Reveal key={a.slug} delay={i * 110}>
              <Link to={`/journal/${a.slug}`} className="group block">
                <div className="img-frame aspect-[4/3]">
                  <SmartImage
                    src={a.cover}
                    alt={a.title}
                    fallbackLabel={a.title}
                  />
                </div>
                <div className="mt-5">
                  <p className="eyebrow text-taupe">
                    {a.category} · {a.readingTime}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl leading-snug transition-opacity group-hover:opacity-75">
                    {a.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink/60">
                    {a.intro}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
