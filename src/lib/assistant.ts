/* ------------------------------------------------------------------ */
/* UXT on-site catalog assistant.                                       */
/*                                                                      */
/* This is a fully client-side, rule-based recommendation engine that   */
/* queries the real product catalog. No external AI model is connected  */
/* and no API keys are used. To connect a hosted LLM, replace           */
/* `answerQuestion` and `naturalLanguageSearch` with calls to your      */
/* backend (e.g. /api/assistant), keeping the response shapes below.    */
/* ------------------------------------------------------------------ */

import {
  PRODUCTS,
  CATEGORIES,
  type Product,
  type CategoryId,
  type StyleId,
} from "../data/catalog";

const CATEGORY_TERMS: Record<CategoryId, string[]> = {
  sofas: ["sofa", "sofas", "sectional", "sectionals", "couch", "seating", "loveseat"],
  "lounge-chairs": ["lounge", "armchair", "chair", "accent chair", "reading chair"],
  "dining-tables": ["dining table", "table", "dining"],
  "dining-chairs": ["dining chair", "dining chairs"],
  beds: ["bed", "bedroom", "bed frame", "mattress"],
  "coffee-tables": ["coffee table", "coffee"],
  storage: ["storage", "sideboard", "shelf", "shelving", "cabinet", "cupboard"],
  lighting: ["lamp", "lighting", "light", "floor lamp", "pendant", "objects"],
};

const COLOR_TERMS: Record<string, string[]> = {
  Ivory: ["ivory", "cream", "off-white", "off white", "white", "beige"],
  "Warm Grey": ["grey", "gray", "warm grey", "warm gray"],
  Charcoal: ["charcoal", "dark", "black"],
  Taupe: ["taupe", "mushroom"],
  Cognac: ["cognac", "tan", "leather", "brown"],
  Bronze: ["bronze"],
  "Natural Oak": ["oak", "light wood"],
  Walnut: ["walnut", "dark wood"],
  Travertine: ["travertine", "stone", "cream stone"],
};

const MATERIAL_TERMS: Record<string, string[]> = {
  Oak: ["oak"],
  Walnut: ["walnut"],
  Bouclé: ["boucle", "bouclé", "textured", "wool"],
  Linen: ["linen"],
  Stone: ["stone", "travertine", "marble"],
  Metal: ["metal", "brushed", "nickel", "bronze"],
  Leather: ["leather"],
};

const STYLE_TERMS: Record<StyleId, string[]> = {
  minimalist: ["minimalist", "minimal", "simple", "uncluttered"],
  contemporary: ["contemporary", "modern", "current", "architectural"],
  scandinavian: ["scandinavian", "nordic", "scandi"],
  japandi: ["japandi", "japanese", "zen", "calm"],
  industrial: ["industrial", "loft", "exposed", "metal"],
  "warm-modern": ["warm", "neutral", "cozy", "cosy", "earthy"],
};

export interface FilterSignals {
  category?: CategoryId;
  maxPrice?: number;
  minPrice?: number;
  color?: string;
  material?: string;
  style?: StyleId;
  compact?: boolean;
}

/** Extract structured catalog filters from a free-text query. */
export function parseQuery(query: string): FilterSignals {
  const q = query.toLowerCase();
  const signals: FilterSignals = {};

  // Prices: "under 2500", "$2,500", "below 1000", "less than 800"
  const under = q.match(/(?:under|below|less than|max(?:imum)?|up to)\s*\$?([\d,]+)/);
  if (under) signals.maxPrice = Number(under[1].replace(/,/g, ""));
  const over = q.match(/(?:over|above|more than|at least|min(?:imum)?)\s*\$?([\d,]+)/);
  if (over) signals.minPrice = Number(over[1].replace(/,/g, ""));
  const price = q.match(/\$([\d,]+)/);
  if (!signals.maxPrice && price) signals.maxPrice = Number(price[1].replace(/,/g, ""));

  // Longest matching term wins so "dining chair" / "coffee table" are not
  // captured by the generic "chair" / "table" terms.
  let bestCategory: CategoryId | undefined;
  let bestLength = 0;
  for (const [cat, terms] of Object.entries(CATEGORY_TERMS)) {
    for (const t of terms) {
      if (t.length > bestLength && q.includes(t)) {
        bestCategory = cat as CategoryId;
        bestLength = t.length;
      }
    }
  }
  if (bestCategory) signals.category = bestCategory;
  for (const [color, terms] of Object.entries(COLOR_TERMS)) {
    if (terms.some((t) => q.includes(t))) {
      signals.color = color;
      break;
    }
  }
  for (const [material, terms] of Object.entries(MATERIAL_TERMS)) {
    if (terms.some((t) => q.includes(t))) {
      signals.material = material;
      break;
    }
  }
  for (const [style, terms] of Object.entries(STYLE_TERMS)) {
    if (terms.some((t) => q.includes(t))) {
      signals.style = style as StyleId;
      break;
    }
  }
  if (/\b(small|compact|tiny|studio|narrow)\b/.test(q)) signals.compact = true;

  return signals;
}

