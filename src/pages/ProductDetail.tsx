import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, Truck, RotateCcw, ShieldQuestion, Check } from "lucide-react";
import { getProduct, PRODUCTS } from "../data/catalog";
import { useShop } from "../context/ShopContext";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { formatPrice, cn } from "../lib/format";
import ProductGallery from "../components/shop/ProductGallery";
import QuantityStepper from "../components/QuantityStepper";
import Accordion from "../components/Accordion";
import ProductCard from "../components/ProductCard";
import { Breadcrumbs } from "../components/PageHero";
import Reveal from "../components/Reveal";
import NotFound from "./NotFound";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = slug ? getProduct(slug) : undefined;
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const [color, setColor] = useState(product?.colors[0].name ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Reset selections when navigating between products on the same route.
  useEffect(() => {
    setColor(product?.colors[0].name ?? "");
    setQty(1);
    setAdded(false);
    window.scrollTo({ top: 0 });
  }, [slug, product]);

  const related = useMemo(() => {
    if (!product) return [];
    const sameCollection = PRODUCTS.filter(
      (p) => p.collection === product.collection && p.id !== product.id,
    );
    const sameCategory = PRODUCTS.filter(
      (p) => p.category === product.category && p.id !== product.id,
    );
    const rest = PRODUCTS.filter(
      (p) =>
        p.id !== product.id &&
        !sameCollection.includes(p) &&
        !sameCategory.includes(p),
    );
    return [...sameCollection, ...sameCategory, ...rest].slice(0, 4);
  }, [product]);

  const jsonLd = useMemo(() => {
    if (!product) return undefined;
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.shortDescription,
      sku: product.id.toUpperCase(),
      brand: { "@type": "Brand", name: "UXT" },
      image: [
        `https://uxt.com${product.image}`,
        `https://uxt.com${product.altImage}`,
      ],
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: product.price,
        url: `https://uxt.com/product/${product.slug}`,
      },
    };
  }, [product]);

  useDocumentMeta({
    title: product ? product.name : "Product not found",
    description: product?.shortDescription ?? "Product not found",
    path: product ? `/product/${product.slug}` : "/product",
    image: product?.image,
    jsonLd,
  });

  if (!product) return <NotFound />;

  const wished = isWishlisted(product.id);

  const handleAdd = () => {
    addToCart(product.id, color, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="bg-ivory text-ink">
      <div className="uxt-container pt-28 md:pt-36">
        <Breadcrumbs
          dark
          items={[
            { label: "Shop", to: "/shop" },
            { label: product.name },
          ]}
        />
      </div>

      <section className="uxt-container grid gap-12 py-10 md:grid-cols-12 md:gap-14 md:py-14">
        {/* Gallery */}
        <div className="md:col-span-7">
          <ProductGallery product={product} />
        </div>

        {/* Info */}
        <div className="md:col-span-5">
          <p className="eyebrow text-taupe">
            {product.availability === "in-stock"
              ? "Sample inventory · in stock"
              : "Sample inventory · made to order"}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl tabular-nums text-ink/80">
            {formatPrice(product.price)}
          </p>
          <p className="mt-6 leading-relaxed text-ink/70">
            {product.description}
          </p>

          <div className="mt-8 border-t border-ink/10 pt-7">
            <p className="eyebrow text-taupe">
              Finish — <span className="text-ink">{color}</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-3" role="radiogroup" aria-label="Colour finish">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  role="radio"
                  aria-checked={color === c.name}
                  aria-label={c.name}
                  onClick={() => setColor(c.name)}
                  className={cn(
                    "h-9 w-9 rounded-full border border-ink/15 ring-1 ring-inset ring-white/30 transition-all",
                    color === c.name && "ring-2 ring-ink ring-offset-2 ring-offset-ivory",
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuantityStepper qty={qty} onChange={setQty} />
            <button
              onClick={handleAdd}
              className="btn btn-dark flex-1 sm:flex-none"
            >
              {added ? (
                <>
                  <Check size={15} strokeWidth={2} /> Added
                </>
              ) : (
                "Add to cart"
              )}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={wished}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              className="flex h-[52px] w-[52px] items-center justify-center border border-ink/25 transition-colors hover:border-ink"
            >
              <Heart
                size={19}
                strokeWidth={1.5}
                className={wished ? "fill-ink text-ink" : ""}
              />
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-2 text-xs leading-relaxed text-taupe">
            <p className="flex items-start gap-2">
              <Truck size={14} strokeWidth={1.5} className="mt-0.5 shrink-0" />
              {product.leadTimeNote}
            </p>
            <p className="flex items-start gap-2">
              <RotateCcw size={14} strokeWidth={1.5} className="mt-0.5 shrink-0" />
              Demo terms: 14-day returns on unused, assembled-with-care pieces.
              No checkout or payment is processed in this prototype.
            </p>
            <p className="flex items-start gap-2">
              <ShieldQuestion size={14} strokeWidth={1.5} className="mt-0.5 shrink-0" />
              Availability is sample data only — not a live inventory feed.
            </p>
          </div>

          <div className="mt-8">
            <Accordion title="Dimensions & Specifications" defaultOpen>
              <dl className="grid grid-cols-1 gap-3">
                <div className="flex justify-between gap-4">
                  <dt className="text-taupe">Overall (W × D × H)</dt>
                  <dd>
                    {product.dimensions.width} × {product.dimensions.depth} ×{" "}
                    {product.dimensions.height} cm
                  </dd>
                </div>
                {product.specs.map((s) => (
                  <div key={s.label} className="flex justify-between gap-4">
                    <dt className="text-taupe">{s.label}</dt>
                    <dd className="text-right">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Accordion>
            <Accordion title="Materials">
              <p>
                {product.material}. {product.materials.join(" · ")}
              </p>
            </Accordion>
            <Accordion title="Care Instructions">
              <p>{product.care}</p>
            </Accordion>
            <Accordion title="Delivery & Returns">
              <p>
                Deliveries in the demo catalog run 3–7 working days for
                in-stock pieces and 6–8 weeks for made-to-order items, with
                room-of-choice placement. Returns are accepted within 14 days.
                These terms are illustrative and must be confirmed with a real
                fulfilment provider before launch.
              </p>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Complements — personalized from catalog relationships */}
      <section className="bg-mist/60">
        <div className="uxt-container py-20 md:py-24">
          <Reveal>
            <p className="eyebrow text-taupe">Curated for this piece</p>
            <h2 className="display-md mt-3 text-ink">COMPLEMENTS.</h2>
            <p className="mt-4 max-w-lg text-sm text-ink/60">
              Selected from the same design family and neighbouring categories
              — recommendations generated from catalog relationships, not
              tracking.
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <Link to="/shop" className="btn btn-outline-dark mt-14">
            Back to all furniture
          </Link>
        </div>
      </section>
    </div>
  );
}
