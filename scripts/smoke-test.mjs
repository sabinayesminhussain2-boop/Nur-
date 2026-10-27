/* UXT smoke test — static integrity checks, no external services. */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

let failures = 0;
const fail = (msg) => {
  console.error(`✗ ${msg}`);
  failures++;
};
const pass = (msg) => console.log(`✓ ${msg}`);

/* 1. Build must exist */
if (!existsSync("dist/index.html")) {
  fail("dist/index.html missing — run npm run build first");
} else {
  pass("production build present");
}

/* 2. Every /images/* reference in src resolves to a public asset */
const srcFiles = execSync("find src -name '*.ts' -o -name '*.tsx'", {
  encoding: "utf8",
})
  .trim()
  .split("\n");
const refs = new Set();
for (const f of srcFiles) {
  const content = readFileSync(f, "utf8");
  for (const m of content.matchAll(/["'](\/images\/[^"']+)["']/g)) {
    refs.add(m[1]);
  }
}
const available = new Set(readdirSync("public/images"));
for (const ref of refs) {
  const name = ref.replace("/images/", "");
  if (!available.has(name)) fail(`missing image asset: ${ref}`);
}
if (failures === 0) pass(`${refs.size} image references resolve`);

/* 3. Catalog integrity */
const catalog = readFileSync("src/data/catalog.ts", "utf8");
const slugs = [...catalog.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);
if (new Set(slugs).size !== slugs.length) fail("duplicate product slugs");
if (slugs.length !== 8) fail(`expected 8 products, found ${slugs.length}`);
const prices = [...catalog.matchAll(/price: (\d+)/g)].map((m) => Number(m[1]));
if (prices.some((p) => p <= 0)) fail("all prices must be positive");
if (failures === 0) pass(`catalog: ${slugs.length} unique products, valid prices`);

/* 4. Assistant engine, executed with tsx (full TS resolution) */
try {
  execSync("npx tsx scripts/engine-check.ts", { stdio: "inherit" });
  pass("assistant engine checks pass");
} catch {
  fail("assistant engine checks failed");
}

/* 5. Routes referenced in the app are declared in App.tsx */
const app = readFileSync("src/App.tsx", "utf8");
const declared = new Set([...app.matchAll(/path="([^"]+)"/g)].map((m) => m[1]));
const linkTargets = new Set();
for (const f of srcFiles) {
  const content = readFileSync(f, "utf8");
  for (const m of content.matchAll(/to="(\/[^"?]*)/g)) linkTargets.add(m[1]);
}
for (const target of linkTargets) {
  const base = target.split("/").filter(Boolean)[0];
  const known =
    declared.has(target) ||
    declared.has(`/${base}/:slug`) ||
    declared.has(`/${base}/:id`) ||
    declared.has("*");
  if (!known) fail(`unregistered route target: ${target}`);
}
if (failures === 0) pass("all internal link targets map to declared routes");

if (failures) {
  console.error(`\n${failures} smoke test failure(s)`);
  process.exit(1);
}
console.log("\nAll smoke tests passed.");
