import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Trash2, Lock } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { formatPrice } from "../lib/format";
import SmartImage from "../components/SmartImage";
import QuantityStepper from "../components/QuantityStepper";
import PageHero, { Breadcrumbs } from "../components/PageHero";
import Reveal from "../components/Reveal";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export default function Cart() {
  const {
    cartDetailed,
    subtotal,
    setQty,
    removeFromCart,
    cartCount,
    clearCart,
  } = useShop();

  useDocumentMeta({
    title: "Shopping Cart",
    description:
      "Review your selected UXT furniture, update quantities and see the order subtotal. Demo storefront — no payment is processed.",
    path: "/cart",
  });

  const demoShipping = subtotal >= 2000 || subtotal === 0 ? 0 : 140;
  const demoTotal = subtotal + demoShipping;

  return (
    <>
      <PageHero
        eyebrow="Your selection"
        title="Shopping Cart"
        description="Cart contents persist in this browser between visits. Nothing is ordered or charged until a real checkout is connected."
      >
        <Breadcrumbs dark items={[{ label: "Cart" }]} />
      </PageHero>

      <section className="bg-ivory text-ink">
        <div className="uxt-container pb-28">
          {cartDetailed.length === 0 ? (
            <div className="flex flex-col items-center gap-5 py-24 text-center">
              <ShoppingBag size={36} strokeWidth={1.25} className="text-taupe" />
              <h2 className="font-serif text-3xl">Your cart is quietly empty.</h2>
              <p className="max-w-sm text-sm text-taupe">
                Considered pieces, saved for when you are ready.
              </p>
              <Link to="/shop" className="btn btn-dark">
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="grid gap-14 lg:grid-cols-12">
              {/* Lines */}
              <div className="lg:col-span-8">
                <div className="hidden border-b border-ink/10 pb-4 text-xs uppercase tracking-[0.2em] text-taupe sm:grid sm:grid-cols-12">
                  <span className="sm:col-span-6">Product</span>
                  <span className="sm:col-span-3">Quantity</span>
                  <span className="sm:col-span-2 text-right">Total</span>
                  <span className="sm:col-span-1" />
                </div>

                {cartDetailed.map((line) => (
                  <Reveal
                    key={`${line.productId}-${line.color}`}
                    className="grid grid-cols-1 gap-5 border-b border-ink/10 py-7 sm:grid-cols-12 sm:items-center"
                  >
                    <div className="col-span-6 flex gap-5">
                      <Link
                        to={`/product/${line.product.slug}`}
                        className="img-frame h-32 w-28 shrink-0"
                      >
                        <SmartImage
                          src={line.product.image}
                          alt={line.product.name}
                          fallbackLabel={line.product.name}
                        />
                      </Link>
                      <div className="flex flex-col">
                        <Link
                          to={`/product/${line.product.slug}`}
                          className="font-medium leading-snug hover:opacity-70"
                        >
                          {line.product.name}
                        </Link>
                        <p className="mt-1 text-sm text-taupe">{line.color}</p>
                        <p className="mt-1 text-sm text-taupe">
                          {formatPrice(line.product.price)} each
                        </p>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <QuantityStepper
                        qty={line.qty}
                        onChange={(q) =>
                          setQty(line.productId, line.color, q)
                        }
                      />
                    </div>
                    <p className="col-span-2 font-medium tabular-nums sm:text-right">
                      {formatPrice(line.lineTotal)}
                    </p>
                    <div className="col-span-1 flex sm:justify-end">
                      <button
                        onClick={() => removeFromCart(line.productId, line.color)}
                        aria-label={`Remove ${line.product.name}`}
                        className="text-taupe transition-colors hover:text-ink"
                      >
                        <Trash2 size={17} strokeWidth={1.5} />
                      </button>
                    </div>
                  </Reveal>
                ))}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <Link to="/shop" className="link-arrow">
                    <span className="arrow">←</span> Continue shopping
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-xs uppercase tracking-[0.18em] text-taupe underline underline-offset-4 hover:text-ink"
                  >
                    Clear cart
                  </button>
                </div>
              </div>

              {/* Summary */}
              <Reveal delay={150} className="lg:col-span-4">
                <div className="bg-mist/70 p-7 md:p-8">
                  <h2 className="eyebrow">Order Summary</h2>
                  <dl className="mt-6 space-y-4 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-taupe">Items ({cartCount})</dt>
                      <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-taupe">
                        Demo shipping
                        {demoShipping === 0 && subtotal > 0 && " (complimentary)"}
                      </dt>
                      <dd className="tabular-nums">
                        {demoShipping === 0
                          ? "Free"
                          : formatPrice(demoShipping)}
                      </dd>
                    </div>
                    <div className="flex justify-between border-t border-ink/15 pt-4 text-base font-semibold">
                      <dt>Subtotal</dt>
                      <dd className="tabular-nums">{formatPrice(demoTotal)}</dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    disabled
                    title="Checkout is not connected in this prototype"
                    className="btn btn-dark mt-7 w-full cursor-not-allowed opacity-50"
                  >
                    <Lock size={15} strokeWidth={1.5} /> Checkout unavailable
                  </button>
                  <p className="mt-4 text-xs leading-relaxed text-taupe">
                    No payment information is collected. To enable checkout,
                    integrate a supported payment provider (such as Stripe) via
                    a secure backend — never a client-side-only form.
                  </p>
                  <Link
                    to="/collections"
                    className="link-arrow mt-6"
                  >
                    Or explore collections <ArrowRight size={14} strokeWidth={1.5} className="arrow" />
                  </Link>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
