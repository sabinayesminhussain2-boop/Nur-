import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import SmartImage from "../SmartImage";

export default function Hero() {
  return (
    <section className="relative flex h-[100svh] min-h-[640px] items-end overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <SmartImage
          src="/images/hero.webp"
          alt="A sculptural ivory bouclé sofa in a dark contemporary living room with architectural lighting and warm oak surfaces"
          fallbackLabel="UXT — Designed for the way you live"
          loading="eager"
          fetchPriority="high"
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
      </div>

      <div className="uxt-container relative z-10 pb-16 pt-32 md:pb-24">
        <p className="eyebrow hero-fade text-accent">
          Furniture that transforms the way you experience space
        </p>
        <h1 className="display-xl hero-fade-delay-1 mt-6 max-w-4xl text-ivory">
          DESIGNED FOR
          <br />
          THE WAY YOU LIVE.
        </h1>
        <p className="hero-fade-delay-2 mt-7 max-w-md text-base font-light leading-relaxed text-ivory/80 md:text-lg">
          Thoughtful furniture. Exceptional materials. Spaces that feel like
          home.
        </p>
        <div className="hero-fade-delay-3 mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link to="/collections" className="btn btn-solid">
            Explore Collections
          </Link>
          <Link to="/about" className="btn btn-outline-light">
            Discover Our Philosophy
          </Link>
        </div>
      </div>

      <a
        href="#editorial"
        aria-label="Scroll to content"
        className="absolute bottom-7 right-6 z-10 hidden flex-col items-center gap-3 text-ivory/70 md:flex"
      >
        <span className="eyebrow [writing-mode:vertical-rl]">Scroll</span>
        <span className="relative flex h-10 w-px justify-center bg-ivory/25">
          <span className="scroll-dot absolute top-0 h-3 w-px bg-ivory" />
        </span>
        <ArrowDown size={13} strokeWidth={1.5} />
      </a>
    </section>
  );
}
