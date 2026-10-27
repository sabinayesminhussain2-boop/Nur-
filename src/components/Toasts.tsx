import { Check } from "lucide-react";
import { useShop } from "../context/ShopContext";

export default function Toasts() {
  const { toasts } = useShop();

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-[90] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-in flex items-center gap-3 border border-ivory/15 bg-coal/95 px-4 py-3 text-sm shadow-2xl backdrop-blur"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-ink">
            <Check size={13} strokeWidth={2.5} />
          </span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
