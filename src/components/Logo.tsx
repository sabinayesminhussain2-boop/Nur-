import { Link } from "react-router-dom";
import { cn } from "../lib/format";

export default function Logo({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="UXT.com — home"
      className={cn("group inline-flex items-baseline leading-none", className)}
    >
      <span className="text-[1.35rem] font-semibold tracking-[0.32em]">
        UXT
      </span>
      <span className="ml-1 text-[0.65rem] font-light tracking-[0.2em] opacity-50 transition-opacity duration-300 group-hover:opacity-90">
        .com
      </span>
    </Link>
  );
}
