import "@fontsource/barlow/latin-400.css";
import "@fontsource/barlow/latin-500.css";
import "@fontsource/barlow/latin-600.css";
import "@fontsource/barlow/latin-700.css";
import "@fontsource/barlow/latin-800.css";
import "@fontsource/barlow-condensed/latin-500.css";
import "@fontsource/barlow-condensed/latin-600.css";
import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource/barlow-condensed/latin-800.css";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  RotateCcw,
  Move3D,
  Plus,
  Minus,
  Check,
  Mail,
} from "lucide-react";
import {
  vehicles,
  paints,
  galleryScenes,
  vehicleViews,
  type Vehicle,
} from "./data";
import "./styles.css";
import VehicleViewer, { type SceneStatus } from "./VehicleViewer";
const go = (id: string) =>
  document.getElementById(id)?.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
function Stat({
  value,
  label,
  unit,
}: {
  value: string | number;
  label: string;
  unit?: string;
}) {
  return (
    <div className="stat">
      <strong>
        {value}
        <small>{unit}</small>
      </strong>
      <span>{label}</span>
    </div>
  );
}
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);
  useEffect(() => {
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setN(value);
          return;
        }
        let start = 0;
        const tick = (time: number) => {
          if (!start) start = time;
          const progress = Math.min((time - start) / 1000, 1);
          setN(Math.round(value * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);
  return <span ref={ref}>{n}</span>;
}
function App() {
  const contactTrigger = useRef<HTMLElement | null>(null);
  const openContact = () => {
    setSent(false);
    contactTrigger.current = document.activeElement as HTMLElement;
    setContact(true);
  };
  const [selected, setSelected] = useState(0);
  const car = vehicles[selected];
  const [menu, setMenu] = useState(false);
  const [paint, setPaint] = useState(0);
  const [wheel, setWheel] = useState("Sport");
  const [interior, setInterior] = useState("Onyx");
  const [lighting, setLighting] = useState("Pink studio");
  const [view, setView] = useState("Reset");
  const [revision, setRevision] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneStatus, setSceneStatus] = useState<SceneStatus>("loading");
  const [resetNotice, setResetNotice] = useState(false);
  const [gallery, setGallery] = useState(0);
  const [contact, setContact] = useState(false);
  const [sent, setSent] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    const conf = document.getElementById("configurator");
    const lazyObserver = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSceneReady(true);
          lazyObserver.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    if (conf) lazyObserver.observe(conf);
    return () => {
      io.disconnect();
      lazyObserver.disconnect();
    };
  }, []);
  useEffect(() => {
    setSaved(false);
  }, [selected, paint, wheel, interior, lighting]);
  useEffect(() => {
    if (!contact) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContact(false);
    };
    document.addEventListener("keydown", handle);
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handle);
      document.body.style.overflow = before;
      contactTrigger.current?.focus();
    };
  }, [contact]);
  useEffect(() => {
    if (!resetNotice) return;
    const timer = setTimeout(() => setResetNotice(false), 4000);
    return () => clearTimeout(timer);
  }, [resetNotice]);
  const choose = (index: number, section: string) => {
    setSelected(index);
    go(section);
  };
  const camera = (v: string) => {
    setView(v);
    setRevision((r) => r + 1);
  };
  const save = () => {
    const text = `NEW.COM — YOUR BUILD\n${car.year} ${car.brand} ${car.name}\nPaint: ${paints[paint].name}\nWheels: ${wheel}\nInterior: ${interior}\nLighting: ${lighting}\n\n${car.hp} hp · ${car.time}s 0–100 km/h · ${car.speed} km/h\nIndependent concept. Simplified 3D preview; not a manufacturer configuration or order.`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "NEW-COM-your-build.txt";
    a.click();
    URL.revokeObjectURL(url);
    setSaved(true);
  };
  return (
    <>
      <header className="header">
        <a href="#home" className="wordmark" aria-label="NEW.COM home">
          NEW<span>.</span>COM
        </a>
        <nav className={menu ? "nav open" : "nav"} aria-label="Main navigation">
          {[
            ["MODELS", "collection"],
            ["EXPERIENCE", "experience"],
            ["CONFIGURATOR", "configurator"],
            ["ABOUT", "about"],
          ].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <button className="contact-link" onClick={openContact}>
          LET’S TALK <ArrowUpRight size={14} />
        </button>
        <button
          className="mobile-toggle icon-btn"
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <main id="main-content">
        <section className="hero" id="home">
          <div className="hero-topline">
            <span>
              <i className="dot" /> A NEW ERA OF PERFORMANCE
            </span>
            <span>EST. 2026 &nbsp; / &nbsp; INDEPENDENT BY DESIGN</span>
          </div>
          <div
            className="hero-art"
            onMouseMove={(e) => {
              if (matchMedia("(prefers-reduced-motion: reduce)").matches)
                return;
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty(
                "--mx",
                `${(e.clientX - r.left - r.width / 2) * 0.012}px`,
              );
              e.currentTarget.style.setProperty(
                "--my",
                `${(e.clientY - r.top - r.height / 2) * 0.008}px`,
              );
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.setProperty("--mx", "0px");
              e.currentTarget.style.setProperty("--my", "0px");
            }}
          >
            <h1>PURE POWER</h1>
            <div className="hero-glow" />
            <img
              key={car.id}
              className="hero-car"
              src={car.image.replace(".webp", "-cutout.webp")}
              alt={`${car.brand} ${car.name} in a pink-lit studio. AI-generated concept render.`}
              fetchPriority="high"
            />
            <span className="vertical-note">PRECISION IN EVERY DETAIL</span>
            <div className="vehicle-caption">
              <span className="cross">+</span>
              <span>
                {car.brand}
                <b>{car.name}</b>
              </span>
              <span className="year">{car.year}</span>
            </div>
            <div className="hero-pagination">
              <button
                aria-label="Previous featured vehicle"
                onClick={() => setSelected((selected + 3) % 4)}
              >
                <ChevronLeft size={18} />
              </button>
              <span>
                0{selected + 1}
                <i>/ 04</i>
              </span>
              <button
                aria-label="Next featured vehicle"
                onClick={() => setSelected((selected + 1) % 4)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="hero-bottom">
            <div className="hero-copy">
              <p className="eyebrow pink">ENGINEERED TO MOVE YOU.</p>
              <h2>DRIVE THE FUTURE.</h2>
              <p>
                Discover extraordinary machines.
                <br />
                Experience performance without compromise.
              </p>
              <div className="hero-buttons">
                <button
                  className="button primary"
                  onClick={() => go("performance")}
                >
                  EXPLORE VEHICLE <ArrowUpRight size={16} />
                </button>
                <button
                  className="text-button"
                  onClick={() => go("configurator")}
                >
                  CUSTOMIZE YOUR CAR <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
            <div className="hero-performance">
              <div className="stats">
                <Stat value={car.hp} unit="HP" label="MAXIMUM POWER" />
                <Stat value={car.time} unit="SEC" label="0–100 KM/H" />
                <Stat value={car.speed} unit="KM/H" label="TOP SPEED" />
              </div>
              <button className="spec-link" onClick={() => go("performance")}>
                VIEW SPECIFICATIONS <Plus size={14} />
              </button>
            </div>
          </div>
          <div className="hero-baseline">
            <a href="#collection">
              <ArrowDown size={13} /> SCROLL TO DISCOVER
            </a>
            <span>NOT JUST DRIVEN. FELT.</span>
          </div>
        </section>
        <div className="brand-strip" aria-label="Featured manufacturers">
          <span>PORSCHE</span>
          <span className="bmw-brand">
            BMW <i>M</i>
          </span>
          <span>
            Mercedes<span className="amg-brand"> AMG</span>
          </span>
          <span className="lambo-brand">Lamborghini</span>
          <span className="strip-note">
            EXTRAORDINARY MACHINES.
            <br />
            ONE DESTINATION.
          </span>
        </div>
        <section id="collection" className="collection section-pad">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">
                <span className="pink">01 /</span> THE COLLECTION
              </p>
              <h2>
                ICONS. <span>REIMAGINED.</span>
              </h2>
            </div>
            <p>
              Four distinct personalities. One shared obsession.
              <br />
              Discover what moves you.
            </p>
          </div>
          <div className="collection-grid">
            {[1, 2, 0, 3].map((i, j) => (
              <VehiclePanel
                key={i}
                car={vehicles[i]}
                number={j + 1}
                onExplore={() => choose(i, "performance")}
                onConfigure={() => choose(i, "configurator")}
              />
            ))}
          </div>
        </section>
        <section id="configurator" className="configurator section-pad">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">
                <span className="pink">02 /</span> MAKE IT YOURS
              </p>
              <h2>
                YOUR VISION. <span>NO LIMITS.</span>
              </h2>
            </div>
            <p>
              The extraordinary is personal.
              <br />
              Create your own expression of performance.
            </p>
          </div>
          <div className="config-grid">
            <div className="viewer-wrap">
              <div className="viewer-label">
                <div>
                  <p className="eyebrow">{car.brand}</p>
                  <h3>{car.name}</h3>
                </div>
                <span>
                  <i className="dot" />{" "}
                  {sceneStatus === "fallback"
                    ? "STUDIO FALLBACK"
                    : sceneStatus === "ready"
                      ? "LIVE 3D CONCEPT"
                      : "LOADING 3D"}
                </span>
              </div>
              <div className="viewer">
                {sceneReady ? (
                  <VehicleViewer
                    id={car.id}
                    image={car.image}
                    name={`${car.brand} ${car.name}`}
                    color={paints[paint].color}
                    wheel={wheel}
                    interior={interior}
                    lighting={lighting}
                    view={view}
                    revision={revision}
                    onStatus={setSceneStatus}
                  />
                ) : (
                  <img src={car.image} alt={car.name} />
                )}
              </div>
              <fieldset
                className="viewer-controls"
                disabled={sceneStatus !== "ready"}
                aria-label="3D camera controls"
              >
                <span>
                  <Move3D size={16} /> DRAG TO ROTATE · SCROLL TO ZOOM
                </span>
                <div>
                  {["Front", "Side", "Rear", "Interior"].map((v) => (
                    <button
                      key={v}
                      className={view === v ? "active" : ""}
                      onClick={() => camera(v)}
                    >
                      {v}
                    </button>
                  ))}
                  <button aria-label="Zoom in" onClick={() => camera("ZoomIn")}>
                    <Plus size={14} />
                  </button>
                  <button
                    aria-label="Zoom out"
                    onClick={() => camera("ZoomOut")}
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    aria-label="Reset camera"
                    onClick={() => camera("Reset")}
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </fieldset>
              <div className="live-summary" aria-live="polite">
                <span>
                  {paints[paint].name} <i> / </i> {wheel} wheels <i> / </i>{" "}
                  {interior} interior
                </span>
                <span>YOUR SIGNATURE.</span>
              </div>
              <p className="preview-note">
                Original, simplified 3D concept models — not exact manufacturer
                geometry. Paint, wheel geometry, interior material, lighting and
                camera controls are live. Wheel designs are original concepts;
                production interiors are not reproduced. Interior view removes
                the roof and glazing to reveal the seat materials.
              </p>
            </div>
            <div className="config-controls">
              <label className="control-title" htmlFor="vehicle">
                <span>01</span> SELECT YOUR MACHINE
              </label>
              <select
                id="vehicle"
                value={selected}
                onChange={(e) => setSelected(Number(e.target.value))}
              >
                {vehicles.map((v, i) => (
                  <option value={i} key={v.id}>
                    {v.brand} {v.name}
                  </option>
                ))}
              </select>
              <div className="control-title">
                <span>02</span> EXTERIOR PAINT{" "}
                <small>{paints[paint].name}</small>
              </div>
              <div className="swatches">
                {paints.map((p, i) => (
                  <button
                    aria-label={p.name}
                    aria-pressed={paint === i}
                    key={p.name}
                    style={{ "--swatch": p.color } as React.CSSProperties}
                    className={paint === i ? "swatch selected" : "swatch"}
                    onClick={() => setPaint(i)}
                  >
                    {paint === i && (
                      <Check
                        size={16}
                        color={i === 1 || i === 5 ? "#111" : "white"}
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="control-title">
                <span>03</span> WHEEL DESIGN
              </div>
              <div className="segmented">
                {["Sport", "Performance", "Forged"].map((w) => (
                  <button
                    key={w}
                    aria-pressed={wheel === w}
                    className={wheel === w ? "active" : ""}
                    onClick={() => setWheel(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
              <div className="control-title">
                <span>04</span> INTERIOR MATERIAL
              </div>
              <div className="segmented">
                {["Onyx", "Cognac", "Chalk"].map((c) => (
                  <button
                    key={c}
                    aria-pressed={interior === c}
                    className={interior === c ? "active" : ""}
                    onClick={() => {
                      setInterior(c);
                      camera("Interior");
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <label className="control-title" htmlFor="lighting">
                <span>05</span> STUDIO LIGHTING
              </label>
              <select
                id="lighting"
                value={lighting}
                onChange={(e) => setLighting(e.target.value)}
              >
                {["Pink studio", "Cool night", "Daylight"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <button className="button primary save" onClick={save}>
                {saved ? "BUILD DOWNLOADED" : "SAVE YOUR CONFIGURATION"}{" "}
                {saved ? <Check size={16} /> : <ArrowUpRight size={16} />}
              </button>
              <button
                className="reset-config"
                onClick={() => {
                  setSelected(0);
                  setPaint(0);
                  setWheel("Sport");
                  setInterior("Onyx");
                  setLighting("Pink studio");
                  camera("Reset");
                  setSaved(false);
                  setResetNotice(true);
                }}
              >
                <RotateCcw size={13} /> RESET CONFIGURATION
              </button>
              <p className="control-note" role="status">
                {resetNotice
                  ? "Configuration reset to showroom defaults."
                  : "No rules. Just your imagination."}
              </p>
            </div>
          </div>
        </section>
        <section className="experience" id="experience">
          <div className="experience-top">
            <p className="eyebrow">
              <span className="pink">03 /</span> THE EXPERIENCE
            </p>
            <span>DESIGNED TO BE FELT.</span>
          </div>
          <div className="experience-title reveal">
            <h2>
              BEYOND
              <br />
              <em>THE ORDINARY.</em>
            </h2>
          </div>
          <img
            key={gallery}
            src={galleryScenes[gallery].image}
            alt={galleryScenes[gallery].alt}
            loading="lazy"
          />
          <div className="experience-bottom">
            <div>
              <p className="eyebrow">{galleryScenes[gallery].label}</p>
              <p>{galleryScenes[gallery].caption}</p>
            </div>
            <div className="gallery-controls">
              <div className="gallery-dots" aria-label="Choose gallery scene">
                {galleryScenes.map((scene, i) => (
                  <button
                    key={scene.image}
                    aria-label={`Gallery scene ${i + 1}: ${scene.label}`}
                    aria-pressed={gallery === i}
                    className={gallery === i ? "active" : ""}
                    onClick={() => setGallery(i)}
                  />
                ))}
              </div>
              <span>
                0{gallery + 1} <i>/ 04</i>
              </span>
              <button
                className="icon-btn"
                aria-label="Previous gallery image"
                onClick={() => setGallery((gallery + 3) % 4)}
              >
                <ChevronLeft />
              </button>
              <button
                className="icon-btn"
                aria-label="Next gallery image"
                onClick={() => setGallery((gallery + 1) % 4)}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </section>
        <section className="performance section-pad" id="performance">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">
                <span className="pink">04 /</span> UNDER THE SURFACE
              </p>
              <h2>
                NUMBERS THAT <span>MOVE YOU.</span>
              </h2>
            </div>
            <label className="spec-select">
              EXPLORE SPECIFICATIONS
              <select
                aria-label="Vehicle specifications"
                value={selected}
                onChange={(e) => setSelected(Number(e.target.value))}
              >
                {vehicles.map((v, i) => (
                  <option value={i} key={v.id}>
                    {v.brand} {v.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="big-stats" key={car.id}>
            <div>
              <strong>
                <Counter value={car.hp} />
                <small>HP</small>
              </strong>
              <span>MAXIMUM POWER</span>
            </div>
            <div>
              <strong>
                {car.time}
                <small>SEC</small>
              </strong>
              <span>0–100 KM/H</span>
            </div>
            <div>
              <strong>
                <Counter value={car.speed} />
                <small>KM/H</small>
              </strong>
              <span>MAXIMUM SPEED</span>
            </div>
          </div>
          <div className="spec-table">
            {[
              ["MODEL YEAR", car.year],
              ["ENGINE", car.engine],
              ["TORQUE", `${car.torque} Nm`],
              ["DRIVETRAIN", car.drive],
              ["TRANSMISSION", car.transmission],
              ["CATEGORY", car.category],
            ].map(([k, v]) => (
              <div key={k}>
                <span>{k}</span>
                <strong>{v}</strong>
              </div>
            ))}
          </div>
          <p className="spec-note">
            Manufacturer-published metric specifications for the stated model.
            Power shown in mechanical hp (rounded from {car.ps} PS).{" "}
            {car.id === "bmw"
              ? "250 km/h standard electronic limit; optional M Driver’s Package excluded. "
              : ""}
            <a href={car.source} target="_blank" rel="noreferrer">
              Manufacturer reference <ArrowUpRight size={12} />
            </a>
          </p>
        </section>
        <section id="about" className="about section-pad">
          <div className="about-image">
            <img
              src="/images/hero.webp"
              loading="lazy"
              alt="Silver sports car in a dramatic pink-lit studio"
            />
            <span>THE ART OF MOVING FORWARD.</span>
          </div>
          <div className="about-copy reveal">
            <p className="eyebrow">
              <span className="pink">05 /</span> THIS IS NEW.COM
            </p>
            <h2>
              MORE THAN
              <br />A <span>MACHINE.</span>
            </h2>
            <p>
              We bring together design, engineering, and digital innovation to
              celebrate extraordinary automobiles.
            </p>
            <p>
              Not a dealership. A different perspective. An independent digital
              space for those who see a car as more than a way to get somewhere.
            </p>
            <button className="text-button" onClick={openContact}>
              LET’S START A CONVERSATION <ArrowUpRight size={16} />
            </button>
          </div>
        </section>
        <section id="contact" className="contact-section section-pad">
          <div>
            <p className="eyebrow">
              <span className="pink">06 /</span> START A CONVERSATION
            </p>
            <h2>
              WHAT <span>MOVES YOU?</span>
            </h2>
          </div>
          <div>
            <p>
              Design. Performance. A different point of view.
              <br />
              We’d love to know what brought you here.
            </p>
            <button className="button primary" onClick={openContact}>
              CREATE A MESSAGE DRAFT <Mail size={16} />
            </button>
            <p className="contact-honesty">
              Independent concept demo. Your draft downloads to your device;
              messages are not sent or stored by NEW.COM.
            </p>
          </div>
        </section>
        <section className="final-cta">
          <p className="eyebrow">THE NEXT CHAPTER IS YOURS.</p>
          <a href="#configurator">
            MAKE YOUR MOVE.
            <ArrowUpRight />
          </a>
        </section>
      </main>
      <footer className="section-pad">
        <div className="footer-top">
          <div>
            <a className="wordmark" href="#home">
              NEW<span>.</span>COM
            </a>
            <p>DRIVE THE FUTURE.</p>
          </div>
          <div>
            <p className="eyebrow">EXPLORE</p>
            <a href="#collection">The collection</a>
            <a href="#configurator">Configurator</a>
            <a href="#experience">The experience</a>
          </div>
          <div>
            <p className="eyebrow">THE MACHINES</p>
            {vehicles.map((v, i) => (
              <button key={v.id} onClick={() => choose(i, "performance")}>
                {v.brand} {v.name}
              </button>
            ))}
          </div>
          <div>
            <p className="eyebrow">CONNECT</p>
            <a href="#about">About NEW.COM</a>
            <button onClick={openContact}>
              Get in touch <ArrowUpRight size={12} />
            </button>
            <a href="#contact">Contact & concept information</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 NEW.COM. An independent concept.</span>
          <span>DESIGNED FOR THE DRIVE.</span>
          <a href="#home">BACK TO TOP ↑</a>
        </div>
        <p className="disclaimer">
          Independent concept demonstration. Not affiliated with, endorsed by,
          or an official website of any vehicle manufacturer. All marques belong
          to their respective owners. Studio imagery is AI-generated and may
          differ from production vehicles. No vehicles are offered for sale.
        </p>
      </footer>
      {contact && (
        <div className="modal-backdrop" onClick={() => setContact(false)}>
          <dialog
            open
            aria-modal="true"
            aria-labelledby="contact-title"
            className="contact-modal"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                const nodes = e.currentTarget.querySelectorAll<HTMLElement>(
                  "button,input,textarea",
                );
                const first = nodes[0],
                  last = nodes[nodes.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first.focus();
                }
              }
            }}
          >
            <button
              className="icon-btn close"
              aria-label="Close contact"
              onClick={() => setContact(false)}
            >
              <X />
            </button>
            <p className="eyebrow pink">LET’S CONNECT</p>
            <h2 id="contact-title">
              START SOMETHING
              <br />
              EXTRAORDINARY.
            </h2>
            {sent ? (
              <div className="sent-message" role="status">
                <Check />
                <h3>Your message is ready.</h3>
                <p>
                  This concept has no messaging backend. Your message has been
                  downloaded for you to keep; it has not been sent.
                </p>
                <button
                  className="button primary"
                  autoFocus
                  onClick={() => {
                    setSent(false);
                    setContact(false);
                  }}
                >
                  BACK TO THE SHOWROOM <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  const blob = new Blob(
                    [
                      `NEW.COM contact draft\nName: ${f.get("name")}\nEmail: ${f.get("email")}\n\n${f.get("message")}`,
                    ],
                    { type: "text/plain" },
                  );
                  const u = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = u;
                  a.download = "NEW-COM-message.txt";
                  a.click();
                  URL.revokeObjectURL(u);
                  setSent(true);
                }}
              >
                <label>
                  Your name
                  <input
                    name="name"
                    autoFocus
                    required
                    placeholder="Alex Morgan"
                  />
                </label>
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  What moves you?
                  <textarea
                    name="message"
                    required
                    placeholder="Tell us what’s on your mind."
                    rows={4}
                  />
                </label>
                <p className="preview-note">
                  Concept demo: download a message draft. No data is sent or
                  stored.
                </p>
                <button className="button primary" type="submit">
                  CREATE MESSAGE DRAFT <Mail size={16} />
                </button>
              </form>
            )}
          </dialog>
        </div>
      )}
    </>
  );
}
function VehiclePanel({
  car,
  number,
  onExplore,
  onConfigure,
}: {
  car: Vehicle;
  number: number;
  onExplore: () => void;
  onConfigure: () => void;
}) {
  const [angle, setAngle] = useState(0);
  const views = vehicleViews[car.id];
  return (
    <article
      id={`vehicle-${car.id}`}
      className="vehicle-panel reveal"
      aria-label={`${car.brand} ${car.name} cinematic showcase`}
    >
      <div className="panel-top">
        <span>
          0{number} / {car.brand}
        </span>
        <span>{car.year} · INDEPENDENT CONCEPT</span>
      </div>
      <div className="panel-image">
        <h3 aria-hidden="true">
          {car.id === "bmw"
            ? "DOMINATE"
            : car.id === "amg"
              ? "PRECISION"
              : car.id === "porsche"
                ? "PERFORM"
                : "UNLIMITED"}
        </h3>
        <img
          key={angle}
          src={views[angle].image}
          alt={`${car.brand} ${car.name} — ${views[angle].label}. AI-generated editorial render.`}
          loading="lazy"
          decoding="async"
        />
        <div
          className="vehicle-angles"
          aria-label={`${car.brand} gallery angles`}
        >
          {views.map((v, i) => (
            <button
              key={v.image}
              aria-label={`View ${v.label}`}
              aria-pressed={angle === i}
              className={angle === i ? "active" : ""}
              onClick={() => setAngle(i)}
            >
              <span>0{i + 1}</span>
              {v.label}
              <ArrowUpRight size={12} />
            </button>
          ))}
        </div>
      </div>
      <div className="panel-details">
        <div>
          <p className="eyebrow pink">{car.headline}</p>
          <h4>
            {car.brand}
            <span>{car.name}</span>
          </h4>
          <p className="panel-description">{car.description}</p>
        </div>
        <div className="mini-stats">
          <span>
            <b>{car.hp}</b> HP
          </span>
          <span>
            <b>{car.time}</b> SEC
            <br />
            <small>0–100 KM/H</small>
          </span>
          <span>
            <b>{car.speed}</b> KM/H
          </span>
        </div>
        <p className="panel-powertrain">
          {car.engine}
          <br />
          {car.drive}
        </p>
        <div className="panel-buttons">
          <button className="text-button" onClick={onExplore}>
            EXPLORE <ArrowUpRight size={15} />
          </button>
          <button className="text-button" onClick={onConfigure}>
            CONFIGURE <Plus size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
