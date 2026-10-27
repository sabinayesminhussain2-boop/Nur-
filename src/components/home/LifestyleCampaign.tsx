import { Link } from "react-router-dom";
import Reveal from "../Reveal";
import SmartImage from "../SmartImage";

export default function LifestyleCampaign() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <SmartImage
          src="/images/lifestyle.webp"
          alt="A spacious contemporary living and dining interior at golden hour with sculptural furniture and architectural light"
          fallbackLabel="Make space for what matters"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent" />
      </div>

      <div className="uxt-container relative z-10 py-28">
        <Reveal className="max-w-2xl text-ivory">
          <p className="eyebrow text-accent">The campaign</p>
          <h2 className="display-lg mt-5">MAKE SPACE FOR WHAT MATTERS.</h2>
          <p className="lead mt-6 text-ivory/80">
            Discover pieces that bring comfort, clarity, and character to your
            home.
          </p>
          <Link to="/collections" className="btn btn-solid mt-10">
            View the Collection
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
