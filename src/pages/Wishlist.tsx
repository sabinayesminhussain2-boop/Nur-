import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { PRODUCTS } from "../data/catalog";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import PageHero, { Breadcrumbs } from "../components/PageHero";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useRevealGroup } from "../hooks/useReveal";

export default function Wishlist() {
  const { wishlist } = useShop();
  const saved = PRODUCTS.filter((p) => wishlist.includes(p.id));
  const gridRef = useRevealGroup<HTMLDivElement>();

  useDocumentMeta({
    title: "Wishlist",
    description:
      "Your saved UXT pieces — furniture kept for later, stored locally in your browser.",
    path: "/wishlist",
  });

  return (
    <>
      <PageHero
        eyebrow="Saved pieces"
        title="Your Wishlist"
        description="Furniture you have set aside, kept locally in this browser — no account required."
      >
        <Breadcrumbs dark items={[{ label: "Wishlist" }]} />
      </PageHero>

      <section className="bg-ivory text-ink">
        <div className="uxt-container pb-28">
          {saved.length === 0 ? (
            <div className="flex flex-col items-center gap-5 py-24 text-center">
              <Heart size={36} strokeWidth={1.25} className="text-taupe" />
              <h2 className="font-serif text-3xl">Nothing saved yet.</h2>
              <p className="max-w-sm text-sm text-taupe">
                Tap the heart on any product to keep it here while you explore.
              </p>
              <Link to="/shop" className="btn btn-outline-dark">
                Explore the shop
              </Link>
            </div>
          ) : (
            <>
              <p className="border-b border-ink/10 pb-5 text-sm text-taupe">
                {saved.length} saved piece{saved.length === 1 ? "" : "s"}
              </p>
              <div
                ref={gridRef}
                key={saved.map((p) => p.id).join(",")}
                className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
              >
                {saved.map((p) => (
                  <div key={p.id} className="reveal">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
