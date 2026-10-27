import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  User,
  Sparkles,
} from "lucide-react";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import { NAV_LINKS } from "../data/site";
import { useShop } from "../context/ShopContext";
import { useUi } from "../context/UiContext";
import { cn } from "../lib/format";

const LIGHT_ROUTES = [
  "/shop",
  "/product",
  "/categories",
  "/about",
  "/journal",
  "/contact",
  "/wishlist",
  "/cart",
];

function isLightRoute(pathname: string) {
  return LIGHT_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const location = useLocation();
  const { cartCount, wishlist, openDrawer, bump } = useShop();
  const { openSearch, openAssistant } = useUi();
  const accountRef = useRef<HTMLDivElement>(null);

  const light = isLightRoute(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setAccountOpen(false), [location.pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (to: string) => {
    const path = to.split("?")[0];
    return location.pathname === path;
  };

  return (
    <>
      <header
        className={cn(
          "site-header fixed inset-x-0 top-0 z-50 border-b border-transparent",
          scrolled && "scrolled",
          light && "on-light",
        )}
      >
        <div className="uxt-container flex items-center justify-between gap-6 py-5">
          <Logo />

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={cn("nav-link", isActive(link.to) && "active")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <IconBtn label="Search" onClick={openSearch}>
              <Search size={19} strokeWidth={1.5} />
            </IconBtn>
            <IconBtn
              label="Interior assistant"
              onClick={openAssistant}
              className="hidden sm:flex"
            >
              <Sparkles size={18} strokeWidth={1.5} />
            </IconBtn>

            {/* Account — no auth backend in this prototype */}
            <div ref={accountRef} className="relative hidden sm:block">
              <IconBtn
                label="Account"
                onClick={() => setAccountOpen((v) => !v)}
                ariaExpanded={accountOpen}
              >
                <User size={19} strokeWidth={1.5} />
              </IconBtn>
              {accountOpen && (
                <div
                  className={cn(
                    "absolute right-0 top-full mt-3 w-72 border p-5 text-sm shadow-2xl",
                    light
                      ? "border-ink/10 bg-ivory text-ink"
                      : "border-ivory/15 bg-coal text-ivory",
                  )}
                >
                  <p className="eyebrow mb-2 opacity-70">Account</p>
                  <p className="leading-relaxed opacity-80">
                    Sign-in and order history are not connected in this
                    prototype. A commerce backend (customer authentication and
                    order management) remains to be integrated.
                  </p>
                  <Link
                    to="/contact"
                    className="link-arrow mt-4"
                    onClick={() => setAccountOpen(false)}
                  >
                    Contact the studio <span className="arrow">→</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/wishlist"
              className="relative flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-70"
              aria-label={`Wishlist, ${wishlist.length} saved items`}
            >
              <Heart size={19} strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              onClick={openDrawer}
              className="relative flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-70"
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span
                  key={bump}
                  className="badge-bump absolute -right-0.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink"
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(true)}
              className="ml-1 flex h-10 w-10 items-center justify-center lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  className,
  ariaExpanded,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  ariaExpanded?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-expanded={ariaExpanded}
      className={cn(
        "flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-70",
        className,
      )}
    >
      {children}
    </button>
  );
}
