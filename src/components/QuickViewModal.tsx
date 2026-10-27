import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import type { Product } from "../data/catalog";
import { useShop } from "../context/ShopContext";
import { formatPrice, cn } from "../lib/format";
import SmartImage from "./SmartImage";
import QuantityStepper from "./QuantityStepper";

export default function QuickViewModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addToCart } = useShop();
  const [color, setColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[88] flex items-center justify-center bg-ink/75 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
    >
      <div
        className="relative grid max-h-[90vh] w-full max-w-4xl grid-cols-1 overflow-y-auto bg-coal text-ivory md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-ink/60 backdrop-blur transition-colors hover:bg-ink"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <div className="img-frame aspect-square md:aspect-auto">
          <SmartImage
            src={product.image}
            alt={`${product.name} — ${product.material}`}
            fallbackLabel={product.name}
          />
        </div>

        <div className="flex flex-col p-7 md:p-9">
          <p className="eyebrow text-warmgray">
            {product.availability === "in-stock"
              ? "Sample inventory · in stock"
              : "Sample inventory · made to order"}
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight">
            {product.name}
          </h2>
          <p className="mt-2 text-lg tabular-nums text-accent">
            {formatPrice(product.price)}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-warmgray">
            {product.shortDescription}
          </p>

          <div className="mt-6">
            <p className="eyebrow mb-3 text-warmgray">
              Finish — <span className="text-ivory">{color}</span>
            </p>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  aria-pressed={color === c.name}
                  className={cn(
                    "h-8 w-8 rounded-full border ring-1 ring-inset ring-white/20 transition-all",
                    color === c.name
                      ? "border-accent ring-2 ring-accent"
                      : "border-ivory/20",
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <QuantityStepper qty={qty} onChange={setQty} light />
          </div>

          <button
            onClick={() => {
              addToCart(product.id, color, qty);
              onClose();
            }}
            className="btn btn-solid mt-6 w-full"
          >
            Add to cart — {formatPrice(product.price * qty)}
          </button>
          <Link
            to={`/product/${product.slug}`}
            onClick={onClose}
            className="link-arrow mt-5 self-start"
          >
            Full product details <span className="arrow">→</span>
          </Link>

          <p className="mt-auto pt-6 text-xs leading-relaxed text-taupe">
            Dimensions {product.dimensions.width} × {product.dimensions.depth} ×{" "}
            {product.dimensions.height} cm. Demo pricing — editable in the
            catalog before launch.
          </p>
        </div>
      </div>
    </div>
  );
}
