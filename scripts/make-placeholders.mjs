/* Creates branded placeholders for any referenced /images asset not yet present. */
import { execSync } from "node:child_process";
import { readdirSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

mkdirSync("public/images", { recursive: true });

const files = execSync("find src -name '*.ts' -o -name '*.tsx'", {
  encoding: "utf8",
}).trim().split("\n");

const refs = new Set();
for (const f of files) {
  const content = readFileSync(f, "utf8");
  for (const m of content.matchAll(/["'](\/images\/[^"']+\.webp)["']/g)) {
    refs.add(m[1].replace("/images/", ""));
  }
}

const present = new Set(readdirSync("public/images"));
let created = 0;

for (const name of refs) {
  if (present.has(name)) continue;
  const label = name
    .replace(/\.webp$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const out = join("public/images", name);
  const cmd = [
    `convert -size 1200x1500 gradient:'#302D29'-'#171615'`,
    `-fill 'rgba(199,184,164,0.16)' -draw "rectangle 36,36 1164,1464"`,
    `-fill 'rgba(199,184,164,0.35)' -draw "rectangle 40,40 1160,1460"`,
    `-font DejaVu-Serif -pointsize 44 -fill '#C7B8A4' -gravity center -annotate +0-30 "${label}"`,
    `-font DejaVu-Serif -pointsize 30 -fill 'rgba(169,163,154,0.7)' -annotate +0+40 "UXT"`,
    `"${out}"`,
  ].join(" ");
  execSync(cmd, { stdio: "inherit" });
  created++;
  console.log(`placeholder -> ${name}`);
}

console.log(
  created
    ? `Created ${created} placeholder(s). Replace with photography before launch.`
    : "All referenced images already present.",
);
