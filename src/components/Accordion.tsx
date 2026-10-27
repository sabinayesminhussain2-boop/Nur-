import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "../lib/format";

export default function Accordion({
  title,
  children,
  defaultOpen = false,
  dark = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className={cn(
        "border-b",
        dark ? "border-ivory/15" : "border-ink/15",
      )}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-semibold uppercase tracking-[0.18em]">
          {title}
        </span>
        <Plus
          size={17}
          strokeWidth={1.5}
          className={cn(
            "shrink-0 transition-transform duration-500",
            open && "rotate-45",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="text-sm leading-relaxed opacity-80">{children}</div>
        </div>
      </div>
    </div>
  );
}
