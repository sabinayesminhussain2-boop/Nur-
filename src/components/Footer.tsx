import { Link } from "react-router-dom";
import Logo from "./Logo";
import { FOOTER_NAV, SOCIAL_PLACEHOLDERS } from "../data/site";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer className="border-t border-ivory/10 bg-ink text-ivory">
      <div className="uxt-container py-16 md:py-20">
        <Reveal className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-5 max-w-xs font-serif text-2xl leading-snug text-warmgray">
              Furniture for considered living.
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-warmgray">
              UXT.com creates furniture that transforms the way you experience
              space — thoughtful design, honest materials, and craftsmanship
              built to age beautifully.
            </p>
          </div>

          {FOOTER_NAV.map((col) => (
            <nav key={col.heading} className="md:col-span-2" aria-label={col.heading}>
              <h3 className="eyebrow text-taupe">{col.heading}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-warmgray transition-colors hover:text-ivory"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="md:col-span-1" />
        </Reveal>

        <Reveal className="mt-16 border-t border-ivory/10 pt-8">
          <p className="eyebrow text-taupe">Social</p>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
            {SOCIAL_PLACEHOLDERS.map((s) => (
              <li key={s.label}>
                <span
                  className="cursor-default text-sm text-warmgray"
                  title={s.handle}
                >
                  {s.label}
                  <span className="ml-2 text-xs text-taupe">
                    (not yet linked)
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-taupe">
            Working social links appear here once official profile URLs are
            provided.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-3 border-t border-ivory/10 pt-8 text-xs text-taupe sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} UXT.com — All rights reserved.</p>
          <p>
            Demonstration storefront · sample inventory and pricing · no
            payments processed
          </p>
        </div>
      </div>
    </footer>
  );
}
