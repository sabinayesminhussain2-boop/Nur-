import { useEffect } from "react";

interface MetaOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  jsonLd?: object;
}

const SITE = "UXT.com";
const ORIGIN = "https://uxt.com";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Per-route title, description, canonical, Open Graph and optional JSON-LD. */
export function useDocumentMeta({
  title,
  description,
  path = "/",
  image = "/images/hero.webp",
  jsonLd,
}: MetaOptions) {
  useEffect(() => {
    const fullTitle = title === SITE ? title : `${title} — ${SITE}`;
    document.title = fullTitle;
    setMeta("name", "description", description);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", `${ORIGIN}${path}`);
    setMeta("property", "og:image", image);
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${ORIGIN}${path}`;

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.uxtMeta = "true";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      script?.remove();
    };
  }, [title, description, path, image, jsonLd]);
}
