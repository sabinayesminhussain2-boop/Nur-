import { useState, type FormEvent } from "react";
import { ArrowRight, AlertCircle, Check } from "lucide-react";
import Reveal from "./Reveal";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = "idle" | "error" | "demo-success";

export default function Newsletter({ dark = true }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    if (!consent) {
      setStatus("error");
      setMessage("Please confirm you would like to receive UXT updates.");
      return;
    }
    // No email marketing integration exists in this prototype.
    // Do not pretend the address was stored or transmitted.
    setStatus("demo-success");
  };

  const tone = dark
    ? "border-ivory/20 text-ivory placeholder:text-ivory/40"
    : "border-ink/25 text-ink placeholder:text-ink/40";

  return (
    <section className={dark ? "bg-coal text-ivory" : "bg-ivory text-ink"}>
      <div className="uxt-container py-20 md:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-taupe">Newsletter</p>
          <h2 className="display-md mt-4">LET GOOD DESIGN FIND YOU.</h2>
          <p className="lead mt-5">
            Receive new collection releases, design inspiration, and stories
            from the world of UXT.
          </p>

          {status === "demo-success" ? (
            <div
              className="mt-10 border border-accent/50 bg-accent/10 p-7 text-left"
              role="status"
            >
              <p className="flex items-center gap-2 font-medium">
                <Check size={18} strokeWidth={2} className="text-accent" />
                Demonstration — no subscription was stored
              </p>
              <p className="mt-3 text-sm leading-relaxed opacity-80">
                Your email passed validation, but this prototype has no email
                marketing integration connected, so nothing was saved or
                transmitted. To activate subscriptions, connect a provider
                (such as Klaviyo or Mailchimp) and POST the address to a
                backend endpoint — the validation and consent flow here is
                production-ready and can be reused as-is.
              </p>
              <button
                className="link-arrow mt-5 text-sm"
                onClick={() => {
                  setStatus("idle");
                  setEmail("");
                  setConsent(false);
                }}
              >
                Enter another address <span className="arrow">→</span>
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="mt-10 text-left">
              <div className="flex flex-col gap-4 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Your email address"
                  aria-invalid={status === "error"}
                  aria-describedby="newsletter-note newsletter-error"
                  className={`field field-light flex-1 ${tone}`}
                />
                <button type="submit" className={`btn ${dark ? "btn-solid" : "btn-dark"} shrink-0`}>
                  Subscribe <ArrowRight size={15} strokeWidth={1.5} />
                </button>
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs leading-relaxed opacity-80">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    if (status === "error") setStatus("idle");
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#C7B8A4]"
                />
                <span id="newsletter-note">
                  I agree to receive UXT.com updates and understand I can
                  unsubscribe at any time. See the privacy policy for how data
                  is handled once a provider is connected.
                </span>
              </label>

              {status === "error" && (
                <p
                  id="newsletter-error"
                  role="alert"
                  className="mt-3 flex items-center gap-2 text-sm text-accent"
                >
                  <AlertCircle size={15} strokeWidth={1.75} /> {message}
                </p>
              )}
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
