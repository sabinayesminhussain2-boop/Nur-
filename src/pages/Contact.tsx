import { useState, type FormEvent } from "react";
import { AlertCircle, Check, Mail, Clock, MessageSquare } from "lucide-react";
import PageHero, { Breadcrumbs } from "../components/PageHero";
import Reveal from "../components/Reveal";
import Accordion from "../components/Accordion";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const FAQS = [
  {
    q: "How do I choose the right sofa size?",
    a: "Measure the wall the sofa will sit against and keep at least 75 cm of clear circulation in front. Our product pages list full dimensions in centimetres, and the Design Studio room planner checks each piece against your room measurements.",
  },
  {
    q: "Can I order fabric or material samples?",
    a: "A sample service is planned alongside the commerce launch. In this prototype, materials are described in full on each product page and in the Design Journal materials guide.",
  },
  {
    q: "Do pieces require assembly?",
    a: "Assembly requirements are listed in the specifications accordion on every product page. Most seating arrives fully assembled; tables and beds require simple leg or frame attachment with included fittings.",
  },
  {
    q: "Are prices and stock levels real?",
    a: "No. This is a demonstration storefront: all prices are illustrative demo prices and availability labels use sample inventory. Neither is connected to a live commerce or inventory system.",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useDocumentMeta({
    title: "Contact",
    description:
      "Contact the UXT studio with questions about pieces, materials, trade enquiries and orders. Demo storefront — messages are not transmitted in this prototype.",
    path: "/contact",
  });

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (!EMAIL_RE.test(form.email.trim()))
      next.email = "Please enter a valid email address.";
    if (form.subject.trim().length < 2) next.subject = "Please add a subject.";
    if (form.message.trim().length < 10)
      next.message = "Please write a message of at least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  const inputCls = (field: string) =>
    `field field-light w-full bg-ivory/5 ${
      errors[field] ? "border-accent" : ""
    }`;

  return (
    <>
      <PageHero
        eyebrow="Speak with the studio"
        title="Contact UXT"
        description="Questions about a piece, a material or a project — send them through and the studio team will respond. This prototype demonstrates the full form experience without transmitting data."
      >
        <Breadcrumbs dark items={[{ label: "Contact" }]} />
      </PageHero>

      <section className="bg-ivory text-ink">
        <div className="uxt-container grid gap-14 pb-24 md:grid-cols-12 md:gap-16">
          {/* Form */}
          <Reveal className="md:col-span-7">
            {submitted ? (
              <div
                className="border border-ink/15 bg-mist/60 p-8 md:p-10"
                role="status"
              >
                <p className="flex items-center gap-2 font-serif text-2xl">
                  <Check size={20} strokeWidth={2} className="text-taupe" />
                  Message validated — demonstration only
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink/70">
                  Your message passed validation, but this storefront is not
                  connected to an email service, CRM or ticketing system, so
                  nothing was sent or stored. To go live, connect a transactional
                  email provider (such as Resend or Postmark) or a CRM endpoint
                  and submit this form to it from a backend route. The
                  validation, layout and error handling here are production-ready.
                </p>
                <button
                  className="btn btn-outline-dark mt-7"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="eyebrow text-taupe">
                      Name
                    </label>
                    <input
                      id="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className={inputCls("name")}
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                    />
                    {errors.name && <ErrorText>{errors.name}</ErrorText>}
                  </div>
                  <div>
                    <label htmlFor="email" className="eyebrow text-taupe">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className={inputCls("email")}
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email && <ErrorText>{errors.email}</ErrorText>}
                  </div>
                </div>
                <div className="mt-6">
                  <label htmlFor="subject" className="eyebrow text-taupe">
                    Subject
                  </label>
                  <input
                    id="subject"
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    className={inputCls("subject")}
                    aria-invalid={Boolean(errors.subject)}
                  />
                  {errors.subject && <ErrorText>{errors.subject}</ErrorText>}
                </div>
                <div className="mt-6">
                  <label htmlFor="message" className="eyebrow text-taupe">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className={inputCls("message")}
                    aria-invalid={Boolean(errors.message)}
                  />
                  {errors.message && <ErrorText>{errors.message}</ErrorText>}
                </div>
                <button type="submit" className="btn btn-dark mt-8">
                  <MessageSquare size={15} strokeWidth={1.5} /> Send message
                </button>
              </form>
            )}
          </Reveal>

          {/* Details */}
          <Reveal delay={150} className="md:col-span-5">
            <div className="flex flex-col gap-8">
              <div className="border border-ink/10 p-7">
                <Mail size={20} strokeWidth={1.5} className="text-taupe" />
                <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.2em]">
                  Studio enquiries
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">
                  hello@uxt.com
                  <br />
                  trade@uxt.com
                </p>
                <p className="mt-3 text-xs text-taupe">
                  Illustrative contact addresses for the demo — replace with
                  real accounts before launch.
                </p>
              </div>
              <div className="border border-ink/10 p-7">
                <Clock size={20} strokeWidth={1.5} className="text-taupe" />
                <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.2em]">
                  Studio hours
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">
                  Monday – Friday · 9:00 – 18:00
                  <br />
                  Saturday · 10:00 – 16:00
                </p>
                <p className="mt-3 text-xs text-taupe">
                  Sample hours for demonstration purposes.
                </p>
              </div>
              <div className="bg-ink p-7 text-ivory">
                <h2 className="eyebrow text-accent">Design Studio</h2>
                <p className="mt-3 text-sm leading-relaxed text-warmgray">
                  For help choosing pieces, discovering your style or checking
                  furniture against room dimensions, open the on-site design
                  tools.
                </p>
                <a href="/studio" className="btn btn-solid mt-5">
                  Open the Design Studio
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Policy anchors */}
      <section className="bg-mist/50 text-ink">
        <div className="uxt-container grid gap-12 py-20 md:grid-cols-2 md:gap-16">
          <Reveal id="faq">
            <h2 className="display-md">FAQ</h2>
            <div className="mt-8">
              {FAQS.map((f) => (
                <Accordion key={f.q} title={f.q}>
                  {f.a}
                </Accordion>
              ))}
            </div>
          </Reveal>

          <div className="flex flex-col gap-12">
            <Reveal id="shipping">
              <h2 className="font-serif text-3xl">Shipping & Returns</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">
                Demo terms: in-stock pieces are shown with a 3–7 working day
                delivery window and made-to-order pieces with 6–8 weeks.
                Returns are accepted within 14 days on unused items in original
                packaging. These terms are placeholders for the prototype —
                real rates, regions and carrier options must be configured with
                a fulfilment provider.
              </p>
            </Reveal>
            <Reveal id="privacy">
              <h2 className="font-serif text-3xl">Privacy Policy</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">
                This prototype stores only the shopping cart and wishlist
                locally in your browser via localStorage. No forms transmit
                personal data, no analytics or tracking scripts are installed,
                and no data leaves the device. A production privacy policy must
                be published once a checkout, newsletter provider or analytics
                service is connected.
              </p>
            </Reveal>
            <Reveal id="terms">
              <h2 className="font-serif text-3xl">Terms & Conditions</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">
                UXT.com is currently a demonstration storefront. Products,
                prices, lead times and inventory shown are illustrative and do
                not constitute an offer to sell. No orders can be placed and no
                payments are processed. Commercial terms will apply from the
                launch date of the connected commerce platform.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-2 flex items-center gap-1.5 text-xs text-[#8a5a44]">
      <AlertCircle size={13} strokeWidth={1.75} /> {children}
    </p>
  );
}
