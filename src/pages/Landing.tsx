import { useState, useEffect, useRef, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/* ================================================================
   askwijs Landing Page
   Design language: Linear-style dark monochrome
   ================================================================ */

// ── Palette ──────────────────────────────────────────────────────
const C = {
  bg: "#08090a",
  surface: "rgba(255,255,255,0.03)",
  surfaceHover: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.08)",
  text: "#f7f8f8",
  muted: "#8a8f98",
  faint: "#62666d",
  accent: "#5e6ad2",
  accentHover: "#6e7bdf",
};

// ── Shared hook: fade-in on viewport entry ───────────────────────
function useFadeIn<T extends HTMLElement>(): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

// ── Count-up number ──────────────────────────────────────────────
function CountUp({ target, prefix = "", suffix = "", decimals = 0, duration = 1400 }: { target: number; prefix?: string; suffix?: string; decimals?: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  const formatted = decimals > 0
    ? value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : Math.round(value).toLocaleString("nl-NL");

  return <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>{prefix}{formatted}{suffix}</span>;
}

// ══════════════════════════════════════════════════════════════════
//  ROOT COMPONENT
// ══════════════════════════════════════════════════════════════════
export function Landing() {
  const { user, loading } = useAuth();
  if (!loading && user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen text-[#f7f8f8] overflow-x-hidden" style={{ background: C.bg, fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <Nav />
      <Hero />
      <DashboardDemo />
      <BanksStrip />
      <Pillars />
      <FeatureCategories />
      <FeatureBTW />
      <FeatureAskWijs />
      <FeatureReceipts />
      <FeatureBanks />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  1. FIXED NAV
// ══════════════════════════════════════════════════════════════════
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      className="relative text-sm transition-colors duration-200 py-1"
      style={{ color: hovered ? "#f7f8f8" : "#8a8f98" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <span
        className="absolute bottom-0 left-0 h-px transition-all duration-300 ease-out"
        style={{
          width: hovered ? "100%" : "0%",
          background: C.accent,
          opacity: hovered ? 1 : 0,
        }}
      />
    </a>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      // Hide nav on scroll down, show on scroll up (Linear-style)
      if (y > 300) {
        setVisible(y < lastScroll.current || y < 100);
      } else {
        setVisible(true);
      }
      lastScroll.current = y;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 h-14 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8,9,10,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        opacity: visible ? 1 : 0,
      }}
    >
      <Link to="/" className="text-lg font-semibold text-[#f7f8f8] no-underline tracking-tight">
        ask<span style={{ color: C.accent }}>wijs</span>
      </Link>

      <div className="hidden md:flex items-center gap-7">
        <NavLink href="#demo">Product</NavLink>
        <NavLink href="#features">Features</NavLink>
        <NavLink href="#pricing">Pricing</NavLink>
        <NavLink href="#security">Security</NavLink>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/login" className="hidden md:inline text-sm text-[#8a8f98] hover:text-[#f7f8f8] transition-colors duration-200">Log in</Link>
        <Link
          to="/signup"
          className="text-sm font-medium text-white px-4 py-2 rounded-md transition-all duration-200 hover:brightness-110"
          style={{ background: C.accent }}
        >
          Start free trial
        </Link>
      </div>
    </nav>
  );
}

// ══════════════════════════════════════════════════════════════════
//  2. HERO
// ══════════════════════════════════════════════════════════════════
function Hero() {
  const ref = useFadeIn<HTMLDivElement>();
  return (
    <section className="relative flex flex-col items-center justify-center pt-40 pb-20 px-6 text-center">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(94,106,210,0.08) 0%, transparent 70%)" }} />

      <div ref={ref} className="relative z-10 max-w-3xl">
        <h1 className="text-[clamp(40px,6.5vw,72px)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#f7f8f8] mb-6">
          Your freelance finances.{" "}
          <span className="block" style={{ color: C.muted }}>Finally clear.</span>
        </h1>

        <p className="text-lg text-[#8a8f98] max-w-xl mx-auto mb-10 leading-relaxed">
          askwijs connects your Dutch bank accounts, auto-categorizes every transaction, and keeps your BTW aangifte ready to file. Built for expats and ZZP'ers. English and Dutch.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 text-white text-[15px] font-medium px-7 py-3.5 rounded-lg transition-all hover:-translate-y-px"
            style={{ background: C.accent }}
          >
            Start free trial
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-0.5"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 text-[#8a8f98] text-[15px] font-medium px-7 py-3.5 rounded-lg transition-all hover:text-[#f7f8f8]"
            style={{ border: `1px solid ${C.border}` }}
          >
            See how it works
          </a>
        </div>
        <p className="text-sm text-[#62666d]">1 month free &middot; then &euro;19,99/mo &middot; no credit card needed</p>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
//  3. INTERACTIVE DASHBOARD DEMO
// ══════════════════════════════════════════════════════════════════

type DashTab = "Overview" | "Transactions" | "BTW" | "Invoices" | "Receipts" | "Banks" | "Settings";
const DASH_TABS: DashTab[] = ["Overview", "Transactions", "BTW", "Invoices", "Receipts", "Banks", "Settings"];

const TRANSACTIONS_DATA = [
  { date: "28 Mar", name: "Adobe Creative Cloud", cat: "Software", amt: -60.49, catColor: "#5e6ad2" },
  { date: "27 Mar", name: "Client - Acme BV", cat: "Revenue", amt: 3500.0, catColor: "#3fb950" },
  { date: "26 Mar", name: "WeWork Amsterdam", cat: "Office", amt: -290.0, catColor: "#d29e5e" },
  { date: "25 Mar", name: "Albert Heijn", cat: "Personal", amt: -47.85, catColor: "#62666d" },
  { date: "24 Mar", name: "NS Business Card", cat: "Travel", amt: -89.0, catColor: "#5e6ad2" },
  { date: "23 Mar", name: "Client - TechStart NL", cat: "Revenue", amt: 2100.0, catColor: "#3fb950" },
  { date: "22 Mar", name: "Bol.com - Monitor", cat: "Equipment", amt: -349.0, catColor: "#d2765e" },
  { date: "21 Mar", name: "KVK Registration", cat: "Admin", amt: -52.0, catColor: "#5e6ad2" },
];

const BTW_BOXES = [
  { box: "1a", label: "Leveringen/diensten belast met hoog tarief", amount: "12.450,00" },
  { box: "1b", label: "Leveringen/diensten belast met laag tarief", amount: "0,00" },
  { box: "1e", label: "Leveringen/diensten belast met 0% of niet bij u belast", amount: "3.500,00" },
  { box: "2a", label: "Verleggingsregelingen binnenland", amount: "0,00" },
  { box: "4a", label: "BTW verschuldigd over 1a", amount: "2.614,50" },
  { box: "4b", label: "BTW verschuldigd over 1b", amount: "0,00" },
  { box: "5a", label: "Verschuldigde BTW (rubrieken 4a t/m 4d)", amount: "2.614,50" },
  { box: "5b", label: "Voorbelasting", amount: "724,50" },
  { box: "5g", label: "Totaal te betalen", amount: "1.890,00" },
];

function DashboardDemo() {
  const ref = useFadeIn<HTMLDivElement>();
  const [activeTab, setActiveTab] = useState<DashTab>("Overview");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "wijs"; text: string }>>([
    { role: "wijs", text: "Hi Ned! I'm Wijs, your AI financial assistant. Ask me anything about your Dutch taxes, BTW, deductions, or finances." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const wisResponses: Record<string, string> = {
    default: "Based on your transaction data, your current BTW position for Q1 is \u20AC1.890,00. Your next filing deadline is April 30. You've had \u20AC5.600 in revenue this quarter with \u20AC724,50 in reclaimable voorbelasting. Want me to break that down further?",
    btw: "Your Q1 BTW aangifte shows \u20AC2.614,50 verschuldigde BTW minus \u20AC724,50 voorbelasting = \u20AC1.890,00 to pay. The deadline is April 30. I can pre-fill and submit the form for you when you're ready.",
    deductions: "I've found \u20AC4.210 in potential deductions this quarter: \u20AC290/mo WeWork (office), \u20AC60,49/mo Adobe (software), \u20AC89 NS travel, and \u20AC349 monitor (equipment). The monitor qualifies for direct write-off under the KIA regeling.",
    revenue: "Your Q1 revenue is tracking at \u20AC5.600 across 2 clients: Acme BV (\u20AC3.500) and TechStart NL (\u20AC2.100). That's 18% above Q4. At this rate, you'll cross the KOR drempel of \u20AC20.000 by August.",
  };

  const handleSendChat = useCallback(() => {
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setIsTyping(true);

    const lower = userMsg.toLowerCase();
    let response = wisResponses.default;
    if (lower.includes("btw") || lower.includes("vat") || lower.includes("tax")) response = wisResponses.btw;
    else if (lower.includes("deduct") || lower.includes("aftrek") || lower.includes("write")) response = wisResponses.deductions;
    else if (lower.includes("revenue") || lower.includes("income") || lower.includes("omzet")) response = wisResponses.revenue;

    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: "wijs", text: response }]);
      setIsTyping(false);
    }, 1200);
  }, [chatInput, isTyping]);

  return (
    <section id="demo" className="pb-32 px-4">
      <div ref={ref} className="relative max-w-[960px] mx-auto">
        {/* Glow behind the frame */}
        <div className="absolute -inset-10 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(94,106,210,0.1), transparent)" }} />

        {/* Browser chrome */}
        <div className="relative rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}`, boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3" style={{ background: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${C.border}` }}>
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <div className="flex-1 text-xs text-[#62666d] text-center" style={{ fontVariantNumeric: "tabular-nums" }}>app.askwijs.ai/dashboard</div>
          </div>

          {/* Top tab nav */}
          <div className="flex items-center gap-0 px-1 overflow-x-auto" style={{ background: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${C.border}` }}>
            {DASH_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2.5 text-xs font-medium transition-colors shrink-0 relative"
                style={{
                  color: activeTab === tab ? "#f7f8f8" : "#62666d",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-2 right-2 h-px" style={{ background: C.accent }} />
                )}
              </button>
            ))}
          </div>

          {/* Content area */}
          <div className="min-h-[480px]" style={{ background: C.bg }}>
            {activeTab === "Overview" && <DashOverview />}
            {activeTab === "Transactions" && <DashTransactions />}
            {activeTab === "BTW" && <DashBTW />}
            {activeTab === "Invoices" && <DashInvoices />}
            {activeTab === "Receipts" && <DashReceipts />}
            {activeTab === "Banks" && <DashBanksTab />}
            {activeTab === "Settings" && <DashSettings />}
          </div>

          {/* Wijs chat bar at bottom */}
          <div style={{ background: "rgba(255,255,255,0.02)", borderTop: `1px solid ${C.border}` }} className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0" style={{ background: C.accent }}>W</div>
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSendChat()}
                placeholder="Ask Wijs anything about your finances..."
                className="flex-1 text-sm text-[#f7f8f8] placeholder:text-[#62666d] outline-none bg-transparent"
              />
              <button
                onClick={handleSendChat}
                className="text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
                style={{ background: C.accent, color: "#fff", border: "none", cursor: "pointer", opacity: chatInput.trim() ? 1 : 0.4 }}
              >
                Send
              </button>
            </div>
            {/* Chat messages */}
            {chatMessages.length > 1 && (
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                    {msg.role === "wijs" && <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold text-white shrink-0 mt-0.5" style={{ background: C.accent }}>W</div>}
                    <div
                      className="text-xs leading-relaxed px-3 py-2 rounded-lg max-w-[80%]"
                      style={{
                        background: msg.role === "user" ? "rgba(94,106,210,0.15)" : "rgba(255,255,255,0.04)",
                        color: msg.role === "user" ? "#c4c9f5" : "#8a8f98",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold text-white shrink-0 mt-0.5" style={{ background: C.accent }}>W</div>
                    <div className="text-xs text-[#62666d] px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <span className="inline-flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#62666d] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#62666d] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#62666d] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// -- Dashboard tab: Overview ----
function DashOverview() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-[#f7f8f8]">Good morning, Ned</h2>
        <p className="text-xs text-[#62666d] mt-1">Your Q1 BTW aangifte is ready to review. Everything looks on track.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Net income Q1", prefix: "\u20AC", target: 9840, suffix: "", badge: "+18% vs Q4", badgeColor: "#3fb950" },
          { label: "BTW position", prefix: "\u20AC", target: 1890, suffix: "", badge: "Due 30 Apr", badgeColor: "#d29e5e" },
          { label: "Deductions found", prefix: "\u20AC", target: 4210, suffix: "", badge: "Auto-detected", badgeColor: "#5e6ad2" },
          { label: "Tax forecast", prefix: "\u20AC", target: 6340, suffix: "", badge: "Income tax", badgeColor: "#8a8f98" },
        ].map(s => (
          <div key={s.label} className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }}>
            <div className="text-[10px] font-medium uppercase tracking-wider text-[#62666d] mb-2">{s.label}</div>
            <div className="text-xl font-semibold text-[#f7f8f8]" style={{ fontVariantNumeric: "tabular-nums" }}>
              <CountUp target={s.target} prefix={s.prefix} />
            </div>
            <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mt-2" style={{ background: `${s.badgeColor}15`, color: s.badgeColor }}>
              {s.badge}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }}>
        <div className="text-[11px] font-medium uppercase tracking-wider text-[#62666d] mb-3">Recent transactions</div>
        {TRANSACTIONS_DATA.slice(0, 5).map((tx, i) => (
          <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < 4 ? `1px solid rgba(255,255,255,0.04)` : "none" }}>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#62666d]" style={{ fontVariantNumeric: "tabular-nums" }}>{tx.date}</span>
              <span className="text-[13px] text-[#8a8f98]">{tx.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${tx.catColor}15`, color: tx.catColor }}>{tx.cat}</span>
              <span className="text-[13px] font-medium" style={{ fontVariantNumeric: "tabular-nums", color: tx.amt > 0 ? "#3fb950" : "#f7f8f8" }}>
                {tx.amt > 0 ? "+" : ""}&euro;{Math.abs(tx.amt).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -- Dashboard tab: Transactions ----
function DashTransactions() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#f7f8f8]">Transactions</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#62666d]">Q1 2026</span>
          <div className="text-xs text-[#8a8f98] px-3 py-1.5 rounded-md" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}` }}>All categories</div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <div className="grid grid-cols-[60px_1fr_100px_100px] gap-2 px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-[#62666d]" style={{ background: "rgba(255,255,255,0.02)" }}>
          <span>Date</span><span>Description</span><span>Category</span><span className="text-right">Amount</span>
        </div>
        {TRANSACTIONS_DATA.map((tx, i) => (
          <div key={i} className="grid grid-cols-[60px_1fr_100px_100px] gap-2 px-4 py-3 items-center" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
            <span className="text-[11px] text-[#62666d]" style={{ fontVariantNumeric: "tabular-nums" }}>{tx.date}</span>
            <span className="text-[13px] text-[#8a8f98]">{tx.name}</span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full w-fit" style={{ background: `${tx.catColor}15`, color: tx.catColor }}>{tx.cat}</span>
            <span className="text-[13px] font-medium text-right" style={{ fontVariantNumeric: "tabular-nums", color: tx.amt > 0 ? "#3fb950" : "#f7f8f8" }}>
              {tx.amt > 0 ? "+" : ""}&euro;{Math.abs(tx.amt).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// -- Dashboard tab: BTW ----
function DashBTW() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-[#f7f8f8]">BTW aangifte Q1 2026</h2>
          <p className="text-xs text-[#62666d] mt-1">Pre-filled from your transactions. Review and submit.</p>
        </div>
        <button className="text-xs font-medium px-4 py-2 rounded-md text-white" style={{ background: C.accent, border: "none", cursor: "pointer" }}>
          Submit to Belastingdienst
        </button>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        {BTW_BOXES.map((box, i) => (
          <div key={box.box} className="flex items-center justify-between px-4 py-3" style={{ borderTop: i > 0 ? `1px solid rgba(255,255,255,0.04)` : "none", background: box.box === "5g" ? "rgba(94,106,210,0.06)" : "transparent" }}>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium text-[#5e6ad2] w-8" style={{ fontVariantNumeric: "tabular-nums" }}>{box.box}</span>
              <span className="text-[13px] text-[#8a8f98]">{box.label}</span>
            </div>
            <span className="text-[13px] font-medium text-[#f7f8f8]" style={{ fontVariantNumeric: "tabular-nums" }}>
              &euro;{box.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// -- Dashboard tab: Invoices ----
function DashInvoices() {
  const invoices = [
    { id: "INV-2026-012", client: "Acme BV", amount: "3.500,00", status: "Paid", statusColor: "#3fb950", date: "27 Mar" },
    { id: "INV-2026-011", client: "TechStart NL", amount: "2.100,00", status: "Paid", statusColor: "#3fb950", date: "23 Mar" },
    { id: "INV-2026-013", client: "Design Co", amount: "1.750,00", status: "Sent", statusColor: "#d29e5e", date: "30 Mar" },
    { id: "INV-2026-014", client: "Startup Labs", amount: "4.200,00", status: "Draft", statusColor: "#62666d", date: "1 Apr" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#f7f8f8]">Invoices</h2>
        <button className="text-xs font-medium px-4 py-2 rounded-md text-white" style={{ background: C.accent, border: "none", cursor: "pointer" }}>New invoice</button>
      </div>
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <div className="grid grid-cols-[100px_1fr_100px_80px_60px] gap-2 px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-[#62666d]" style={{ background: "rgba(255,255,255,0.02)" }}>
          <span>Invoice</span><span>Client</span><span className="text-right">Amount</span><span className="text-center">Status</span><span>Date</span>
        </div>
        {invoices.map((inv, i) => (
          <div key={inv.id} className="grid grid-cols-[100px_1fr_100px_80px_60px] gap-2 px-4 py-3 items-center" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
            <span className="text-[12px] text-[#5e6ad2]" style={{ fontVariantNumeric: "tabular-nums" }}>{inv.id}</span>
            <span className="text-[13px] text-[#8a8f98]">{inv.client}</span>
            <span className="text-[13px] font-medium text-right text-[#f7f8f8]" style={{ fontVariantNumeric: "tabular-nums" }}>&euro;{inv.amount}</span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-center w-fit mx-auto" style={{ background: `${inv.statusColor}15`, color: inv.statusColor }}>{inv.status}</span>
            <span className="text-[11px] text-[#62666d]">{inv.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// -- Dashboard tab: Receipts ----
function DashReceipts() {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div className="p-6">
      <h2 className="text-base font-semibold text-[#f7f8f8] mb-4">Receipts</h2>
      <div
        className="flex flex-col items-center justify-center py-16 rounded-lg transition-colors"
        style={{
          border: `2px dashed ${dragOver ? C.accent : C.border}`,
          background: dragOver ? "rgba(94,106,210,0.06)" : "rgba(255,255,255,0.02)",
        }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mb-3" style={{ color: "#62666d" }}>
          <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className="text-sm text-[#8a8f98] mb-1">Drop receipts here or click to upload</p>
        <p className="text-xs text-[#62666d]">Wijs will auto-match them to transactions</p>
      </div>
      <div className="mt-4 space-y-2">
        {[
          { name: "receipt_wework_mar.pdf", match: "WeWork Amsterdam", date: "26 Mar" },
          { name: "adobe_invoice_mar.pdf", match: "Adobe Creative Cloud", date: "28 Mar" },
        ].map(r => (
          <div key={r.name} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "#5e6ad2" }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5"/><path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5"/></svg>
              <div>
                <div className="text-xs text-[#8a8f98]">{r.name}</div>
                <div className="text-[10px] text-[#62666d]">Matched to {r.match}</div>
              </div>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(63,185,80,0.15)", color: "#3fb950" }}>Matched</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// -- Dashboard tab: Banks ----
function DashBanksTab() {
  const banks = [
    { name: "ING Zakelijk", iban: "NL91 INGB 0001 2345 67", balance: "8.420,50", color: "#ff6200", connected: true },
    { name: "Bunq Business", iban: "NL44 BUNQ 2034 5678 90", balance: "3.105,20", color: "#30c381", connected: true },
  ];
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#f7f8f8]">Connected banks</h2>
        <button className="text-xs font-medium px-4 py-2 rounded-md text-white" style={{ background: C.accent, border: "none", cursor: "pointer" }}>Connect bank</button>
      </div>
      <div className="space-y-3">
        {banks.map(b => (
          <div key={b.iban} className="flex items-center justify-between px-4 py-4 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ background: b.color }} />
              <div>
                <div className="text-[13px] text-[#f7f8f8] font-medium">{b.name}</div>
                <div className="text-[11px] text-[#62666d]" style={{ fontVariantNumeric: "tabular-nums" }}>{b.iban}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[15px] font-medium text-[#f7f8f8]" style={{ fontVariantNumeric: "tabular-nums" }}>&euro;{b.balance}</div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(63,185,80,0.15)", color: "#3fb950" }}>Synced</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -- Dashboard tab: Settings ----
function DashSettings() {
  return (
    <div className="p-6">
      <h2 className="text-base font-semibold text-[#f7f8f8] mb-4">Settings</h2>
      <div className="space-y-4">
        {[
          { label: "Language", value: "English" },
          { label: "Currency display", value: "EUR (\u20AC)" },
          { label: "BTW regime", value: "Standard (21%/9%)" },
          { label: "KVK nummer", value: "90123456" },
          { label: "BTW-id", value: "NL004567890B01" },
        ].map(s => (
          <div key={s.label} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }}>
            <span className="text-[13px] text-[#8a8f98]">{s.label}</span>
            <span className="text-[13px] text-[#f7f8f8]" style={{ fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  4. BANK LOGOS STRIP
// ══════════════════════════════════════════════════════════════════
function BanksStrip() {
  const ref = useFadeIn<HTMLDivElement>();
  const banks = [
    { name: "ING", color: "#ff6200" },
    { name: "ABN AMRO", color: "#004c3f" },
    { name: "Rabobank", color: "#0068b4" },
    { name: "Bunq", color: "#30c381" },
    { name: "Revolut", color: "#0075eb" },
    { name: "N26", color: "#48d2a0" },
  ];

  return (
    <div ref={ref} className="py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm text-[#62666d] mb-8">Trusted by freelancers across the Netherlands</p>
        <div className="flex items-center justify-center gap-3 md:gap-5 flex-wrap">
          {banks.map(b => (
            <div
              key={b.name}
              className="flex items-center gap-2.5 px-5 py-3 rounded-lg transition-colors"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: b.color }} />
              <span className="text-sm font-medium text-[#62666d]">{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  5. THREE PILLARS
// ══════════════════════════════════════════════════════════════════
function Pillars() {
  const ref = useFadeIn<HTMLDivElement>();
  const pillars = [
    {
      title: "AI-powered",
      desc: "Every transaction auto-categorized by Wijs. Business or personal, deductible or not, BTW rate applied. Learns from your corrections over time.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: C.accent }}>
          <path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z"/><path d="M16 14H8a4 4 0 00-4 4v2h16v-2a4 4 0 00-4-4z"/>
        </svg>
      ),
    },
    {
      title: "Bilingual",
      desc: "Full English and Dutch. Built for expats who don't speak Dutch but need to file Dutch taxes. Every term explained. Switch languages anytime.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: C.accent }}>
          <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
        </svg>
      ),
    },
    {
      title: "Bank-grade security",
      desc: "PSD2 certified, read-only bank access. AES-256 encryption at rest and in transit. GDPR compliant. Data stored in the EU. You own everything.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: C.accent }}>
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      ),
    },
  ];

  return (
    <section id="features" ref={ref} className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-px rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
          {pillars.map(p => (
            <div key={p.title} className="p-8 md:p-10" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="mb-5">{p.icon}</div>
              <h3 className="text-[17px] font-semibold text-[#f7f8f8] mb-3">{p.title}</h3>
              <p className="text-sm text-[#8a8f98] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
//  6-10. FEATURE SECTIONS
// ══════════════════════════════════════════════════════════════════

function FeatureSection({ id, label, title, desc, children, reverse = false }: {
  id?: string; label: string; title: string; desc: string; children: React.ReactNode; reverse?: boolean;
}) {
  const ref = useFadeIn<HTMLDivElement>();
  return (
    <section id={id} ref={ref} className="py-24 px-6">
      <div className={`max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center ${reverse ? "md:[direction:rtl]" : ""}`}>
        <div style={{ direction: "ltr" }}>
          <div className="text-[11px] font-semibold tracking-widest uppercase mb-3" style={{ color: C.accent }}>{label}</div>
          <h2 className="text-[clamp(28px,4vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[#f7f8f8] mb-4">{title}</h2>
          <p className="text-base text-[#8a8f98] leading-relaxed">{desc}</p>
        </div>
        <div style={{ direction: "ltr" }}>{children}</div>
      </div>
    </section>
  );
}

// 6. Transaction categorization
function FeatureCategories() {
  const [visible, setVisible] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  const txs = [
    { name: "Adobe Creative Cloud", from: "Uncategorized", to: "Software", color: "#5e6ad2", amt: "-\u20AC60,49" },
    { name: "Client - Acme BV", from: "Uncategorized", to: "Revenue", color: "#3fb950", amt: "+\u20AC3.500,00" },
    { name: "WeWork Amsterdam", from: "Uncategorized", to: "Office", color: "#d29e5e", amt: "-\u20AC290,00" },
    { name: "NS Business Card", from: "Uncategorized", to: "Travel", color: "#5e6ad2", amt: "-\u20AC89,00" },
  ];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let i = 0;
          const interval = setInterval(() => {
            i++;
            setVisible(i);
            if (i >= txs.length) clearInterval(interval);
          }, 600);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <FeatureSection
      label="Smart categorization"
      title="Every transaction, auto-categorized."
      desc="Wijs uses AI to tag every transaction: business or personal, deductible or not, correct BTW rate applied. It learns from your corrections and gets smarter over time."
    >
      <div ref={ref} className="rounded-xl p-5 space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }}>
        {txs.map((tx, i) => (
          <div
            key={tx.name}
            className="flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-500"
            style={{
              background: i < visible ? "rgba(255,255,255,0.03)" : "transparent",
              border: `1px solid ${i < visible ? C.border : "transparent"}`,
              opacity: 1,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-[#8a8f98]">{tx.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full transition-all duration-500"
                style={{
                  background: i < visible ? `${tx.color}15` : "rgba(255,255,255,0.04)",
                  color: i < visible ? tx.color : "#62666d",
                }}
              >
                {i < visible ? tx.to : tx.from}
              </span>
              <span className="text-[12px] font-medium text-[#8a8f98]" style={{ fontVariantNumeric: "tabular-nums" }}>{tx.amt}</span>
            </div>
          </div>
        ))}
      </div>
    </FeatureSection>
  );
}

// 7. BTW aangifte
function FeatureBTW() {
  const [filledCount, setFilledCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  const boxes = BTW_BOXES.slice(0, 5);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let i = 0;
          const interval = setInterval(() => {
            i++;
            setFilledCount(i);
            if (i >= boxes.length) clearInterval(interval);
          }, 400);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <FeatureSection
      reverse
      label="BTW aangifte"
      title="Your quarterly BTW. Pre-filled, ready to submit."
      desc="Wijs calculates every rubriek from your real transaction data. Review the numbers, click submit. No more staring at empty Belastingdienst forms."
    >
      <div ref={ref} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <div className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#62666d]" style={{ background: "rgba(255,255,255,0.02)" }}>
          BTW aangifte Q1 2026
        </div>
        {boxes.map((box, i) => (
          <div
            key={box.box}
            className="flex items-center justify-between px-4 py-3 transition-all duration-500"
            style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium w-6" style={{ color: C.accent, fontVariantNumeric: "tabular-nums" }}>{box.box}</span>
              <span className="text-[12px] text-[#8a8f98] truncate max-w-[200px]">{box.label}</span>
            </div>
            <span
              className="text-[13px] font-medium transition-all duration-500"
              style={{ fontVariantNumeric: "tabular-nums", color: i < filledCount ? "#f7f8f8" : "#62666d" }}
            >
              {i < filledCount ? `\u20AC${box.amount}` : "\u20AC--,--"}
            </span>
          </div>
        ))}
      </div>
    </FeatureSection>
  );
}

// 8. Ask Wijs AI
const WIJS_CONVERSATION: Array<{ role: "user" | "wijs"; text: string }> = [
  { role: "wijs", text: "Yes. Your WeWork Amsterdam membership (\u20AC290/mo) qualifies as a business expense. Since you work there full-time, you can deduct 100% including BTW. That's \u20AC3.480/year in deductions." },
  { role: "user", text: "What about my home office?" },
  { role: "wijs", text: "If you work from home at least 10% of the time, you can deduct a proportional share of rent, utilities, and internet. Based on your transaction data, I see \u20AC1.450/mo in rent. A 15% home office deduction would be \u20AC217,50/mo." },
];

function FeatureAskWijs() {
  const [visibleCount, setVisibleCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let i = 0;
          const interval = setInterval(() => {
            i++;
            setVisibleCount(i);
            if (i >= WIJS_CONVERSATION.length) clearInterval(interval);
          }, 1500);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const allMessages: Array<{ role: "user" | "wijs"; text: string }> = [
    { role: "user", text: "Can I deduct my WeWork membership?" },
    ...WIJS_CONVERSATION.slice(0, visibleCount),
  ];
  const isTyping = visibleCount > 0 && visibleCount < WIJS_CONVERSATION.length;

  return (
    <FeatureSection
      label="Ask Wijs"
      title="Your AI financial advisor. Always available."
      desc="Ask Wijs anything about your Dutch taxes, deductions, BTW, or business finances. Get answers grounded in your actual data, not generic advice."
    >
      <div ref={ref} className="rounded-xl p-5 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }}>
        {allMessages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "wijs" && (
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0 mt-0.5" style={{ background: C.accent }}>W</div>
            )}
            <div
              className="text-[13px] leading-relaxed px-4 py-3 rounded-xl max-w-[85%]"
              style={{
                background: msg.role === "user" ? "rgba(94,106,210,0.12)" : "rgba(255,255,255,0.04)",
                color: msg.role === "user" ? "#c4c9f5" : "#8a8f98",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0 mt-0.5" style={{ background: C.accent }}>W</div>
            <div className="text-[13px] text-[#62666d] px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#62666d] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#62666d] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#62666d] animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}
      </div>
    </FeatureSection>
  );
}

// 9. Receipt scanning
function FeatureReceipts() {
  const [dragOver, setDragOver] = useState(false);
  const [dropped, setDropped] = useState(false);

  return (
    <FeatureSection
      reverse
      label="Receipt scanning"
      title="Snap a photo. Wijs does the rest."
      desc="Upload or drag-drop any receipt. Wijs reads it with OCR, extracts the amount and BTW, and matches it to the right transaction automatically."
    >
      <div className="space-y-3">
        <div
          className="flex flex-col items-center justify-center py-14 rounded-xl transition-all duration-300 cursor-pointer"
          style={{
            border: `2px dashed ${dragOver ? C.accent : C.border}`,
            background: dragOver ? "rgba(94,106,210,0.06)" : "rgba(255,255,255,0.02)",
          }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); setDropped(true); }}
          onClick={() => setDropped(true)}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mb-3" style={{ color: "#62666d" }}>
            <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-sm text-[#8a8f98]">Drop receipt here</p>
          <p className="text-xs text-[#62666d] mt-1">PDF, JPG, or PNG</p>
        </div>

        {dropped && (
          <div className="flex items-center justify-between px-4 py-3 rounded-lg transition-all" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: C.accent }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5"/></svg>
              <div>
                <div className="text-xs text-[#8a8f98]">receipt_wework_mar.pdf</div>
                <div className="text-[10px] text-[#62666d]">Matched to WeWork Amsterdam - &euro;290,00</div>
              </div>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(63,185,80,0.15)", color: "#3fb950" }}>Matched</span>
          </div>
        )}
      </div>
    </FeatureSection>
  );
}

// 10. Bank connections
function FeatureBanks() {
  const banks = [
    { name: "ING", color: "#ff6200", connected: true },
    { name: "ABN AMRO", color: "#004c3f", connected: false },
    { name: "Rabobank", color: "#0068b4", connected: false },
    { name: "Bunq", color: "#30c381", connected: true },
    { name: "Revolut", color: "#0075eb", connected: false },
    { name: "N26", color: "#48d2a0", connected: false },
  ];

  const [connectedState, setConnectedState] = useState(banks.map(b => b.connected));

  return (
    <FeatureSection
      id="security"
      label="Bank connections"
      title="Connect all your Dutch banks in seconds."
      desc="PSD2 Open Banking. Read-only. askwijs can never move your money. Connect ING, ABN AMRO, Rabobank, Bunq, Revolut, N26, and more."
    >
      <div className="rounded-xl p-5 space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }}>
        {banks.map((b, i) => (
          <div key={b.name} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ background: b.color }} />
              <span className="text-[13px] text-[#8a8f98] font-medium">{b.name}</span>
            </div>
            {connectedState[i] ? (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(63,185,80,0.15)", color: "#3fb950" }}>Connected</span>
            ) : (
              <button
                className="text-[10px] font-medium px-3 py-1 rounded-md transition-colors"
                style={{ background: "rgba(255,255,255,0.06)", color: "#8a8f98", border: `1px solid ${C.border}`, cursor: "pointer" }}
                onClick={() => setConnectedState(prev => { const next = [...prev]; next[i] = true; return next; })}
              >
                Connect
              </button>
            )}
          </div>
        ))}
      </div>
    </FeatureSection>
  );
}

// ══════════════════════════════════════════════════════════════════
//  11. PRICING
// ══════════════════════════════════════════════════════════════════
function Pricing() {
  const ref = useFadeIn<HTMLDivElement>();
  const features = [
    "Unlimited bank connections (PSD2)",
    "AI transaction categorization",
    "Live BTW dashboard and tax forecast",
    "Automatic BTW aangifte filing",
    "Receipt scanning with OCR",
    "Ask Wijs AI financial advisor",
    "WhatsApp and Telegram notifications",
    "Full English and Dutch support",
  ];

  return (
    <section id="pricing" ref={ref} className="py-28 px-6">
      <div className="max-w-lg mx-auto text-center">
        <div className="text-[11px] font-semibold tracking-widest uppercase mb-3" style={{ color: C.accent }}>Pricing</div>
        <h2 className="text-[clamp(28px,4vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[#f7f8f8] mb-3">
          Simple pricing. No surprises.
        </h2>
        <p className="text-base text-[#8a8f98] mb-12">One plan. Everything included. Cancel anytime.</p>

        <div className="rounded-xl p-8 text-left relative overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)` }} />

          <div className="text-center mb-8">
            <span className="inline-block text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4" style={{ color: C.accent, background: "rgba(94,106,210,0.1)", border: "1px solid rgba(94,106,210,0.2)" }}>
              askwijs Pro
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-semibold text-[#f7f8f8]" style={{ fontVariantNumeric: "tabular-nums" }}>&euro;19,99</span>
              <span className="text-lg text-[#62666d]">/month</span>
            </div>
            <p className="text-sm text-[#62666d] mt-2">excl. BTW &middot; first month free</p>
          </div>

          <div className="space-y-3 mb-8">
            {features.map(f => (
              <div key={f} className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5"><path d="M3 8l3.5 3.5L13 5" stroke="#3fb950" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="text-sm text-[#8a8f98]">{f}</span>
              </div>
            ))}
          </div>

          <Link
            to="/signup"
            className="block w-full text-center text-white text-[15px] font-medium py-3.5 rounded-lg transition-all hover:-translate-y-px"
            style={{ background: C.accent }}
          >
            Start free trial
          </Link>
          <p className="text-center text-xs text-[#62666d] mt-3">No credit card required &middot; Cancel anytime</p>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
//  12. FINAL CTA
// ══════════════════════════════════════════════════════════════════
function FinalCTA() {
  const ref = useFadeIn<HTMLDivElement>();
  return (
    <section ref={ref} className="py-28 px-6 text-center">
      <div className="max-w-2xl mx-auto relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(94,106,210,0.06), transparent)" }} />
        <div className="relative">
          <h2 className="text-[clamp(28px,4.5vw,44px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[#f7f8f8] mb-4">
            Ready to stop worrying about Dutch taxes?
          </h2>
          <p className="text-lg text-[#8a8f98] mb-8">Join hundreds of expats and freelancers who let Wijs handle their Dutch taxes. In English.</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 text-white text-[15px] font-medium px-7 py-3.5 rounded-lg transition-all hover:-translate-y-px"
            style={{ background: C.accent }}
          >
            Start free trial
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <p className="text-sm text-[#62666d] mt-3">No credit card &middot; Cancel anytime</p>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
//  13. FOOTER
// ══════════════════════════════════════════════════════════════════
function Footer() {
  return (
    <footer className="py-10 px-6 md:px-10" style={{ borderTop: `1px solid ${C.border}` }}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="text-lg font-semibold text-[#f7f8f8] no-underline tracking-tight">
          ask<span style={{ color: C.accent }}>wijs</span>
        </Link>
        <div className="flex gap-7">
          {["Features", "Pricing", "Security", "Privacy", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-[13px] text-[#62666d] hover:text-[#8a8f98] transition-colors">{l}</a>
          ))}
        </div>
        <p className="text-[13px] text-[#62666d]">&copy; 2026 askwijs</p>
      </div>
    </footer>
  );
}
