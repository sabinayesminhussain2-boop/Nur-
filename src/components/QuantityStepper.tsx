import { Minus, Plus } from "lucide-react";
import { cn } from "../lib/format";

export default function QuantityStepper({
  qty,
  onChange,
  min = 1,
  max = 10,
  light = false,
  className,
}: {
  qty: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
  light?: boolean;
  className?: string;
}) {
  const btn =
    "flex h-10 w-10 items-center justify-center transition-colors duration-300 disabled:opacity-30";
  return (
    <div
      className={cn(
        "inline-flex items-center border",
        light
          ? "border-ivory/25 text-ivory"
          : "border-ink/20 text-ink",
        className,
      )}
      role="group"
      aria-label="Quantity selector"
    >
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.max(min, qty - 1))}
        disabled={qty <= min}
        aria-label="Decrease quantity"
      >
        <Minus size={14} strokeWidth={1.5} />
      </button>
      <span
        aria-live="polite"
        aria-label={`Quantity ${qty}`}
        className="w-10 text-center text-sm font-medium tabular-nums"
      >
        {qty}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.min(max, qty + 1))}
        disabled={qty >= max}
        aria-label="Increase quantity"
      >
        <Plus size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}
