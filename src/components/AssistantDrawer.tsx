import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles, ArrowRight, Bot, UserRound } from "lucide-react";
import { useUi } from "../context/UiContext";
import { answerQuestion, ASSISTANT_SUGGESTIONS, type AssistantReply } from "../lib/assistant";
import { formatPrice } from "../lib/format";
import SmartImage from "./SmartImage";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  products?: AssistantReply["products"];
}

const WELCOME: Message = {
  id: 0,
  role: "assistant",
  text: "I'm the UXT interior assistant — an on-site, rule-based guide that searches the real catalog by room, style, material, colour and budget. Ask me anything, or open the Design Studio for style discovery and room planning.",
};

export default function AssistantDrawer() {
  const { assistantOpen, closeAssistant } = useUi();
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [draft, setDraft] = useState("");
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = assistantOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAssistant();
    window.addEventListener("keydown", onKey);
    if (assistantOpen) inputRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [assistantOpen, closeAssistant]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q) return;
    const userMsg: Message = { id: ++idRef.current, role: "user", text: q };
    const reply = answerQuestion(q);
    const botMsg: Message = {
      id: ++idRef.current,
      role: "assistant",
      text: reply.message,
      products: reply.products,
    };
    setMessages((m) => [...m, userMsg, botMsg]);
    setDraft("");
  };

  return (
    <>
      <div
        className={`overlay-fade fixed inset-0 z-[75] bg-ink/70 backdrop-blur-sm ${
          assistantOpen ? "open" : ""
        }`}
        onClick={closeAssistant}
        aria-hidden={!assistantOpen}
      />
      <aside
        className={`drawer-panel fixed right-0 top-0 z-[80] flex h-full w-full max-w-lg flex-col bg-coal text-ivory ${
          assistantOpen ? "open" : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="UXT interior assistant"
        aria-hidden={!assistantOpen}
        inert={!assistantOpen}
      >
        <div className="border-b border-ivory/10 px-6 py-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 eyebrow">
              <Sparkles size={15} strokeWidth={1.5} className="text-accent" />
              Interior Assistant
            </h2>
            <button
              onClick={closeAssistant}
              aria-label="Close assistant"
              className="p-2 -mr-2 transition-opacity hover:opacity-70"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-warmgray">
            On-site catalog guidance — no external AI model is connected.
            Recommendations come from live catalog filters. A hosted LLM can be
            attached via a backend endpoint before launch.
          </p>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-6">
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === "user" ? "flex justify-end" : ""}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] bg-charcoal px-4 py-3 text-sm"
                      : "max-w-full"
                  }
                >
                  {m.role === "assistant" && (
                    <Bot size={16} strokeWidth={1.5} className="mb-2 text-accent" />
                  )}
                  {m.role === "user" && (
                    <UserRound size={14} strokeWidth={1.5} className="mb-1 opacity-60" />
                  )}
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  {m.products && m.products.length > 0 && (
                    <ul className="mt-4 space-y-3">
                      {m.products.map((p) => (
                        <li key={p.id}>
                          <Link
                            to={`/product/${p.slug}`}
                            onClick={closeAssistant}
                            className="group flex items-center gap-3 border border-ivory/10 bg-ink/40 p-2 transition-colors hover:border-accent/50"
                          >
                            <div className="img-frame h-16 w-16 shrink-0">
                              <SmartImage
                                src={p.image}
                                alt={p.name}
                                fallbackLabel={p.name}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {p.name}
                              </p>
                              <p className="text-xs text-warmgray">
                                {formatPrice(p.price)} ·{" "}
                                {p.dimensions.width}×{p.dimensions.depth} cm
                              </p>
                            </div>
                            <ArrowRight
                              size={15}
                              strokeWidth={1.5}
                              className="mr-2 text-warmgray transition-transform group-hover:translate-x-1"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>

          {messages.length <= 1 && (
            <div className="mt-6">
              <p className="eyebrow mb-3 text-warmgray">Suggested questions</p>
              <div className="flex flex-col gap-2">
                {ASSISTANT_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="border border-ivory/15 px-4 py-3 text-left text-sm text-warmgray transition-colors hover:border-accent hover:text-ivory"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Link
                to="/studio"
                onClick={closeAssistant}
                className="btn btn-outline-light mt-6 w-full"
              >
                Open the Design Studio
              </Link>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(draft);
          }}
          className="border-t border-ivory/10 p-4"
        >
          <div className="flex items-center gap-3 border border-ivory/20 px-4 py-2 focus-within:border-accent">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about furniture, rooms or materials…"
              className="w-full bg-transparent py-2 text-sm placeholder:text-warmgray/60 focus:outline-none"
              aria-label="Ask the interior assistant"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send question"
              className="text-accent disabled:opacity-30"
            >
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
