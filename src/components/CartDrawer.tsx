import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { formatPrice } from "../lib/format";
import SmartImage from "./SmartImage";

export default function CartDrawer() {
  const {
    drawerOpen,
    closeDrawer,
    cartDetailed,
    subtotal,
    setQty,
    removeFromCart,
    cartCount,
  } = useShop();

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <>
      <div
        className={`overlay-fade fixed inset-0 z-[75] bg-ink/70 backdrop-blur-sm ${
          drawerOpen ? "open" : ""
        }`}
        onClick={closeDrawer}
        aria-hidden={!drawerOpen}
      />
      <aside
        className={`drawer-panel fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-coal text-ivory ${
          drawerOpen ? "open" : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
      >
        <div className="flex items-center justify-between border-b border-ivory/10 px-6 py-5">
          <h2 className="eyebrow">Your Cart ({cartCount})</h2>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="p-2 -mr-2 transition-opacity hover:opacity-70"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {cartDetailed.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <ShoppingBag size={36} strokeWidth={1.25} className="text-taupe" />
            <p className="font-serif text-2xl">Your cart is quietly empty.</p>
            <p className="text-sm text-warmgray">
              Considered pieces, saved for when you are ready.
            </p>
            <Link
              to="/shop"
              onClick={closeDrawer}
              className="btn btn-solid mt-2"
            >
              Explore the shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <ul>
                {cartDetailed.map((line) => (
                  <li
                    key={`${line.productId}-${line.color}`}
                    className="flex gap-4 border-b border-ivory/10 py-5"
                  >
                    <Link
                      to={`/product/${line.product.slug}`}
                      onClick={closeDrawer}
                      className="img-frame h-28 w-24 shrink-0"
                    >
                      <SmartImage
                        src={line.product.image}
                        alt={line.product.name}
                        fallbackLabel={line.product.name}
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          to={`/product/${line.product.slug}`}
                          onClick={closeDrawer}
                          className="font-medium leading-snug transition-opacity hover:opacity-70"
                        >
                          {line.product.name}
                        </Link>
                        <button
                          onClick={() =>
                            removeFromCart(line.productId, line.color)
                          }
                          aria-label={`Remove ${line.product.name}`}
                          className="text-warmgray transition-colors hover:text-ivory"
                        >
                          <Trash2 size={16} strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-warmgray">
                        {line.color}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="inline-flex items-center border border-ivory/20">
                          <button
                            className="flex h-8 w-8 items-center justify-center disabled:opacity-30"
                            onClick={() =>
                              setQty(
                                line.productId,
                                line.color,
                                line.qty - 1,
                              )
                            }
                            disabled={line.qty <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} strokeWidth={1.5} />
                          </button>
                          <span className="w-8 text-center text-sm tabular-nums">
                            {line.qty}
                          </span>
                          <button
                            className="flex h-8 w-8 items-center justify-center"
                            onClick={() =>
                              setQty(
                                line.productId,
                                line.color,
                                line.qty + 1,
                              )
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} strokeWidth={1.5} />
                          </button>
                        </div>
                        <span className="text-sm font-medium tabular-nums">
                          {formatPrice(line.lineTotal)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="py-4 text-xs leading-relaxed text-warmgray">
                Demo catalog — prices and inventory are illustrative. No
                payment is collected in this prototype.
              </p>
            </div>

            <div className="border-t border-ivory/10 px-6 py-5">
              <div className="flex items-center justify-between pb-4">
                <span className="eyebrow">Subtotal</span>
                <span className="font-serif text-2xl tabular-nums">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="pb-4 text-xs text-warmgray">
                Shipping and taxes calculated at checkout. Free local delivery
                on orders over $2,000 in the demo terms.
              </p>
              <Link to="/cart" onClick={closeDrawer} className="btn btn-outline-light w-full">
                View full cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
