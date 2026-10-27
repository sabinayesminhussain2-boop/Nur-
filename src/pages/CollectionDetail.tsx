import { Link, useParams } from "react-router-dom";
import { getCollection, productsByCollection, type CollectionId } from "../data/catalog";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import SmartImage from "../components/SmartImage";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";
import { Breadcrumbs } from "../components/PageHero";
import { useRevealGroup } from "../hooks/useReveal";
import NotFound from "./NotFound";

export default function CollectionDetail() {
  const { id } = useParams();
  const collection = id ? getCollection(id as CollectionId) : undefined;
  const gridRef = useRevealGroup<HTMLDivElement>();

  useDocumentMeta({
    title: collection?.name ?? "Collection",
    description: collection?.description ?? "UXT collection",
    path: collection ? `/collections/${collection.id}` : "/collections",
    image: collection?.image,
  });

  if (!collection) return <NotFound />;

  const products = productsByCollection(collection.id);

  return (
    <div className="bg-ivory text-ink">
      {/* Cinematic collection header */}
      <section className="relative flex min-h-[72vh] items-end overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <SmartImage
            src={collection.image}
            alt={`${collection.name} — ${collection.tagline}`}
            fallbackLabel={collection.name}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />
        </div>
        <div className="uxt-container relative z-10 pb-14 pt-36 text-ivory">
          <Breadcrumbs
            items={[
              { label: "Collections", to: "/collections" },
              { label: collection.name },
            ]}
          />
          <p className="eyebrow mt-6 text-accent">{collection.tagline}</p>
          <h1 className="display-lg mt-4">{collection.title}</h1>
        </div>
      </section>

      <section className="uxt-container py-16 md:py-24">
        <Reveal className="grid gap-8 md:grid-cols-12">
          <p className="eyebrow text-taupe md:col-span-3">The story</p>
          <p className="lead text-ink/70 md:col-span-8 md:col-start-5">
            {collection.description} The collection shares consistent
            proportions, finishes and construction details, so pieces combine
            naturally as a room — or stand alone with equal confidence.
          </p>
        </Reveal>

        <div
          ref={gridRef}
          key={collection.id}
          className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((p) => (
            <div key={p.id} className="reveal">
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="mt-16 text-center text-taupe">
            New pieces for this collection are being prepared — browse the full
            catalog in the meantime.
          </p>
        )}

        <Reveal className="mt-20 flex flex-col items-start gap-6 border-t border-ink/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/collections" className="link-arrow">
            <span className="arrow">←</span> All collections
          </Link>
          <Link to="/shop" className="btn btn-outline-dark">
            Shop all furniture
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
