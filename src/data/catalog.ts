/* ------------------------------------------------------------------ */
/* UXT.com — centralized catalog. Edit products, prices and copy here. */
/* Prices are illustrative demo prices and can be changed before launch. */
/* ------------------------------------------------------------------ */

export type CategoryId =
  | "sofas"
  | "lounge-chairs"
  | "dining-tables"
  | "dining-chairs"
  | "beds"
  | "coffee-tables"
  | "storage"
  | "lighting";

export type CollectionId = "forma" | "atelier" | "still" | "elements";

export type StyleId =
  | "minimalist"
  | "contemporary"
  | "scandinavian"
  | "japandi"
  | "industrial"
  | "warm-modern";

export interface ColorVariant {
  name: string;
  hex: string;
}

export interface Dimensions {
  width: number; // cm
  depth: number; // cm
  height: number; // cm
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  collection: CollectionId;
  price: number;
  shortDescription: string;
  description: string;
  material: string;
  materials: string[];
  colors: ColorVariant[];
  dimensions: Dimensions;
  image: string;
  altImage: string;
  lifestyleImage: string;
  isNew?: boolean;
  /** Sample inventory only — not connected to a live stock system. */
  availability: "in-stock" | "made-to-order";
  leadTimeNote: string;
  care: string;
  specs: { label: string; value: string }[];
  styles: StyleId[];
}

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  image: string;
  /** Editorial grid span hint used on the categories page. */
  wide?: boolean;
}

export interface Collection {
  id: CollectionId;
  name: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "sofas",
    name: "Sofas & Sectionals",
    tagline: "Sculptural seating built for long evenings.",
    image: "/images/cat-sofas.webp",
    wide: true,
  },
  {
    id: "lounge-chairs",
    name: "Lounge Chairs",
    tagline: "Quiet forms for reading and resting.",
    image: "/images/cat-lounge.webp",
  },
  {
    id: "dining-tables",
    name: "Dining Tables",
    tagline: "The anchor of the considered home.",
    image: "/images/cat-dining-tables.webp",
  },
  {
    id: "dining-chairs",
    name: "Dining Chairs",
    tagline: "Light silhouettes, honest joinery.",
    image: "/images/cat-dining-chairs.webp",
  },
  {
    id: "beds",
    name: "Beds & Bedroom",
    tagline: "Serene pieces for peaceful rooms.",
    image: "/images/cat-beds.webp",
    wide: true,
  },
  {
    id: "coffee-tables",
    name: "Coffee Tables",
    tagline: "Stone and wood in quiet proportion.",
    image: "/images/cat-coffee.webp",
  },
  {
    id: "storage",
    name: "Storage & Shelving",
    tagline: "Order, concealed with craftsmanship.",
    image: "/images/cat-storage.webp",
  },
  {
    id: "lighting",
    name: "Lighting & Objects",
    tagline: "Atmosphere, framed in metal and linen.",
    image: "/images/cat-lighting.webp",
  },
];

export const COLLECTIONS: Collection[] = [
  {
    id: "forma",
    name: "The Forma Collection",
    title: "THE FORMA COLLECTION",
    tagline: "Sculptural silhouettes and architectural simplicity.",
    description:
      "Forma studies pure geometry — low lines, generous proportions and silhouettes that hold a room without filling it. Each piece is built around a visible structural frame and restrained, tactile upholstery.",
    image: "/images/coll-forma.webp",
  },
  {
    id: "atelier",
    name: "The Atelier Collection",
    title: "THE ATELIER COLLECTION",
    tagline: "Thoughtful craftsmanship and rich natural materials.",
    description:
      "Atelier honours the workshop. Solid walnut, full-grain leather and hand-finished joinery define a collection of warm, characterful pieces designed to age gracefully through everyday use.",
    image: "/images/coll-atelier.webp",
  },
  {
    id: "still",
    name: "The Still Collection",
    title: "THE STILL COLLECTION",
    tagline: "Quiet forms designed for peaceful interiors.",
    description:
      "Still is a collection of calm. Low beds, soft-edged tables and neutral finishes create interiors that feel unhurried — furniture that recedes so the room can breathe.",
    image: "/images/coll-still.webp",
  },
  {
    id: "elements",
    name: "The Elements Collection",
    title: "THE ELEMENTS COLLECTION",
    tagline: "A study of texture, proportion and material.",
    description:
      "Elements places material first: brushed metal, natural stone and solid wood arranged with architectural discipline. Lighting and tables that define atmosphere through texture alone.",
    image: "/images/coll-elements.webp",
  },
];

