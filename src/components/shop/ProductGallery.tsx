import { useState } from "react";
import type { Product } from "../../data/catalog";
import SmartImage from "../SmartImage";
import { cn } from "../../lib/format";

export default function ProductGallery({ product }: { product: Product }) {
  const shots = [
    { src: product.image, label: "Front view" },
    { src: product.altImage, label: "Alternate angle" },
    { src: product.lifestyleImage, label: "In situ" },
  ];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="img-frame aspect-[4/5] w-full bg-charcoal">
        <SmartImage
          key={shots[active].src}
          src={shots[active].src}
          alt={`${product.name} — ${shots[active].label}`}
          fallbackLabel={product.name}
          loading="eager"
        />
      </div>
      <div className="grid grid-cols-3 gap-3" role="tablist" aria-label="Product images">
        {shots.map((shot, i) => (
          <button
            key={shot.src + i}
            role="tab"
            aria-selected={active === i}
            aria-label={shot.label}
            onClick={() => setActive(i)}
            className={cn(
              "img-frame aspect-[4/5] border transition-colors",
              active === i ? "border-ink" : "border-ink/15 hover:border-ink/40",
            )}
          >
            <SmartImage
              src={shot.src}
              alt=""
              fallbackLabel={product.name}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