export function applySignals(signals: FilterSignals): Product[] {
  return PRODUCTS.filter((p) => {
    if (signals.category && p.category !== signals.category) return false;
    if (signals.maxPrice && p.price > signals.maxPrice) return false;
    if (signals.minPrice && p.price < signals.minPrice) return false;
    if (signals.color && !p.colors.some((c) => c.name === signals.color))
      return false;
    if (
      signals.material &&
      !p.materials.some((m) =>
        m.toLowerCase().includes(signals.material!.toLowerCase()),
      )
    )
      return false;
    if (signals.style && !p.styles.includes(signals.style)) return false;
    if (signals.compact) {
      // Compact preference: favour smaller footprints within category.
      if (p.category === "sofas" && p.dimensions.width > 230) return false;
      if (p.category === "dining-tables" && p.dimensions.width > 180)
        return false;
      if (p.category === "beds" && p.dimensions.width > 180) return false;
    }
    return true;
  });
}

/** Natural-language product search used by the assistant and search overlay. */
export function naturalLanguageSearch(query: string): Product[] {
  const signals = parseQuery(query);
  const results = applySignals(signals);
  if (results.length) return results;

  // Fallback: loose token matching against names, materials, categories.
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/).filter((t) => t.length > 2);
  return PRODUCTS.filter((p) => {
    const haystack = [
      p.name,
      p.material,
      ...p.materials,
      ...p.colors.map((c) => c.name),
      CATEGORIES.find((c) => c.id === p.category)?.name ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return tokens.some((t) => haystack.includes(t));
  });
}

/* ---------------------- Style discovery ---------------------- */

export function recommendByStyles(styles: StyleId[]): Product[] {
  if (!styles.length) return PRODUCTS;
  return [...PRODUCTS].sort((a, b) => {
    const score = (p: Product) =>
      p.styles.filter((s) => styles.includes(s)).length;
    return score(b) - score(a) || b.price - a.price;
  });
}

/* ---------------------- Q&A intents ---------------------- */

export interface AssistantReply {
  message: string;
  products: Product[];
}

export function answerQuestion(question: string): AssistantReply {
  const q = question.toLowerCase();
  const signals = parseQuery(question);
  const results = applySignals(signals);

  // Small living room / compact sofa
  if (
    (q.includes("small") || q.includes("compact") || q.includes("studio")) &&
    (q.includes("sofa") || q.includes("living") || q.includes("seating"))
  ) {
    const sofas = applySignals({ category: "sofas", compact: true });
    const chairs = applySignals({ category: "lounge-chairs" });
    return {
      message:
        "For a compact living room, favour low silhouettes and raised legs so the floor stays visible. The Forma Modular Sofa is our shallowest configuration at 260 cm — measure 75 cm of clearance in front of it — and pairing it with a single Atelier Lounge Chair creates flexible seating without filling the room.",
      products: [...sofas, ...chairs].slice(0, 3),
    };
  }

  // Materials for minimalist interiors
  if (q.includes("material") && (q.includes("minimal") || q.includes("minimalist"))) {
    return {
      message:
        "Minimalist interiors rely on texture rather than colour. Build around natural oak and travertine for surfaces, then layer ivory bouclé or washed linen for upholstery. Brushed metal in a muted nickel finish adds structure without visual noise. Every piece below uses those materials.",
      products: PRODUCTS.filter((p) =>
        ["Bouclé", "Linen", "Natural Stone", "Solid Oak", "Brushed Metal"].some(
          (m) => p.materials.includes(m),
        ),
      ).slice(0, 4),
    };
  }

  // Dining table help
  if (q.includes("dining table") || (q.includes("dining") && q.includes("choose"))) {
    const tables = applySignals({ category: "dining-tables" });
    return {
      message:
        "Allow 90–100 cm of clearance around the table and about 60 cm of edge per guest. The Element Dining Table seats six at 220 cm and uses an open trestle base, so seating stays flexible. Share your room dimensions and I can check the fit precisely.",
      products: tables,
    };
  }

  // Warm neutral palette
  if (q.includes("warm") && (q.includes("neutral") || q.includes("colour") || q.includes("color"))) {
    return {
      message:
        "Warm neutral rooms work best with ivory, taupe and warm grey upholstery against oak or walnut. Choose one light anchor — such as the ivory Forma Modular Sofa — then add depth with walnut storage and brushed-bronze lighting.",
      products: PRODUCTS.filter((p) =>
        p.colors.some((c) =>
          ["Ivory", "Warm Grey", "Taupe", "Natural Oak", "Walnut", "Bronze"].includes(
            c.name,
          ),
        ),
      ).slice(0, 4),
    };
  }

  if (results.length) {
    return {
      message: `I found ${results.length} ${
        results.length === 1 ? "piece" : "pieces"
      } in the catalog matching your request. Every recommendation links directly to its product page with dimensions and material details.`,
      products: results.slice(0, 5),
    };
  }

  return {
    message:
      "I couldn't find an exact match in the current catalog. Try naming a category — sofa, dining table, lounge chair, bed, lighting — along with a budget, material or colour, for example “compact beige sofa under $2,500”. You can also browse all eight pieces in the shop.",
    products: [],
  };
}

