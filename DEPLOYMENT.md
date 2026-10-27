# Deployment — UXT.COM

## Vercel (preconfigured)

`vercel.json` already pins the Vite framework, install/build commands, the
`dist` output directory and an SPA rewrite so deep links such as
`/product/forma-modular-sofa` resolve to `index.html`.

1. Connect the repository in Vercel.
2. Build settings are read from `vercel.json` — no environment variables are
   required for the current build.
3. After deploy, verify a deep link and the `/studio` route reload directly
   without a 404.

## Any static host

```sh
npm ci
npm run build
```

Serve the generated `dist/` directory with an SPA fallback to `/index.html`
(nginx `try_files`, Netlify `_redirects` rule `/* /index.html 200`, etc.).

## Pre-launch integration checklist

- [ ] Replace demo prices and sample inventory in `src/data/catalog.ts`, or
      wire the catalog to a commerce backend.
- [ ] Connect a payment provider through a server-side checkout flow and
      enable the disabled checkout button in `src/pages/Cart.tsx`.
- [ ] Connect newsletter (Klaviyo/Mailchimp/Resend) and contact email (Resend/
      Postmark/CRM) to backend endpoints; update the demo success panels in
      `Newsletter.tsx` and `Contact.tsx`.
- [ ] Add real social profile URLs to `src/data/site.ts`.
- [ ] Replace generated/placeholder imagery in `public/images/` with licensed
      photography, keeping filenames, then run
      `node scripts/optimize-images.mjs`.
- [ ] To enable generative AI, add a backend assistant endpoint and rewire the
      two functions in `src/lib/assistant.ts`; never ship API keys client-side.
- [ ] Publish real privacy policy, terms, shipping and returns copy
      (`src/pages/Contact.tsx` anchors).
- [ ] Confirm canonical origin (`ORIGIN` in `src/hooks/useDocumentMeta.ts` and
      JSON-LD in `ProductDetail.tsx`) matches the production domain.
