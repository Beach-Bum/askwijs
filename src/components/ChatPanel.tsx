import { useState, useRef, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Message {
  role: "assistant" | "user";
  text: string;
  card?: {
    counterparty: string;
    amount: number;
    date: string;
    category: string;
    actions?: string[];
  };
}

export interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const eur = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

const categoryColor: Record<string, { text: string; bg: string }> = {
  office_supplies: { text: "#2563EB", bg: "rgba(37,99,235,0.12)" },
  revenue:         { text: "#059669", bg: "rgba(5,150,105,0.12)" },
  personal:        { text: "#D97706", bg: "rgba(217,119,6,0.12)" },
  transport:       { text: "#2563EB", bg: "rgba(37,99,235,0.12)" },
  rent_workspace:  { text: "#2563EB", bg: "rgba(37,99,235,0.12)" },
};

const MOCK_RESPONSES: string[] = [
  "I've updated that for you. Anything else you'd like me to check?",
  "Got it! I'll keep an eye on similar transactions going forward.",
  "Done. Your BTW summary is looking good for Q1 -- only 2 items left to review.",
  "Sure thing. I've flagged that for your accountant as well.",
];

/* ------------------------------------------------------------------ */
/*  Initial conversation                                               */
/* ------------------------------------------------------------------ */

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    text: "Goedemorgen! I see 12 new transactions from your ING account. 8 were auto-categorized. Here's one that needs your input:",
    card: {
      counterparty: "Albert Heijn",
      amount: -32.45,
      date: "Mar 26, 2026",
      category: "personal",
      actions: ["Personal", "Business"],
    },
  },
  {
    role: "assistant",
    text: "Want me to walk you through the remaining 3 that need review?",
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function WijsAvatar() {
  return (
    <div
      className="shrink-0 flex items-center justify-center"
      style={{ width: 24, height: 24, borderRadius: "50%", background: "#2563EB" }}
    >
      <svg viewBox="0 0 340 260" fill="#fff" width="13" height="13">
        <path d="M272.47,219.31c-4.9,11.42-14.21,18.58-25.93,21.46-18.47,4.54-38.83-3.63-46.11-21.8l-28.26-70.49c-6.07,28.88-12.79,55.26-32.05,76.56-8.43,8.06-17.51,14.51-29.49,16.42-16.54,2.64-35.69-4.83-42.22-21.47L2.36,51.81C-2.36,39.8.4,26.33,7.03,16.19,13.37,6.49,23.57,1.44,34.86.24c18.33-1.94,34.98,7.85,41.73,25.07l60.36,153.95c10.21-19.06,16.81-76.13,11.04-91.84l-13.29-36.21c-5.28-14.38-1.04-30.59,9.96-41.1C151.66,3.43,160.93.37,170.69.06c16.74-.53,32,8.96,38.18,24.72l63.01,160.61c4.38,11.15,5.57,22.34.6,33.92Z" />
        <path d="M274.83,132.91c-3.75-9.17,13.14-7.33,19-27.63,2.6-9.01,3.09-18.52,1.06-27.57-16.02-.15-29.21-8.92-34.6-23.35-4.95-13.23-3.27-27.5,4.57-39.09,5.81-8.59,14.51-13.01,24.57-14.39,18.84-2.58,35.73,6.66,43.65,23.96,15.7,34.3.41,77.08-26.52,100.8-8.34,7.34-27.84,16.77-31.73,7.27Z" />
      </svg>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 px-4">
      <WijsAvatar />
      <div
        className="flex items-center gap-1 px-3 py-2 rounded-[10px]"
        style={{ borderLeft: "2px solid #2563EB" }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block rounded-full"
            style={{
              width: 6,
              height: 6,
              background: "#9CA3AF",
              animation: `chatPanelDot 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function TransactionCard({
  card,
  onAction,
}: {
  card: NonNullable<Message["card"]>;
  onAction: (label: string) => void;
}) {
  const colors = categoryColor[card.category] || { text: "#9CA3AF", bg: "rgba(255,255,255,0.06)" };
  return (
    <div
      className="mt-2 rounded-[10px] p-3 space-y-2"
      style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[#F9FAFB] text-sm font-medium">{card.counterparty}</span>
        <span
          className="text-sm font-medium"
          style={{ fontVariantNumeric: "tabular-nums", color: card.amount < 0 ? "#F9FAFB" : "#059669" }}
        >
          {eur(card.amount)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#6B7280]">{card.date}</span>
        <span
          className="text-xs px-2 py-0.5 rounded-[6px] font-medium"
          style={{ color: colors.text, background: colors.bg }}
        >
          {card.category.replace(/_/g, " ")}
        </span>
      </div>
      {card.actions && card.actions.length > 0 && (
        <div className="flex gap-2 pt-1">
          {card.actions.map((label) => (
            <button
              key={label}
              onClick={() => onAction(label)}
              className="text-xs font-medium px-3 py-1.5 rounded-[6px] transition-colors"
              style={{
                background: label === "Business" ? "rgba(37,99,235,0.12)" : "rgba(255,255,255,0.06)",
                color: label === "Business" ? "#2563EB" : "#9CA3AF",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Keyframe injection (once)                                          */
/* ------------------------------------------------------------------ */

const STYLE_ID = "chat-panel-keyframes";

export function injectChatKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
@keyframes chatPanelDot {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}
@keyframes chatPanelSlideIn {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}
@keyframes chatPanelFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes chatFabPulse {
  0%   { box-shadow: 0 0 0 0 rgba(37,99,235,0.5); }
  70%  { box-shadow: 0 0 0 10px rgba(37,99,235,0); }
  100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); }
}
`;
  document.head.appendChild(style);
}

/* ------------------------------------------------------------------ */
/*  ChatPanel                                                          */
/* ------------------------------------------------------------------ */

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectChatKeyframes();
  }, []);

  /* auto-scroll on new message */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  /* ---- send helpers ---- */

  function addUserMessage(text: string) {
    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const response = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
      setTyping(false);
    }, 1000);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    addUserMessage(trimmed);
  }

  function handleCardAction(label: string) {
    addUserMessage(`Categorize as ${label}`);
  }

  /* ---- render ---- */

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Scrim */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.4)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative flex flex-col h-full w-full sm:w-[380px]"
        style={{
          background: "#111827",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "-8px 0 30px rgba(0,0,0,0.4)",
          animation: "chatPanelSlideIn 0.25s ease-out",
        }}
      >
        {/* ---- Header ---- */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[#F9FAFB] font-semibold" style={{ fontSize: 16 }}>
              Ask Wijs
            </span>
            <span
              className="block rounded-full"
              style={{
                width: 8,
                height: 8,
                background: "#059669",
                boxShadow: "0 0 6px rgba(5,150,105,0.6)",
                animation: "chatFabPulse 2s ease-in-out infinite",
              }}
            />
          </div>
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#F9FAFB] transition-colors"
            aria-label="Close chat"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* ---- Messages ---- */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map((msg, i) =>
            msg.role === "assistant" ? (
              <div key={i} className="flex items-start gap-2 px-4">
                <WijsAvatar />
                <div className="max-w-[290px]">
                  <div
                    className="text-sm text-[#F9FAFB] leading-relaxed px-3 py-2 rounded-[10px]"
                    style={{ borderLeft: "2px solid #2563EB" }}
                  >
                    {msg.text}
                  </div>
                  {msg.card && (
                    <TransactionCard card={msg.card} onAction={handleCardAction} />
                  )}
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-end px-4">
                <div
                  className="max-w-[260px] text-sm text-[#F9FAFB] leading-relaxed px-3 py-2 rounded-[14px]"
                  style={{ background: "#1F2937" }}
                >
                  {msg.text}
                </div>
              </div>
            ),
          )}
          {typing && <TypingIndicator />}
        </div>

        {/* ---- Input area ---- */}
        <div className="shrink-0 px-4 pb-4 pt-2 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Quick-action chips */}
          <div className="flex gap-2">
            {["Show BTW summary", "Export Q1"].map((chip) => (
              <button
                key={chip}
                onClick={() => addUserMessage(chip)}
                className="text-xs font-medium px-3 py-1.5 rounded-[6px] transition-colors"
                style={{ background: "rgba(37,99,235,0.12)", color: "#2563EB" }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-[10px] px-3 py-2" style={{ background: "#1F2937" }}>
            {/* Paperclip */}
            <button type="button" className="text-[#6B7280] hover:text-[#9CA3AF] transition-colors shrink-0" aria-label="Attach file">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M15.27 8.34l-6.36 6.36a3.75 3.75 0 01-5.3-5.3l6.36-6.37a2.5 2.5 0 013.53 3.54L7.14 12.93a1.25 1.25 0 01-1.77-1.77l5.66-5.65"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Wijs anything..."
              className="flex-1 bg-transparent text-sm text-[#F9FAFB] placeholder:text-[#6B7280] outline-none"
            />

            {/* Send button */}
            <button
              type="submit"
              className="shrink-0 flex items-center justify-center rounded-[6px] transition-colors"
              style={{
                width: 30,
                height: 30,
                background: input.trim() ? "#2563EB" : "rgba(37,99,235,0.3)",
                cursor: input.trim() ? "pointer" : "default",
              }}
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M14 2L7 9M14 2l-4.5 12-2-5.5L2 6.5 14 2z"
                  stroke="#fff"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
