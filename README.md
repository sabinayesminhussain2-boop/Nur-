# UXT.COM — Furniture for considered living

A production-quality, fully responsive luxury furniture storefront. React 19,
TypeScript, Vite, Tailwind CSS v4 and React Router. All fonts and imagery are
self-hosted — no external runtime requests, no trackers, no API keys in the
client.

## Open / run

Requires Node.js 20+ and npm.

```sh
npm ci
npm run dev       # Development at http://localhost:5173 (bound to 0.0.0.0)
npm run build     # TypeScript validation + production assets in dist/
npm run preview   # Production preview at port 5173
npm test          # Smoke tests (build, assets, catalog, routes, assistant engine)
```

The dev server is also exposed as the **UXT.com Website** live preview inside
Arena. The preview is a temporary environment, not permanent hosting.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home — cinematic hero, editorial showcase, categories, collections, featured products, brand story, materials rail, campaign, journal, newsletter |
| `/shop` | Shop All Furniture — functional filters, sorting and natural-language search |
| `/categories` | Furniture Categories — editorial asymmetrical grid |
| `/product/:slug` | Product Details — gallery, variants, dimensions, specs, care, related pieces, Product JSON-LD |
| `/collections` and `/collections/:id` | Collections and collection stories |
| `/about` | Brand philosophy, principles and process |
| `/journal` and `/journal/:slug` | Design journal with full article layouts |
| `/contact` | Contact form (demo), FAQ, shipping, privacy and terms anchors |
| `/wishlist` | Saved pieces, persisted locally |
| `/cart` | Full cart with quantity controls and order summary |
| `/studio` | Design Studio — style discovery, room planner, natural-language search |

## Design system

Defined in `src/styles.css` as Tailwind v4 theme tokens:

- Ink `#171615`, coal `#242220`, warm charcoal `#302D29`
- Ivory `#F2EFE9`, warm grey `#A9A39A`, taupe `#82786E`, accent `#C7B8A4`
- Manrope (interface) and Cormorant Garamond (editorial serif), self-hosted via
  Fontsource
- Reveal-on-scroll, hover, drawer and toast animations respect
  `prefers-reduced-motion`

## Architecture

```
src/
  data/          Centralized catalog, collections, journal and site content
  context/       ShopContext (cart + wishlist, localStorage) and UI overlays
  hooks/         Scroll reveal, per-route SEO metadata, scroll restoration
  lib/           Currency helpers and the catalog assistant engine
  components/    Header, mobile nav, drawers, product cards, filters, footer…
  pages/         One component per route
```

- **Cart & wishlist** persist in `localStorage` (`uxt-cart-v1`,
  `uxt-wishlist-v1`) with a slide-in cart drawer, toasts and badge feedback.
- **SEO**: per-route titles, meta descriptions, canonical URLs, Open Graph
  tags and Product structured data generated from real catalog fields.
- **Accessibility**: semantic landmarks, labelled controls, keyboard-operable
  overlays with Escape handling, `inert` closed drawers, visible focus states
  and descriptive image alt text.
- **Resilient imagery**: every image has a branded fallback if an asset fails,
  so layouts never break.

## On-site design tools (the "AI features")

No external AI model is connected and no API keys exist in the frontend. The
tools are deterministic and run against the real catalog:

- **Interior assistant** (`AssistantDrawer`, header sparkle icon) — intent-based
  Q&A that returns actual products with dimensions and prices.
- **Room style discovery** (`/studio`) — ranks pieces by selected style tags.
- **Room planning assistant** (`/studio`) — checks product measurements against
  room dimensions with a 75 cm circulation allowance; output is explicitly
  labelled conceptual guidance.
- **Natural-language search** — parses category, budget, colour, material and
  room-size phrases into catalog filters (used in the search overlay, shop and
  studio).
- **Personalized recommendations** — product detail "Complements" derived from
  collection/category relationships.

To connect a hosted LLM, replace `answerQuestion` / `naturalLanguageSearch` in
`src/lib/assistant.ts` with calls to a backend endpoint (for example
`POST /api/assistant`), keeping the existing response shapes. The key must live
server-side only.

## Honest prototype boundaries

- All prices are **illustrative demo prices**, editable centrally in
  `src/data/catalog.ts`.
- Availability and lead times use **sample inventory** — there is no live
  stock, fulfilment or checkout connection. Checkout is intentionally disabled
  and no payment data is collected; integrate Stripe or similar via a secure
  backend before launch.
- The contact and newsletter forms validate input but **do not transmit or
  store anything**; their success states say so explicitly and describe the
  integration required.
- Social entries are labelled placeholders — no profile URLs are invented.
- No testimonials, awards, certifications, statistics or manufacturing
  locations are fabricated.
- Imagery: hero, editorial, collection and campaign photography are generated
  editorial renders; product, category, material and journal slots use the same
  generated-photo pipeline (placeholders carry a UXT label until replaced).
  Licensed photography can be dropped into `public/images/` using the same
  filenames.

## Image pipeline

Generated JPEGs are converted to sized, stripped WebP via:

```sh
node scripts/optimize-images.mjs   # JPEG -> resized WebP, then removes JPEGs
node scripts/make-placeholders.mjs # branded placeholders for any missing slot
```