/* ---------------------- Room planning ---------------------- */

export interface RoomPlanInput {
  width: number; // cm
  depth: number; // cm
  styles: StyleId[];
}

export interface RoomPlanItem {
  product: Product;
  fit: "fits" | "tight" | "does-not-fit";
  note: string;
}

export interface RoomPlan {
  areaM2: number;
  items: RoomPlanItem[];
  summary: string;
}

/**
 * Conceptual layout suggestions based on real product measurements.
 * Requires a 75 cm circulation clearance around main furniture.
 * Outputs are planning guidance, not scaled room renderings.
 */
export function planRoom({ width, depth, styles }: RoomPlanInput): RoomPlan {
  const areaM2 = (width * depth) / 10000;
  const recommended = recommendByStyles(styles.length ? styles : ["minimalist"]);

  const evaluate = (p: Product): RoomPlanItem["fit"] => {
    const fitsWidth = p.dimensions.width + 150 <= width; // 75cm each side
    const fitsDepth = p.dimensions.depth + 75 <= depth;
    if (fitsWidth && fitsDepth) return "fits";
    if (p.dimensions.width + 80 <= width && p.dimensions.depth + 40 <= depth)
      return "tight";
    return "does-not-fit";
  };

  const priorityIds = ["p01", "p03", "p02", "p04", "p08", "p06"];
  const picked = priorityIds
    .map((id) => recommended.find((p) => p.id === id) ?? PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const items: RoomPlanItem[] = picked.map((product) => {
    const fit = evaluate(product);
    const note =
      fit === "fits"
        ? `${product.dimensions.width} × ${product.dimensions.depth} cm — leaves comfortable circulation.`
        : fit === "tight"
          ? `${product.dimensions.width} × ${product.dimensions.depth} cm — limited clearance; measure carefully.`
          : `${product.dimensions.width} × ${product.dimensions.depth} cm — exceeds the available footprint with circulation.`;
    return { product, fit, note };
  });

  const fitting = items.filter((i) => i.fit !== "does-not-fit").length;
  const summary =
    areaM2 < 12
      ? `A ${areaM2.toFixed(1)} m² room calls for a tight, edited scheme. Prioritise low pieces with raised legs and skip the largest items.`
      : areaM2 < 24
        ? `At ${areaM2.toFixed(1)} m², a balanced three- to four-piece scheme works well, with a clear circulation route through the room.`
        : `At ${areaM2.toFixed(1)} m², the room supports a full modular scheme with defined seating and dining zones.`;

  return { areaM2, items: items.slice(0, 6), summary: `${summary} ${fitting} of the selected pieces fit with standard clearance.` };
}

export const ASSISTANT_SUGGESTIONS = [
  "What sofa works in a small living room?",
  "Which materials suit a minimalist interior?",
  "Help me choose a dining table.",
  "Show me a compact beige sofa under $2,500.",
  "What furniture works with warm neutral colours?",
];
