import type { CSSProperties, ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";
import { cn } from "../lib/format";

export default function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "figure" | "span";
  delay?: number;
  id?: string;
}) {
  const ref = useReveal<HTMLElement>();
  const style = delay
    ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
    : undefined;
  return (
    <Tag
      // @ts-expect-error polymorphic ref type
      ref={ref}
      id={id}
      className={cn("reveal", className)}
      style={style}
    >
      {children}
    </Tag>
  );
}
