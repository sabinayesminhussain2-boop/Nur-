import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Sparkles, Heart, ShoppingBag } from "lucide-react";
import Logo from "./Logo";
import { NAV_LINKS } from "../data/site";
import { useShop } from "../context/ShopContext";
import { useUi } from "../context/UiContext";

export default function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const location = useLocation();
  const { cartCount, wishlist } = useShop();
  const { openAssistant, openSearch } = useUi();

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`mobile-menu fixed inset-0 z-[70] flex flex-col bg-ink text-ivory md:hidden ${
        open ? "open" : ""
      }`}
      aria-hidden={!open}
      inert={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-between px-6 py-5">
        <Logo />
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="p-2 -mr-2"
        >
          <X size={22} strokeWidth={1.5} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-6 pb-10">
        <ul className="divide-y divide-ivory/10 border-y border-ivory/10">
          {NAV_LINKS.map((link, i) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="menu-item flex items-center justify-between py-5 font-serif text-3xl"
                style={{ transitionDelay: `${120 + i * 60}ms` }}
              >
                {link.label}
                <span className="text-xs uppercase tracking-[0.25em] text-warmgray">
                  0{i + 1}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            className="btn btn-outline-light"
            onClick={() => {
              onClose();
              openSearch();
            }}
          >
            Search
          </button>
          <button
            className="btn btn-outline-light"
            onClick={() => {
              onClose();
              openAssistant();
            }}
          >
            <Sparkles size={14} strokeWidth={1.5} /> Assistant
          </button>
          <Link to="/wishlist" className="btn btn-outline-light">
            <Heart size={14} strokeWidth={1.5} /> Wishlist
            {wishlist.length > 0 && ` (${wishlist.length})`}
          </Link>
          <Link to="/cart" className="btn btn-outline-light">
            <ShoppingBag size={14} strokeWidth={1.5} /> Cart
            {cartCount > 0 && ` (${cartCount})`}
          </Link>
        </div>

        <p className="mt-10 text-xs leading-relaxed text-warmgray">
          Furniture that transforms the way you experience space.
        </p>
      </nav>
    </div>
  );
}
