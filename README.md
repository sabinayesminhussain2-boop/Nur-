# NEW.COM — Drive the future

A complete independent automotive concept website. React 19, TypeScript, Vite, Three.js, React Three Fiber and Drei. All fonts, WebP imagery and GLB assets are served locally.

## Open / run

Requires Node.js 22+ and npm.

```sh
npm ci
npm run dev       # Development at port 5173, accessible on 0.0.0.0
npm run build     # TypeScript validation + production assets in dist/
npm run preview   # Production preview at port 5173; stop dev first
```

In Arena, open the **NEW.COM Website** live preview. The running preview is a temporary environment, not permanent hosting.

## Website

- Cinematic selectable hero and four distinct, alternating full-width vehicle showcases
- Two gallery angles per car, plus a front/side/rear editorial gallery
- Real interactive WebGL configurator: six paints, three spoke geometries, three seat materials, three lighting environments
- Mouse/touch orbit, wheel/pinch zoom, keyboard camera navigation, zoom buttons, front/side/rear/interior-cutaway presets
- Full configuration reset, live summary and text-file configuration downloads
- Accurate variant-specific performance tables, manufacturer reference links, animated counters
- About, contact section, honest contact-draft modal and complete footer
- Mobile/tablet/desktop styling, keyboard focus management, reduced-motion support
- Lazy-loaded 3D code/assets, on-demand rendering, capped device pixel ratio
- WebGL preflight, loading feedback, model-error boundary, context-loss fallback and retry

### Keyboard viewer controls

Focus the 3D canvas: arrow keys orbit, `+` / `-` zoom and `Home` resets the camera. All camera actions are also exposed as buttons. Selecting an interior material opens the cutaway view, removing the roof and glass so the simplified seats are visible. Choose any exterior camera preset to restore them.

### Honest feature boundaries

This is an **independent concept**, not a manufacturer website or vehicle retailer. No checkout, reservation, price quote or message delivery is implied.

Studio and racetrack images are AI-generated editorial renders and may differ from production vehicles. GLB models are original simplified procedural concepts, not manufacturer CAD. They include different coupe/SUV proportions and original grille/light/wing details, but are not accurate reproductions of the real vehicles. Wheel options change actual spoke geometry and finish. The interior is a simplified seat-material cutaway, not a detailed production cabin. Exact manufacturer models and photography require licensed assets.

The contact form **downloads a draft only**. It does not send, transmit or retain personal data. Configuration downloads are local files. No analytics or tracking services are installed.

If WebGL is unsupported, a GLB fails, or the GPU context is lost, the viewer displays the selected vehicle's studio render with an explicit explanation. The image does **not** pretend to show selected paint/wheels. Camera controls are disabled; selection, specification lookup and configuration downloads remain available. Retry rechecks WebGL and clears the model loader cache.

## Vehicle data

`src/data.ts` centralizes specifications and gallery assets:

- 2024 Porsche 911 GT3 RS: 518 hp / 525 PS, 465 Nm, 3.2 seconds, 296 km/h
- 2024 BMW M4 Competition **RWD**: 503 hp / 510 PS, 650 Nm, 3.9 seconds, 250 km/h standard limiter; optional M Driver's Package excluded
- 2024 Mercedes-AMG GT 63 **two-door 4MATIC+ coupe**: 577 hp / 585 PS, 800 Nm, 3.2 seconds, 315 km/h
- 2024 Lamborghini **Urus S**: 657 hp / 666 PS, 850 Nm, 3.5 seconds, 305 km/h

Acceleration is 0–100 km/h. Power is rounded mechanical horsepower, not metric PS. Manufacturer reference links are included. Model changes stay synchronized across hero, configurator and technical tables.

## Testing

Keep the dev or production-preview server running on port 5173 in a separate terminal:

```sh
npm test
npm run test:acceptance
```

The Linux browser helper uses Playwright with Chromium supplied by the npm `@sparticuz/chromium` package. It extracts bundled libraries into a temporary folder without an external browser download. Python 3 is required only for export, not for the website itself.

Smoke coverage: vehicle selection, 3D loading, paint/wheel/camera controls, keyboard navigation, build download, all editorial gallery images, honest contact draft, focus restoration, mobile navigation, reduced motion, browser errors and responsive overflow.

Acceptance coverage: all vehicle gallery angles and Explore/Configure buttons, all four GLBs and all six paint colors, three wheel designs, three interior materials, all lighting environments, camera presets, keyboard/mouse/touch rotation, full reset, section anchors, five responsive widths, GPU-context loss/retry, and a simulated no-WebGL device. Rendered-pixel comparisons verify that controls change the actual canvas rather than only UI state.

`BASE_URL` can override the acceptance-test address. Browser tests use temporary screenshots outside the repository.

## Models and export

```sh
npm run models     # Rebuild local concept GLBs from scripts/create-models.mjs
npm run export     # Build and create verified ZIP files in exports/
```

- `NEW-COM-project.zip`: source, package lock, local assets, tests, docs and production output. No `.git`, secrets, caches or `node_modules`.
- `NEW-COM-static-site.zip`: ready-to-host production website. Extract to the root of a static host (Netlify, Cloudflare Pages, Vercel static output, nginx, etc.). Serve over HTTP(S), not `file://`. Build command: `npm run build`; publish directory: `dist`.

3D is a substantial lazy-loaded dependency; Vite may report a chunk-size advisory. The main page does not download that bundle until the configurator approaches the viewport. Only the selected GLB is requested; a previously viewed model can remain in the loader cache for responsive switching.
