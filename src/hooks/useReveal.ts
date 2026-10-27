import { useEffect, useRef, type ElementType } from "react";

/**
 * Adds `is-visible` when the element enters the viewport.
 * Pair with the `.reveal` class in styles.css. Respects reduced motion
 * automatically because the reduced-motion block forces .reveal visible.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px", ...options },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}

/** Reveal every `.reveal` descendant of the returned container, staggered. */
export function useRevealGroup<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)"),
    );

    if (typeof IntersectionObserver === "undefined") {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );

    items.forEach((el, i) => {
      el.style.setProperty("--reveal-delay", `${Math.min(i * 90, 540)}ms`);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return ref;
}

export type { ElementType };
