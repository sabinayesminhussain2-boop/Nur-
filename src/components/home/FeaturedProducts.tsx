import { Link } from "react-router-dom";
import { PRODUCTS } from "../../data/catalog";
import ProductCard from "../ProductCard";
import Reveal from "../Reveal";
import { useRevealGroup } from "../../hooks/useReveal";

export default function FeaturedProducts() {
  const groupRef = useRevealGroup<HTMLDivElement>();

  return (
    <section className="bg-ivory text-ink">
      <div className="uxt-container py-24 md:py-32">
        <Reveal className="flex flex-col gap-6 border-b border-ink/10 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-taupe">Featured pieces</p>
            <h2 className="display-md mt-4">THE EDIT.</h2>
          </div>
          <Link to="/shop" className="link-arrow shrink-0">
            Shop all furniture <span className="arrow">→</span>
          </Link>
        </Reveal>

        <div
          ref={groupRef}
          className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {PRODUCTS.map((p) => (
            <div key={p.id} className="reveal">
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        <Reveal className="mt-16 flex flex-col items-center gap-3 text-center">
          <p className="text-xs text-taupe">
            Illustrative demo prices — editable in the central catalog before
            launch.
          </p>
          <Link to="/shop" className="btn btn-outline-dark">
            Browse the full catalog
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
