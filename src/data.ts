export const vehicles = [
  {
    id: "porsche",
    brand: "PORSCHE",
    name: "911 GT3 RS",
    year: "2024",
    image: "/images/hero.webp",
    headline: "PURE PERFORMANCE.",
    hp: 518,
    ps: 525,
    time: "3.2",
    speed: 296,
    torque: 465,
    engine: "4.0 L naturally aspirated flat-six",
    drive: "Rear-wheel drive",
    transmission: "7-speed PDK",
    category: "Track-focused sports coupe",
    description:
      "Born on the track. Built to defy expectations. Every detail serves one purpose: extraordinary performance.",
    source:
      "https://newsroom.porsche.com/en/2022/products/porsche-911-gt3-rs-world-premiere-29460.html",
  },
  {
    id: "bmw",
    brand: "BMW",
    name: "M4 Competition",
    year: "2024 · RWD",
    image: "/images/bmw.webp",
    headline: "BUILT TO DOMINATE.",
    hp: 503,
    ps: 510,
    time: "3.9",
    speed: 250,
    torque: 650,
    engine: "3.0 L twin-turbo inline-six",
    drive: "Rear-wheel drive",
    transmission: "8-speed M Steptronic",
    category: "Performance coupe",
    description:
      "Unmistakable presence. Unrelenting precision. The pure expression of M, engineered for the driving obsessed.",
    source:
      "https://www.press.bmwgroup.com/global/article/detail/T0317085EN/the-new-bmw-m3-sedan-and-bmw-m4-coup%C3%A9",
  },
  {
    id: "amg",
    brand: "MERCEDES-AMG",
    name: "GT 63 4MATIC+",
    year: "2024 · Coupé",
    image: "/images/amg.webp",
    headline: "POWER MEETS PRECISION.",
    hp: 577,
    ps: 585,
    time: "3.2",
    speed: 315,
    torque: 800,
    engine: "4.0 L biturbo V8",
    drive: "AMG Performance 4MATIC+",
    transmission: "9-speed AMG SPEEDSHIFT MCT",
    category: "Grand touring coupe",
    description:
      "Handcrafted power. Effortless elegance. A grand tourer that makes every road feel like the main event.",
    source: "https://www.mercedes-amg.com/en/home/vehicles/gt/coupe.html",
  },
  {
    id: "urus",
    brand: "LAMBORGHINI",
    name: "Urus S",
    year: "2024",
    image: "/images/urus.webp",
    headline: "RULE EVERY TERRAIN.",
    hp: 657,
    ps: 666,
    time: "3.5",
    speed: 305,
    torque: 850,
    engine: "4.0 L twin-turbo V8",
    drive: "All-wheel drive",
    transmission: "8-speed automatic",
    category: "Super sport utility vehicle",
    description:
      "Supercar DNA. An entirely new perspective. Go beyond the expected with power that knows no boundaries.",
    source: "https://www.lamborghini.com/en-en/models/urus/urus-s",
  },
];
export type Vehicle = (typeof vehicles)[number];
export const paints = [
  { name: "Neon pink", color: "#f45ca8" },
  { name: "Metallic silver", color: "#bfc4ce" },
  { name: "Gloss black", color: "#202126" },
  { name: "Electric blue", color: "#245aff" },
  { name: "Racing red", color: "#b91f31" },
  { name: "Pearl white", color: "#f4f1ec" },
];

export const galleryScenes = [
  {
    image: "/images/rear-studio.webp",
    label: "PORSCHE / THE ART OF AERODYNAMICS",
    alt: "AI-generated rear three-quarter studio view of a silver Porsche GT3 RS, highlighting its wing, rear lights and diffuser.",
    caption: "Every surface has a purpose. Every detail makes a difference.",
  },
  {
    image: "/images/side-track.webp",
    label: "BMW / MADE FOR THE APEX",
    alt: "AI-generated side-profile BMW M4 concept scene on a wet, pink-lit racetrack at dusk.",
    caption: "A perfect line. An entirely different state of mind.",
  },
  {
    image: "/images/amg.webp",
    label: "MERCEDES-AMG / A STUDY IN PRECISION",
    alt: "AI-generated front three-quarter Mercedes-AMG GT 63 studio render.",
    caption: "Handcrafted power. Unmistakable presence.",
  },
  {
    image: "/images/urus.webp",
    label: "LAMBORGHINI / BEYOND EXPECTATION",
    alt: "AI-generated silver Lamborghini Urus S in a dark studio with pink rim lighting.",
    caption: "The freedom to take the extraordinary anywhere.",
  },
];

export const vehicleViews: Record<string, { label: string; image: string }[]> =
  {
    porsche: [
      { label: "Front three-quarter", image: "/images/hero-cutout.webp" },
      { label: "Rear aero detail", image: "/images/rear-studio.webp" },
    ],
    bmw: [
      { label: "Front three-quarter", image: "/images/bmw-cutout.webp" },
      { label: "Trackside profile", image: "/images/side-track.webp" },
    ],
    amg: [
      { label: "Front three-quarter", image: "/images/amg-cutout.webp" },
      { label: "Rear three-quarter", image: "/images/amg-rear.webp" },
    ],
    urus: [
      { label: "Front three-quarter", image: "/images/urus-cutout.webp" },
      { label: "Rear three-quarter", image: "/images/urus-rear.webp" },
    ],
  };
