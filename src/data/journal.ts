export interface ArticleBlock {
  type: "paragraph" | "heading" | "list" | "quote";
  text?: string;
  items?: string[];
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  readingTime: string;
  intro: string;
  cover: string;
  date: string;
  blocks: ArticleBlock[];
}

export const ARTICLES: Article[] = [
  {
    slug: "timeless-living-room",
    title: "How to Design a Timeless Living Room",
    category: "Interiors",
    readingTime: "6 min read",
    date: "October 2026",
    intro:
      "Trends fade quickly; a well-proportioned room does not. A timeless living room is built from restraint, neutral anchors and furniture honest about how it is made.",
    cover: "/images/journal-1.webp",
    blocks: [
      {
        type: "paragraph",
        text: "A timeless living room is not a style — it is a discipline. It begins with editing rather than adding, choosing fewer pieces and giving each one enough space to be understood. The rooms that endure share a common structure: a restrained palette, honest materials and furniture whose silhouettes read clearly from across the room.",
      },
      { type: "heading", text: "Start with the architecture, not the decor" },
      {
        type: "paragraph",
        text: "Before selecting a single object, read the room. Note where the natural light enters, the height of the ceiling and the natural circulation path between doorways. Furniture should work with these conditions — a low sofa beneath a window, a table that leaves generous clearance, seating oriented toward the light rather than a screen.",
      },
      {
        type: "list",
        items: [
          "Keep at least 75 cm of clear circulation around main seating.",
          "Allow 40–45 cm between coffee table and sofa for comfortable reach.",
          "Anchor seating on a rug large enough to sit under the front legs of every piece.",
          "Use low furniture in small rooms to preserve sightlines and daylight.",
        ],
      },
      { type: "heading", text: "Choose a neutral spine, then add texture" },
      {
        type: "paragraph",
        text: "Warm neutrals — ivory, taupe, warm grey and muted charcoal — create a backdrop that survives changing tastes. Interest then comes from texture rather than colour: bouclé against oak, linen against stone, brushed metal against plaster. A room in a single tone can still feel rich when every surface catches light differently.",
      },
      {
        type: "quote",
        text: "Timelessness is the absence of noise. Every object in the room should earn its place twice — once for function, once for form.",
      },
      { type: "heading", text: "Invest where the body meets the room" },
      {
        type: "paragraph",
        text: "If the budget is finite, spend it on the sofa and the chair. These are the pieces the body actually touches for hours each day, and their proportions define how the whole room reads. A beautifully made sofa in a neutral textile will outlast three cycles of accent colours — and it will be more comfortable on the last day than the first.",
      },
      {
        type: "paragraph",
        text: "Finally, leave room to breathe. Empty space is not unfinished; it is the frame that lets good furniture read as intentional. A timeless living room is one where nothing competes, and every remaining object feels inevitable.",
      },
    ],
  },
  {
    slug: "choosing-the-right-sofa",
    title: "Choosing the Right Sofa for Your Space",
    category: "Buying Guide",
    readingTime: "5 min read",
    date: "September 2026",
    intro:
      "The sofa is the most measured decision in the home — by room dimensions, by how you sit, and by the years it will be asked to last.",
    cover: "/images/journal-2.webp",
    blocks: [
      {
        type: "paragraph",
        text: "A sofa dominates a living room visually, physically and financially. Choosing well means measuring twice and thinking honestly about daily habits — not the occasional gathering. The right sofa fits the room, supports the body and suits the way the household actually lives.",
      },
      { type: "heading", text: "Measure the room before you fall in love" },
      {
        type: "paragraph",
        text: "A useful rule: the sofa should occupy no more than two-thirds of the wall it sits against, and its depth should leave a comfortable circulation route of at least 75 cm. In compact rooms, a shallow seat (under 100 cm deep) and a raised base — legs rather than a full plinth — preserve floor area and keep the space feeling open.",
      },
      {
        type: "list",
        items: [
          "Small rooms up to 18 m²: consider a compact two-seater or a modular configuration under 220 cm.",
          "Medium rooms 18–30 m²: a three-seater around 240–270 cm balances presence and clearance.",
          "Large rooms over 30 m²: modular sectionals can define zones within an open plan.",
          "Always check stairwells, lifts and doorway widths before ordering.",
        ],
      },
      { type: "heading", text: "Match the seat to how you actually sit" },
      {
        type: "paragraph",
        text: "Seat depth determines comfort more than any other dimension. A 55–60 cm seat supports upright conversation; depths beyond 100 cm invite lounging and lying down. Firm, high-density foam holds its shape for longer and suits formal rooms, while feather-wrapped cushions soften over time and ask for daily plumping.",
      },
      {
        type: "quote",
        text: "Sit the way you live, not the way you think you should. A sofa that looks right but fights your posture is the wrong sofa.",
      },
      { type: "heading", text: "Upholstery is a long-term commitment" },
      {
        type: "paragraph",
        text: "Bouclé and textured weaves hide everyday wear and bring tactility to neutral rooms. Linen breathes and softens beautifully but wrinkles readily. Leather develops a patina that records the life of the household. In every case, neutral tones protect the investment — colour trends move faster than sofas wear out.",
      },
    ],
  },
  {
    slug: "wood-stone-upholstery",
    title: "Understanding Wood, Stone and Upholstery",
    category: "Materials",
    readingTime: "7 min read",
    date: "September 2026",
    intro:
      "Materials are the story furniture tells about itself. A short guide to reading grain, stone and weave before you buy.",
    cover: "/images/journal-3.webp",
    blocks: [
      {
        type: "paragraph",
        text: "Furniture asks to live with you for decades, and the materials it is made from decide how gracefully that goes. Learning to read wood, stone and upholstery turns shopping from guesswork into judgement — and makes care feel less like maintenance and more like stewardship.",
      },
      { type: "heading", text: "Wood: solid, veneer and the question of grain" },
      {
        type: "paragraph",
        text: "Solid wood can be sanded and re-finished across a lifetime, and its joints can be repaired. Oak offers an open, readable grain and a warm neutral tone; walnut is denser, darker and develops a quietly lustrous patina. Veneer is not inherently inferior — book-matched veneers over a stable engineered core resist warping better than wide solid panels in centrally heated homes. What matters is honesty about which is used, and where.",
      },
      {
        type: "list",
        items: [
          "Natural oil and hardwax finishes repair locally and deepen the grain over time.",
          "Lacquer offers tougher spill resistance but is harder to touch up invisibly.",
          "Expect movement: solid wood expands and contracts with humidity — tight joints are engineered to allow it.",
        ],
      },
      { type: "heading", text: "Stone: porosity is personality" },
      {
        type: "paragraph",
        text: "Travertine, marble and other natural stones are porous, which is precisely why they feel alive. Honed finishes soften reflections and conceal wear better than polished surfaces. Stone will mark — a ring, an etch from citrus — and for many owners those marks become the record of the home. Seal annually, use coasters, and choose stone knowing it is a material that participates in life rather than resisting it.",
      },
      { type: "heading", text: "Upholstery: weave, rub count and hand" },
      {
        type: "paragraph",
        text: "Bouclé's looped yarns create depth and disguise marks, making it forgiving in living rooms. Linen is cool and breathable but relaxes into wrinkles that are part of its character. High rub-count fabrics — independently tested abrasion ratings — indicate durability, while the fibre blend determines feel: wool-rich blends resist creasing, cotton-rich blends stay cool, and recycled fibres bring environmental honesty without sacrificing texture.",
      },
      {
        type: "quote",
        text: "Every material has a memory. Wood remembers humidity, stone remembers acid, fabric remembers sunlight — choose finishes whose ageing you find beautiful.",
      },
    ],
  },
  {
    slug: "beauty-of-minimalist-interiors",
    title: "The Beauty of Minimalist Interiors",
    category: "Interiors",
    readingTime: "4 min read",
    date: "August 2026",
    intro:
      "Minimalism is not emptiness — it is the precise moment when nothing more can be taken away without losing meaning.",
    cover: "/images/journal-4.webp",
    blocks: [
      {
        type: "paragraph",
        text: "Minimalism is often mistaken for austerity, but the most convincing minimalist interiors are deeply sensual. What they remove in quantity they return in proportion, light and texture. The eye, relieved of clutter, begins to notice the fall of shadow across plaster and the grain running through a single oak table.",
      },
      { type: "heading", text: "Restraint is a design material" },
      {
        type: "paragraph",
        text: "In a minimalist room every object is amplified. A single sculptural chair becomes the composition; a low bed defines the mood of the entire bedroom. This makes editing the most important skill — choosing furniture whose silhouette is strong enough to stand alone, and whose construction rewards close inspection.",
      },
      {
        type: "list",
        items: [
          "Limit the palette to one neutral family and let texture carry the interest.",
          "Choose low furniture to keep sightlines open and ceilings feeling tall.",
          "Conceal storage so the surfaces that remain stay deliberately empty.",
          "Treat negative space as a designed element, not a gap to fill.",
        ],
      },
      {
        type: "quote",
        text: "Minimalism is the art of knowing when the room is finished — and stopping there.",
      },
      { type: "heading", text: "Warmth keeps minimalism human" },
      {
        type: "paragraph",
        text: "Cold minimalism fails; warm minimalism endures. Natural wood, linen, bouclé and stone keep a restrained room tactile and liveable. Layered lighting — daylight, a floor lamp, candlelight — does the decorative work that ornaments would otherwise perform. The result is not a gallery but a home: calm, quiet, and unmistakably considered.",
      },
    ],
  },
  {
    slug: "balanced-dining-space",
    title: "Creating a Balanced Dining Space",
    category: "Interiors",
    readingTime: "5 min read",
    date: "July 2026",
    intro:
      "A dining room is a piece of social engineering: proportions, clearance and light that make long evenings feel effortless.",
    cover: "/images/journal-5.webp",
    blocks: [
      {
        type: "paragraph",
        text: "The dining table is where a household slows down — for meals, conversations, work and celebrations. A balanced dining space is engineered around the body: enough room to pull out a chair, enough surface for plates and elbows, and light flatters the food and the people around it.",
      },
      { type: "heading", text: "Proportion the table to the room" },
      {
        type: "paragraph",
        text: "Allow 90–100 cm of clearance on every side of the table for chairs and passage. For seating, plan roughly 60 cm of table edge per person, rising to 70 cm for armchairs. A 220 cm table seats six comfortably; round tables soften small rooms and keep conversation inclusive, while rectangular tables organise longer spaces naturally.",
      },
      {
        type: "list",
        items: [
          "Table height of 74–76 cm pairs with 45–47 cm seat heights.",
          "Trestle or central-pedestal bases offer the most flexible seating.",
          "Extendable or open-ended designs adapt to occasional larger gatherings.",
          "Benches tuck away completely and suit families with changing numbers.",
        ],
      },
      { type: "heading", text: "Light the table like a stage" },
      {
        type: "paragraph",
        text: "A pendant suspended 70–85 cm above the tabletop creates an intimate pool of light without glare at eye level. In rooms with high ceilings, two smaller pendants spread light more evenly than one oversized fitting. Dimmers are non-negotiable: the same table needs bright light for homework and candle-level warmth for dinner.",
      },
      {
        type: "quote",
        text: "The best dining rooms disappear. You remember the evening, not the furniture — and that is the design working.",
      },
      { type: "heading", text: "Anchor with texture, not matching sets" },
      {
        type: "paragraph",
        text: "Coordinated table-and-chair sets feel rigid; a considered mix feels collected. Pair a solid oak table with upholstered chairs in contrasting neutrals, or flank it with benches. A rug under the dining zone should extend at least 70 cm beyond the table edge so chairs remain on it when pulled out. The room balances when materials converse — wood, fabric, metal and stone each taking a role.",
      },
    ],
  },
];

export const getArticle = (slug: string) =>
  ARTICLES.find((a) => a.slug === slug);
