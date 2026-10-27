/* Runtime checks for the client-side catalog assistant. Run with: npx tsx */
import {
  naturalLanguageSearch,
  parseQuery,
  recommendByStyles,
  planRoom,
  answerQuestion,
} from "../src/lib/assistant.ts";
import { PRODUCTS } from "../src/data/catalog.ts";

let failures = 0;
const assert = (ok: boolean, msg: string) => {
  if (ok) console.log(`✓ ${msg}`);
  else {
    console.error(`✗ ${msg}`);
    failures++;
  }
};

// Natural-language search: price + colour + category
const signals = parseQuery("Show me a compact beige sofa under $2,500");
assert(signals.category === "sofas", "query parser detects sofa category");
assert(signals.maxPrice === 2500, "query parser extracts $2,500 budget");
assert(signals.compact === true, "query parser detects compact preference");

const hits = naturalLanguageSearch("compact beige sofa under $2,500");
assert(
  hits.some((p) => p.slug === "forma-modular-sofa"),
  "NL search returns the Forma Modular Sofa",
);
assert(hits.every((p) => p.price <= 2500), "NL search respects the budget");

// Specificity: multi-word categories must beat generic terms
assert(
  parseQuery("help me choose a dining chair").category === "dining-chairs",
  "“dining chair” resolves to dining chairs, not lounge chairs",
);
assert(
  parseQuery("stone coffee table").category === "coffee-tables",
  "“coffee table” resolves to coffee tables, not dining tables",
);
assert(
  parseQuery("walnut sideboard for storage").category === "storage",
  "storage vocabulary resolves to the storage category",
);

// Material query
const stone = naturalLanguageSearch("stone coffee table");
assert(
  stone.some((p) => p.slug === "still-coffee-table"),
  "material query returns the Still Coffee Table",
);

// Style discovery
const ranked = recommendByStyles(["japandi", "minimalist"]);
assert(ranked.length === PRODUCTS.length, "style discovery ranks full catalog");
assert(
  ranked[0].styles.filter((s) => ["japandi", "minimalist"].includes(s)).length >=
    ranked[ranked.length - 1].styles.filter((s) =>
      ["japandi", "minimalist"].includes(s),
    ).length,
  "ranking orders strongest style matches first",
);

// Room planner uses real dimensions
const plan = planRoom({ width: 300, depth: 350, styles: ["minimalist"] });
assert(plan.items.length > 0, "room planner returns suggestions");
assert(
  plan.items.every((i) => ["fits", "tight", "does-not-fit"].includes(i.fit)),
  "every suggestion carries a fit classification",
);
assert(
  plan.items.some((i) => i.fit === "does-not-fit" || i.fit === "tight"),
  "small room flags oversized pieces",
);

// Q&A intent
const answer = answerQuestion("What sofa works in a small living room?");
assert(answer.products.length > 0, "small-living-room question recommends products");
assert(answer.message.length > 40, "answer includes explanatory guidance");

if (failures) {
  console.error(`\n${failures} engine check failure(s)`);
  process.exit(1);
}
console.log("\nAll assistant engine checks passed.");