export const MATERIALS = [
  {
    name: "Natural Oak",
    note: "Open grain, warm tone, honest joinery.",
    image: "/images/mat-oak.webp",
  },
  {
    name: "Walnut",
    note: "Rich depth and a slowly developing patina.",
    image: "/images/mat-walnut.webp",
  },
  {
    name: "Solid Wood",
    note: "FSC-frame construction built to be re-finished.",
    image: "/images/mat-oak.webp",
  },
  {
    name: "Linen",
    note: "Breathable natural fibre with a soft, dry hand.",
    image: "/images/mat-linen.webp",
  },
  {
    name: "Bouclé",
    note: "Tactile looped yarn with sculptural depth.",
    image: "/images/mat-boucle.webp",
  },
  {
    name: "Premium Upholstery",
    note: "High-density foam wrapped in natural fibre.",
    image: "/images/mat-linen.webp",
  },
  {
    name: "Brushed Metal",
    note: "Muted sheen that resists fingerprints.",
    image: "/images/mat-metal.webp",
  },
  {
    name: "Natural Stone",
    note: "Travertine and stone with an unsealed character.",
    image: "/images/mat-stone.webp",
  },
];

export const STYLE_PROFILES: {
  id: StyleId;
  name: string;
  description: string;
}[] = [
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Edited forms, neutral tones and generous empty space.",
  },
  {
    id: "contemporary",
    name: "Contemporary",
    description: "Current silhouettes with architectural confidence.",
  },
  {
    id: "scandinavian",
    name: "Scandinavian",
    description: "Light woods, soft textiles and functional warmth.",
  },
  {
    id: "japandi",
    name: "Japandi",
    description: "Japanese restraint meets Nordic calm.",
  },
  {
    id: "industrial",
    name: "Industrial",
    description: "Brushed metal, solid timber and honest structure.",
  },
  {
    id: "warm-modern",
    name: "Warm Modern",
    description: "Modern lines softened by stone, wool and wood.",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "p01",
    slug: "forma-modular-sofa",
    name: "Forma Modular Sofa",
    category: "sofas",
    collection: "forma",
    price: 2490,
    shortDescription:
      "A low, architectural modular sofa in textured bouclé with a solid oak plinth.",
    description:
      "The Forma Modular Sofa anchors a room with its deep seat, precise geometry and softly rounded corners. A solid oak plinth lifts the bouclé-upholstered modules just off the floor, giving a generous sofa a deliberately light footprint. Modules connect with a hidden brass clasp, allowing the configuration to evolve with the room.",
    material: "Ivory bouclé upholstery on solid oak",
    materials: ["Bouclé", "Solid Oak", "High-density Foam"],
    colors: [
      { name: "Ivory", hex: "#E8E2D6" },
      { name: "Warm Grey", hex: "#A9A39A" },
      { name: "Charcoal", hex: "#302D29" },
    ],
    dimensions: { width: 260, depth: 105, height: 82 },
    image: "/images/p01.webp",
    altImage: "/images/p01-alt.webp",
    lifestyleImage: "/images/cat-sofas.webp",
    isNew: true,
    availability: "in-stock",
    leadTimeNote: "Sample inventory — ships within 3–5 working days in the demo catalog.",
    care: "Vacuum bouclé weekly on low power. Blot spills immediately with a dry cloth; avoid rubbing. Professional upholstery cleaning recommended annually.",
    specs: [
      { label: "Seat Height", value: "42 cm" },
      { label: "Arm Height", value: "58 cm" },
      { label: "Frame", value: "Kiln-dried solid oak, mortise and tenon" },
      { label: "Filling", value: "High-density foam, feather-wrapped back" },
      { label: "Fabric", value: "48% wool, 36% cotton, 16% recycled fibre bouclé" },
      { label: "Assembly", value: "Leg assembly required; tool included" },
    ],
    styles: ["minimalist", "contemporary", "japandi", "warm-modern", "scandinavian"],
  },
  {
    id: "p02",
    slug: "atelier-lounge-chair",
    name: "Atelier Lounge Chair",
    category: "lounge-chairs",
    collection: "atelier",
    price: 890,
    shortDescription:
      "A sculpted walnut lounge chair with a reclined linen-sling seat.",
    description:
      "The Atelier Lounge Chair pairs a hand-finished walnut frame with a reclined sling seat upholstered in washed linen. Its wide arms and pitched back invite long reading hours, while the exposed joinery keeps the construction honest and visible.",
    material: "Solid walnut frame with washed linen",
    materials: ["Walnut", "Linen", "Full-grain Leather Option"],
    colors: [
      { name: "Cognac Leather", hex: "#9C6B45" },
      { name: "Washed Linen", hex: "#E3DBCB" },
      { name: "Espresso", hex: "#4A3B32" },
    ],
    dimensions: { width: 78, depth: 85, height: 78 },
    image: "/images/p02.webp",
    altImage: "/images/p02-alt.webp",
    lifestyleImage: "/images/editorial-3.webp",
    availability: "in-stock",
    leadTimeNote: "Sample inventory — ships within 3–5 working days in the demo catalog.",
    care: "Dust walnut frame with a soft dry cloth and re-wax twice yearly. Linen sling is removable for dry cleaning only.",
    specs: [
      { label: "Seat Height", value: "39 cm" },
      { label: "Frame", value: "Solid American walnut, natural oil finish" },
      { label: "Upholstery", value: "Removable washed linen sling" },
      { label: "Weight Capacity", value: "120 kg" },
      { label: "Assembly", value: "Fully assembled" },
    ],
    styles: ["contemporary", "warm-modern", "japandi", "scandinavian"],
  },
  {
    id: "p03",
    slug: "still-coffee-table",
    name: "Still Coffee Table",
    category: "coffee-tables",
    collection: "still",
    price: 650,
    shortDescription:
      "A low travertine-top table resting on a mitred oak base.",
    description:
      "The Still Coffee Table pairs a honed travertine top with a mitred oak base, its low proportions keeping sightlines open across the room. Natural variation in the stone means every table carries its own quiet pattern of veins and pores.",
    material: "Honed travertine and solid oak",
    materials: ["Natural Stone", "Solid Oak"],
    colors: [
      { name: "Travertine", hex: "#D8CDBE" },
      { name: "Smoked Oak", hex: "#7A6250" },
    ],
    dimensions: { width: 120, depth: 60, height: 38 },
    image: "/images/p03.webp",
    altImage: "/images/p03-alt.webp",
    lifestyleImage: "/images/cat-coffee.webp",
    availability: "in-stock",
    leadTimeNote: "Sample inventory — ships within 3–5 working days in the demo catalog.",
    care: "Seal travertine annually. Wipe spills immediately; use coasters and avoid acidic cleaners. Dust oak base with a dry cloth.",
    specs: [
      { label: "Top", value: "20 mm honed travertine" },
      { label: "Base", value: "Mitred solid oak" },
      { label: "Finish", value: "Natural hardwax oil" },
      { label: "Weight", value: "34 kg" },
      { label: "Assembly", value: "Fully assembled" },
    ],
    styles: ["minimalist", "japandi", "scandinavian", "warm-modern"],
  },
  {
    id: "p04",
    slug: "element-dining-table",
    name: "Element Dining Table",
    category: "dining-tables",
    collection: "elements",
    price: 1850,
    shortDescription:
      "A solid-oak dining table for six, defined by a single stone inlay.",
    description:
      "The Element Dining Table seats six around a continuous solid-oak surface, interrupted only by a narrow inlay of brushed stone. Trestle legs keep the ends open, allowing flexible seating and easy extension with benches when entertaining.",
    material: "Solid oak with natural stone inlay",
    materials: ["Solid Oak", "Natural Stone"],
    colors: [
      { name: "Natural Oak", hex: "#C8A97E" },
      { name: "Smoked Oak", hex: "#7A6250" },
      { name: "Walnut", hex: "#6F5644" },
    ],
    dimensions: { width: 220, depth: 95, height: 75 },
    image: "/images/p04.webp",
    altImage: "/images/p04-alt.webp",
    lifestyleImage: "/images/editorial-2.webp",
    isNew: true,
    availability: "made-to-order",
    leadTimeNote:
      "Sample inventory — made-to-order in the demo catalog with an indicative 6–8 week lead time.",
    care: "Wipe with a slightly damp cloth and dry immediately. Re-apply hardwax oil once per year. Always use placemats and trivets.",
    specs: [
      { label: "Seats", value: "6 comfortably, 8 for entertaining" },
      { label: "Top", value: "30 mm solid oak, stone centre inlay" },
      { label: "Legs", value: "Solid oak trestle, concealed hardware" },
      { label: "Clearance", value: "71 cm under-table" },
      { label: "Assembly", value: "Two-person leg attachment" },
    ],
    styles: ["contemporary", "warm-modern", "scandinavian", "industrial"],
  },
  {
    id: "p05",
    slug: "forma-dining-chair",
    name: "Forma Dining Chair",
    category: "dining-chairs",
    collection: "forma",
    price: 420,
    shortDescription:
      "A light upholstered dining chair on a tapered oak frame.",
    description:
      "The Forma Dining Chair pairs a gently curved upholstered shell with a tapered oak frame that tucks neatly under any table. Its slight flex and foam-core seat make it comfortable well beyond the last course.",
    material: "Oak frame with woven upholstery",
    materials: ["Solid Oak", "Bouclé", "Linen"],
    colors: [
      { name: "Ivory", hex: "#E8E2D6" },
      { name: "Taupe", hex: "#82786E" },
      { name: "Charcoal", hex: "#302D29" },
    ],
    dimensions: { width: 52, depth: 56, height: 80 },
    image: "/images/p05.webp",
    altImage: "/images/p05-alt.webp",
    lifestyleImage: "/images/cat-dining-chairs.webp",
    availability: "in-stock",
    leadTimeNote: "Sample inventory — ships within 3–5 working days in the demo catalog.",
    care: "Vacuum upholstery monthly. Spot clean with a damp white cloth. Wood frame wipes clean with a dry duster.",
    specs: [
      { label: "Seat Height", value: "46 cm" },
      { label: "Frame", value: "Solid oak, tapered legs" },
      { label: "Shell", value: "Bent plywood, foam-cored" },
      { label: "Stacking", value: "Stacks up to four chairs" },
      { label: "Assembly", value: "Fully assembled" },
    ],
    styles: ["minimalist", "contemporary", "scandinavian", "warm-modern"],
  },
  {
    id: "p06",
    slug: "atelier-sideboard",
    name: "Atelier Sideboard",
    category: "storage",
    collection: "atelier",
    price: 1290,
    shortDescription:
      "A walnut sideboard with flush doors and brushed-metal pulls.",
    description:
      "The Atelier Sideboard brings workshop detail to storage: book-matched walnut doors sit flush within a mitred carcass, opened by slim brushed-metal pulls. Inside, adjustable shelving and a soft-close mechanism keep everything orderly and quiet.",
    material: "Book-matched walnut with brushed metal",
    materials: ["Walnut", "Brushed Metal"],
    colors: [
      { name: "Natural Walnut", hex: "#6F5644" },
      { name: "Dark Walnut", hex: "#4A3B32" },
    ],
    dimensions: { width: 180, depth: 45, height: 78 },
    image: "/images/p06.webp",
    altImage: "/images/p06-alt.webp",
    lifestyleImage: "/images/cat-storage.webp",
    availability: "in-stock",
    leadTimeNote: "Sample inventory — ships within 5–7 working days in the demo catalog.",
    care: "Dust with a soft dry cloth. Re-wax the walnut twice yearly. Avoid placing in direct sunlight to preserve even colouring.",
    specs: [
      { label: "Storage", value: "4 soft-close doors, 2 adjustable shelves" },
      { label: "Carcass", value: "Walnut veneer over engineered core" },
      { label: "Pulls", value: "Brushed bronze metal" },
      { label: "Weight Capacity", value: "40 kg per shelf" },
      { label: "Assembly", value: "Leg assembly required" },
    ],
    styles: ["contemporary", "warm-modern", "industrial"],
  },
  {
    id: "p07",
    slug: "still-bed-frame",
    name: "Still Bed Frame",
    category: "beds",
    collection: "still",
    price: 1690,
    shortDescription:
      "A low oak bed with a softly upholstered linen headboard.",
    description:
      "The Still Bed Frame keeps the bedroom grounded: a low oak platform meets a tall, softly padded linen headboard with a gently arched silhouette. Slatted support removes the need for a box spring, and the neutral finish pairs with any linen palette.",
    material: "Solid oak with upholstered linen headboard",
    materials: ["Solid Oak", "Linen"],
    colors: [
      { name: "Ivory Linen", hex: "#E8E2D6" },
      { name: "Warm Grey", hex: "#A9A39A" },
    ],
    dimensions: { width: 210, depth: 225, height: 110 },
    image: "/images/p07.webp",
    altImage: "/images/p07-alt.webp",
    lifestyleImage: "/images/coll-still.webp",
    availability: "made-to-order",
    leadTimeNote:
      "Sample inventory — made-to-order in the demo catalog with an indicative 6–8 week lead time.",
    care: "Vacuum the headboard on low power. Blot spills without rubbing. Oak slats and frame require only occasional dry dusting.",
    specs: [
      { label: "Mattress Size", value: "UK King / EU 160 × 200 cm" },
      { label: "Headboard", value: "Padded linen, arched profile" },
      { label: "Base", value: "Solid oak platform, 28 slats" },
      { label: "Under-bed Clearance", value: "18 cm" },
      { label: "Assembly", value: "Two-person assembly; fittings included" },
    ],
    styles: ["minimalist", "japandi", "scandinavian", "warm-modern"],
  },
  {
    id: "p08",
    slug: "element-floor-lamp",
    name: "Element Floor Lamp",
    category: "lighting",
    collection: "elements",
    price: 380,
    shortDescription:
      "A brushed-metal arc lamp with a hand-sewn linen shade.",
    description:
      "The Element Floor Lamp casts a warm, downward pool of light through a hand-sewn linen shade mounted on a brushed-metal arc. A weighted stone base keeps the slim profile stable, and the in-line dimmer transitions the room from afternoon to evening.",
    material: "Brushed metal, linen shade and stone base",
    materials: ["Brushed Metal", "Linen", "Natural Stone"],
    colors: [
      { name: "Brushed Nickel", hex: "#B7B3AC" },
      { name: "Bronze", hex: "#7E6A55" },
    ],
    dimensions: { width: 45, depth: 45, height: 165 },
    image: "/images/p08.webp",
    altImage: "/images/p08-alt.webp",
    lifestyleImage: "/images/hero.webp",
    availability: "in-stock",
    leadTimeNote: "Sample inventory — ships within 3–5 working days in the demo catalog.",
    care: "Dust metal with a dry microfibre cloth. Remove shade and vacuum gently on low power. Bulb not included; E27 fitting, max 60W.",
    specs: [
      { label: "Fitting", value: "E27, max 60W (bulb not included)" },
      { label: "Dimming", value: "In-line rotary dimmer" },
      { label: "Shade", value: "Hand-sewn natural linen" },
      { label: "Base", value: "Weighted natural stone, 9 kg" },
      { label: "Cable", value: "2.4 m textile-covered" },
    ],
    styles: ["minimalist", "contemporary", "industrial", "warm-modern"],
  },
];

/* ----------------------------- helpers ----------------------------- */

export const getProduct = (slug: string) =>
  PRODUCTS.find((p) => p.slug === slug);

export const getCategory = (id: CategoryId) =>
  CATEGORIES.find((c) => c.id === id);

export const getCollection = (id: CollectionId) =>
  COLLECTIONS.find((c) => c.id === id);

export const productsByCategory = (id: CategoryId) =>
  PRODUCTS.filter((p) => p.category === id);

export const productsByCollection = (id: CollectionId) =>
  PRODUCTS.filter((p) => p.collection === id);

export const ALL_MATERIALS = Array.from(
  new Set(PRODUCTS.flatMap((p) => p.materials)),
).sort();

export const ALL_COLORS = Array.from(
  new Map(
    PRODUCTS.flatMap((p) => p.colors).map((c) => [c.name, c]),
  ).values(),
);

export const PRICE_BOUNDS: [number, number] = [
  Math.min(...PRODUCTS.map((p) => p.price)),
  Math.max(...PRODUCTS.map((p) => p.price)),
];
