import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export function Breadcrumbs({
  items,
  dark = false,
}: {
  items: { label: string; to?: string }[];
  dark?: boolean;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-xs uppercase tracking-[0.18em] ${
        dark ? "text-warmgray" : "text-taupe"
      }`}
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="transition-opacity hover:opacity-70">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {item.to && i < items.length - 1 ? (
              <Link to={item.to} className="transition-opacity hover:opacity-70">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="opacity-80">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-ivory pt-32 text-ink md:pt-40">
      <div className="uxt-container pb-14 md:pb-20">
        <p className="eyebrow text-taupe">{eyebrow}</p>
        <h1 className="display-lg mt-4 max-w-3xl">{title}</h1>
        {description && (
          <p className="lead mt-6 max-w-xl text-ink/60">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
