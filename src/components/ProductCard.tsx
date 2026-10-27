import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import type { Product } from "../data/catalog";
import { useShop } from "../context/ShopContext";
import { formatPrice, cn } from "../lib/format";
import SmartImage from "./SmartImage";
import QuickViewModal from "./QuickViewModal";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const [quickOpen, setQuickOpen] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const wished = isWishlisted(product.id);

  const onWish = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
    setHeartAnim(true);
    window.setTimeout(() => setHeartAnim(false), 500);
  };

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product.id, product.colors[0].name);
  };

  return (
    <>
      <article className="product-card group flex flex-col">
        <div className="img-frame relative aspect-[4/5]">
          <Link
            to={`/product/${product.slug}`}
            aria-label={`View ${product.name}`}
            className="absolute inset-0 z-[1]"
          >
            <SmartImage
              src={product.image}
              alt={`${product.name} — ${product.material}`}
              fallbackLabel={product.name}
              loading="lazy"
              className="main-img absolute inset-0"
            />
            <SmartImage
              src={product.altImage}
              alt={`${product.name} alternate view`}
              fallbackLabel={product.name}
              loading="lazy"
              className="alt-img absolute inset-0"
            />
          </Link>

          {product.isNew && (
            <span className="eyebrow pointer-events-none absolute left-4 top-4 z-[2] bg-ink/70 px-2.5 py-1.5 text-[10px] text-ivory backdrop-blur-sm">
              New
            </span>
          )}

          <button
            onClick={onWish}
            aria-label={
              wished
                ? `Remove ${product.name} from wishlist`
                : `Save ${product.name} to wishlist`
            }
            aria-pressed={wished}
            className={cn(
              "absolute right-4 top-4 z-[3] flex h-9 w-9 items-center justify-center bg-ink/55 backdrop-blur-sm transition-colors hover:bg-ink",
              heartAnim && "heart-pop",
            )}
          >
            <Heart
              size={16}
              strokeWidth={1.5}
              className={wished ? "fill-accent text-accent" : "text-ivory"}
            />
          </button>

          <div className="quick-add absolute inset-x-3 bottom-3 z-[3]">
            <div className="flex gap-2">
              <button
                onClick={quickAdd}
                className="flex-1 bg-ivory/95 px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink backdrop-blur transition-colors hover:bg-accent"
              >
                Quick add
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setQuickOpen(true);
                }}
                aria-label={`Quick view ${product.name}`}
                className="flex items-center justify-center bg-ink/70 px-3.5 text-ivory backdrop-blur transition-colors hover:bg-ink"
              >
                <Eye size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col pt-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-medium leading-snug">
              <Link
                to={`/product/${product.slug}`}
                className="transition-opacity hover:opacity-70"
              >
                {product.name}
              </Link>
            </h3>
            <span className="shrink-0 tabular-nums text-warmgray">
              {formatPrice(product.price)}
            </span>
          </div>
          <p className="mt-1 text-sm text-warmgray">{product.material}</p>
          <div
            className="mt-3 flex items-center gap-2"
            aria-label="Available colours"
          >
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3.5 w-3.5 rounded-full border border-ink/15 ring-1 ring-inset ring-white/20"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            <span className="ml-1 text-xs text-taupe">
              {product.colors.length} finishes
            </span>
          </div>
        </div>
      </article>

      {quickOpen && (
        <QuickViewModal product={product} onClose={() => setQuickOpen(false)} />
      )}
    </>
  );
}
