/* Converts generated JPEGs in public/images to sized WebP and removes JPEGs. */
import { execSync } from "node:child_process";
import { readdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIR = "public/images";
const WIDE = new Set(["hero", "lifestyle", "editorial-feature", "brand-story"]);

const files = readdirSync(DIR).filter((f) => f.endsWith(".jpg"));
if (!files.length) {
  console.log("No JPEGs to convert.");
  process.exit(0);
}

for (const file of files) {
  const base = file.replace(/\.jpg$/, "");
  const src = join(DIR, file);
  const out = join(DIR, `${base}.webp`);
  const maxWidth = WIDE.has(base) || base.startsWith("coll-") ? 1800 : 1300;
  execSync(
    `convert "${src}" -resize ${maxWidth}x\\> -strip -quality 82 "${out}"`,
    { stdio: "inherit" },
  );
  rmSync(src);
  console.log(`✓ ${file} -> ${base}.webp (max ${maxWidth}px)`);
}

if (!existsSync(join(DIR, ".gitkeep"))) {
  // keep folder tracked even if empty in some environments
}
console.log(`Converted ${files.length} image(s) to WebP.`);
