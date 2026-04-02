import { useState, useEffect, useRef, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/* ================================================================
   askwijs Landing Page
   Layout: Exact copy of linear.app/homepage structure
   ================================================================ */

// ── Palette (Linear's exact tokens) ─────────────────────────────
const C = {
  bg: "#08090a",
  surface: "rgba(255,255,255,0.03)",
  surfaceHover: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.08)",
  borderSubtle: "rgba(255,255,255,0.04)",
  text: "#f7f8f8",
  muted: "#8a8f98",
  faint: "#62666d",
  dim: "#4a4e57",
  accent: "#5e6ad2",
  accentHover: "#6e7bdf",
  green: "#3fb950",
  orange: "#d29e5e",
  red: "#d2765e",
};

// ── Fade-in on scroll ───────────────────────────────────────────
function useFadeIn<T extends HTMLElement>(): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

// ── Count-up animation ─────────────────────────────────────────
function CountUp({ target, prefix = "", suffix = "", decimals = 0, duration = 1400 }: { target: number; prefix?: string; suffix?: string; decimals?: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            setValue((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(tick);
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
//  ROOT
// ══════════════════════════════════════════════════════════════════
export function Landing() {
  const { user, loading } = useAuth();
  if (!loading && user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen text-[#f7f8f8] overflow-x-hidden" style={{ background: C.bg, fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      <Nav />
      <main>
        <Hero />
        <DashboardDemo />
        <IntroText />
        <ThreeCards />
        <Divider />
        <SectionIntake />
        <Divider />
        <SectionBTW />
        <Divider />
        <SectionWijs />
        <Divider />
        <SectionReceipts />
        <Divider />
        <SectionBanks />
        <Divider />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  NAV — Linear style: gradient bg, 72px, full-width
// ══════════════════════════════════════════════════════════════════
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [h, setH] = useState(false);
  return (
    <a href={href} className="relative text-[14px] transition-colors duration-200 py-1"
      style={{ color: h ? C.text : C.muted }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
      <span className="absolute bottom-0 left-0 h-px transition-all duration-300 ease-out"
        style={{ width: h ? "100%" : "0%", background: C.accent, opacity: h ? 1 : 0 }} />
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
      if (y > 300) { setVisible(y < lastScroll.current || y < 100); } else { setVisible(true); }
      lastScroll.current = y;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[72px] transition-all duration-300"
      style={{
        paddingLeft: "max(32px, calc((100vw - 1436px) / 2 + 46px))",
        paddingRight: "max(32px, calc((100vw - 1436px) / 2 + 46px))",
        background: scrolled ? "rgba(8,9,10,0.85)" : "linear-gradient(180deg, rgba(8,9,10,0.8) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
        borderBottom: scrolled ? `1px solid ${C.borderSubtle}` : "1px solid transparent",
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        opacity: visible ? 1 : 0,
      }}>
      <Link to="/" className="text-[16px] font-semibold text-[#f7f8f8] no-underline tracking-tight">
        ask<span style={{ color: C.accent }}>wijs</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <NavLink href="#features">Product</NavLink>
        <NavLink href="#pricing">Pricing</NavLink>
        <NavLink href="#security">Security</NavLink>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="hidden md:inline text-[14px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors">Log in</Link>
        <Link to="/signup" className="text-[14px] font-medium text-white px-4 py-2 rounded-[8px] transition-all hover:brightness-110"
          style={{ background: C.accent }}>Sign up</Link>
      </div>
    </nav>
  );
}

// ══════════════════════════════════════════════════════════════════
//  HERO — Linear style: LEFT-ALIGNED heading, subtitle row
// ══════════════════════════════════════════════════════════════════
function Hero() {
  const ref = useFadeIn<HTMLDivElement>();
  return (
    <section className="pt-[calc(72px+128px)] pb-0"
      style={{ paddingLeft: "max(32px, calc((100vw - 1436px) / 2 + 46px))", paddingRight: "max(32px, calc((100vw - 1436px) / 2 + 46px))" }}>
      <div ref={ref} className="max-w-[1344px]">
        {/* Heading — left-aligned like Linear */}
        <h1 className="text-[56px] font-medium leading-[1.14] tracking-[-0.04em] text-[#f7f8f8] mb-8 max-w-[800px]">
          Your Dutch taxes.{"\n"}
          <span className="block">Fully automated.</span>
        </h1>

        {/* Subtitle row — left text + right link, like Linear */}
        <div className="flex items-center justify-between mb-0">
          <p className="text-[16px] text-[#8a8f98] leading-[1.5]">
            Connect your bank. askwijs categorizes every transaction, calculates your BTW, and files your returns.
          </p>
          <div className="hidden md:flex items-center gap-2 text-[14px] shrink-0 ml-8">
            <span className="text-[#8a8f98]">Built for expats and ZZP'ers</span>
            <Link to="/signup" className="text-[#8a8f98] hover:text-[#f7f8f8] transition-colors">
              askwijs.ai &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
//  DASHBOARD DEMO — Full-bleed like Linear (extends beyond container)
// ══════════════════════════════════════════════════════════════════
type DashTab = "Overview" | "Transactions" | "BTW" | "Invoices" | "Receipts" | "Banks" | "Settings";

const TRANSACTIONS = [
  { date: "28 Mar", name: "Adobe Creative Cloud", cat: "Software", amt: -60.49, color: C.accent },
  { date: "27 Mar", name: "Client - Acme BV", cat: "Revenue", amt: 3500.0, color: C.green },
  { date: "26 Mar", name: "WeWork Amsterdam", cat: "Office", amt: -290.0, color: C.orange },
  { date: "25 Mar", name: "Albert Heijn", cat: "Personal", amt: -47.85, color: C.faint },
  { date: "24 Mar", name: "NS Business Card", cat: "Travel", amt: -89.0, color: C.accent },
  { date: "23 Mar", name: "Client - TechStart NL", cat: "Revenue", amt: 2100.0, color: C.green },
  { date: "22 Mar", name: "Bol.com - Monitor", cat: "Equipment", amt: -349.0, color: C.red },
  { date: "21 Mar", name: "KVK Registration", cat: "Admin", amt: -52.0, color: C.accent },
];

const BTW_BOXES = [
  { box: "1a", label: "Leveringen/diensten belast met hoog tarief", amount: "12.450,00" },
  { box: "1b", label: "Leveringen/diensten belast met laag tarief", amount: "0,00" },
  { box: "1e", label: "Leveringen/diensten belast met 0%", amount: "3.500,00" },
  { box: "4a", label: "BTW verschuldigd over 1a", amount: "2.614,50" },
  { box: "5b", label: "Voorbelasting", amount: "724,50" },
  { box: "5g", label: "Totaal te betalen", amount: "1.890,00" },
];

function DashboardDemo() {
  const ref = useFadeIn<HTMLDivElement>();
  const [activeTab, setActiveTab] = useState<DashTab>("Overview");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "wijs"; text: string }>>([
    { role: "wijs", text: "Hi Ned! Ask me anything about your Dutch taxes, BTW, deductions, or finances." },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendChat = useCallback(() => {
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setIsTyping(true);
    const lower = userMsg.toLowerCase();
    let response = "Your current BTW position for Q1 is \u20AC1.890,00. Next filing deadline is April 30.";
    if (lower.includes("btw") || lower.includes("vat")) response = "Q1 BTW: \u20AC2.614,50 verschuldigd minus \u20AC724,50 voorbelasting = \u20AC1.890,00 to pay. Deadline: April 30.";
    else if (lower.includes("deduct")) response = "Found \u20AC4.210 in deductions: \u20AC290/mo WeWork, \u20AC60,49/mo Adobe, \u20AC89 NS travel, \u20AC349 monitor (KIA eligible).";
    else if (lower.includes("revenue") || lower.includes("income")) response = "Q1 revenue: \u20AC5.600 across 2 clients. 18% above Q4. You'll cross the KOR drempel by August.";
    setTimeout(() => { setChatMessages(prev => [...prev, { role: "wijs", text: response }]); setIsTyping(false); }, 1200);
  }, [chatInput, isTyping]);

  const sidebarItems = [
    { label: "Overview", tab: "Overview" as DashTab },
    { label: "Transactions", tab: "Transactions" as DashTab },
    { label: "BTW", tab: "BTW" as DashTab },
    { label: "Invoices", tab: "Invoices" as DashTab },
  ];
  const toolItems = [
    { label: "Receipts", tab: "Receipts" as DashTab },
    { label: "Banks", tab: "Banks" as DashTab },
    { label: "Settings", tab: "Settings" as DashTab },
  ];

  return (
    <section className="relative mt-12 mb-0 overflow-hidden">
      {/* Background gradient — the "stage" the app sits on */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 100% 70% at 50% 10%, rgba(255,255,255,0.03), transparent 60%)",
      }} />

      {/* Full-bleed frame — matches Linear's 1920px screenshot that bleeds beyond 1344px container */}
      <div ref={ref} className="relative mx-auto" style={{
        maxWidth: "1320px",
        marginLeft: "max(0px, calc((100vw - 1320px) / 2))",
        marginRight: "max(0px, calc((100vw - 1320px) / 2))",
        padding: "0 16px",
      }}>
        <div className="rounded-[12px] overflow-hidden" style={{ border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 40px 120px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1)" }}>
          <div className="flex" style={{ background: "#0e0f11" }}>
            {/* Sidebar — like Linear's nav */}
            <div className="hidden md:flex flex-col w-[232px] shrink-0 py-2" style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between px-3 py-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold text-white" style={{ background: C.accent }}>A</div>
                  <span className="text-[14px] font-medium text-[#f7f8f8]">askwijs</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[rgba(255,255,255,0.06)] cursor-pointer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#62666d" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  </div>
                  <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[rgba(255,255,255,0.06)] cursor-pointer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#62666d" strokeWidth="2"><path d="M12 5v14m-7-7h14"/></svg>
                  </div>
                </div>
              </div>

              <div className="px-2 space-y-0.5">
                {sidebarItems.map(item => (
                  <button key={item.label} onClick={() => setActiveTab(item.tab)}
                    className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md text-[13px] text-left transition-colors"
                    style={{ color: activeTab === item.tab ? C.text : C.faint, background: activeTab === item.tab ? "rgba(255,255,255,0.06)" : "transparent", border: "none", cursor: "pointer" }}>
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="px-2 mt-4">
                <div className="px-2 mb-1 text-[11px] font-medium text-[#3a3e47] uppercase tracking-wider">Tools</div>
                <div className="space-y-0.5">
                  {toolItems.map(item => (
                    <button key={item.label} onClick={() => setActiveTab(item.tab)}
                      className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md text-[13px] text-left transition-colors"
                      style={{ color: activeTab === item.tab ? C.text : C.faint, background: activeTab === item.tab ? "rgba(255,255,255,0.06)" : "transparent", border: "none", cursor: "pointer" }}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Top bar */}
              <div className="flex items-center justify-between px-5 h-[44px]" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-[13px] font-medium text-[#f7f8f8]">{activeTab}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#3a3e47] px-2 py-1 rounded" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>Q1 2026</span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: C.accent }}>N</div>
                </div>
              </div>

              {/* Content */}
              <div className="min-h-[520px]">
                {activeTab === "Overview" && <TabOverview />}
                {activeTab === "Transactions" && <TabTransactions />}
                {activeTab === "BTW" && <TabBTW />}
                {activeTab === "Invoices" && <TabInvoices />}
                {activeTab === "Receipts" && <TabReceipts />}
                {activeTab === "Banks" && <TabBanks />}
                {activeTab === "Settings" && <TabSettings />}
              </div>

              {/* Wijs chat bar */}
              <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: C.accent }}>W</div>
                  <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSendChat()}
                    placeholder="Ask Wijs anything about your finances..."
                    className="flex-1 text-[13px] text-[#f7f8f8] placeholder:text-[#3a3e47] outline-none bg-transparent" />
                  <button onClick={handleSendChat}
                    className="text-[12px] font-medium px-3 py-1.5 rounded-md transition-colors"
                    style={{ background: chatInput.trim() ? C.accent : "rgba(255,255,255,0.04)", color: "#fff", border: "none", cursor: "pointer" }}>
                    Send
                  </button>
                </div>
                {chatMessages.length > 1 && (
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                        {msg.role === "wijs" && <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0 mt-0.5" style={{ background: C.accent }}>W</div>}
                        <div className="text-[12px] leading-relaxed px-3 py-2 rounded-lg max-w-[80%]"
                          style={{ background: msg.role === "user" ? "rgba(94,106,210,0.15)" : "rgba(255,255,255,0.04)", color: msg.role === "user" ? "#c4c9f5" : C.muted }}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0 mt-0.5" style={{ background: C.accent }}>W</div>
                        <div className="text-[12px] text-[#62666d] px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
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
        </div>
      </div>
    </section>
  );
}

// ── Dashboard tabs ──────────────────────────────────────────────
function TabOverview() {
  return (
    <div className="p-5">
      <div className="mb-5">
        <h2 className="text-[14px] font-medium text-[#f7f8f8]">Good morning, Ned</h2>
        <p className="text-[12px] text-[#4a4e57] mt-1">Your Q1 BTW aangifte is ready to review.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Net income Q1", target: 9840, badge: "+18% vs Q4", bc: C.green },
          { label: "BTW position", target: 1890, badge: "Due 30 Apr", bc: C.orange },
          { label: "Deductions found", target: 4210, badge: "Auto-detected", bc: C.accent },
          { label: "Tax forecast", target: 6340, badge: "Income tax", bc: C.faint },
        ].map(s => (
          <div key={s.label} className="rounded-lg p-4" style={{ background: C.surface, border: `1px solid ${C.borderSubtle}` }}>
            <div className="text-[10px] font-medium uppercase tracking-wider text-[#3a3e47] mb-2">{s.label}</div>
            <div className="text-[18px] font-medium text-[#f7f8f8]" style={{ fontVariantNumeric: "tabular-nums" }}>
              <CountUp target={s.target} prefix={"\u20AC"} />
            </div>
            <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mt-2" style={{ background: `${s.bc}15`, color: s.bc }}>{s.badge}</span>
          </div>
        ))}
      </div>
      <div className="rounded-lg" style={{ border: `1px solid ${C.borderSubtle}` }}>
        <div className="px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-[#3a3e47]" style={{ borderBottom: `1px solid ${C.borderSubtle}` }}>Recent transactions</div>
        {TRANSACTIONS.slice(0, 5).map((tx, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: i < 4 ? `1px solid ${C.borderSubtle}` : "none" }}>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#3a3e47] w-[44px]" style={{ fontVariantNumeric: "tabular-nums" }}>{tx.date}</span>
              <span className="text-[13px] text-[#8a8f98]">{tx.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${tx.color}15`, color: tx.color }}>{tx.cat}</span>
              <span className="text-[13px] font-medium w-[90px] text-right" style={{ fontVariantNumeric: "tabular-nums", color: tx.amt > 0 ? C.green : C.text }}>
                {tx.amt > 0 ? "+" : ""}&euro;{Math.abs(tx.amt).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabTransactions() {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[14px] font-medium text-[#f7f8f8]">Transactions</h2>
        <span className="text-[11px] text-[#3a3e47]">Q1 2026</span>
      </div>
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.borderSubtle}` }}>
        <div className="grid grid-cols-[50px_1fr_90px_100px] gap-2 px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-[#3a3e47]" style={{ background: C.surface }}>
          <span>Date</span><span>Description</span><span>Category</span><span className="text-right">Amount</span>
        </div>
        {TRANSACTIONS.map((tx, i) => (
          <div key={i} className="grid grid-cols-[50px_1fr_90px_100px] gap-2 px-4 py-2.5 items-center" style={{ borderTop: `1px solid ${C.borderSubtle}` }}>
            <span className="text-[11px] text-[#3a3e47]" style={{ fontVariantNumeric: "tabular-nums" }}>{tx.date}</span>
            <span className="text-[13px] text-[#8a8f98]">{tx.name}</span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full w-fit" style={{ background: `${tx.color}15`, color: tx.color }}>{tx.cat}</span>
            <span className="text-[13px] font-medium text-right" style={{ fontVariantNumeric: "tabular-nums", color: tx.amt > 0 ? C.green : C.text }}>
              {tx.amt > 0 ? "+" : ""}&euro;{Math.abs(tx.amt).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabBTW() {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[14px] font-medium text-[#f7f8f8]">BTW aangifte Q1 2026</h2>
          <p className="text-[12px] text-[#4a4e57] mt-1">Pre-filled from your transactions.</p>
        </div>
        <button className="text-[12px] font-medium px-4 py-2 rounded-md text-white" style={{ background: C.accent, border: "none", cursor: "pointer" }}>Submit to Belastingdienst</button>
      </div>
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.borderSubtle}` }}>
        {BTW_BOXES.map((box, i) => (
          <div key={box.box} className="flex items-center justify-between px-4 py-3" style={{ borderTop: i > 0 ? `1px solid ${C.borderSubtle}` : "none", background: box.box === "5g" ? "rgba(94,106,210,0.04)" : "transparent" }}>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium w-6" style={{ color: C.accent, fontVariantNumeric: "tabular-nums" }}>{box.box}</span>
              <span className="text-[13px] text-[#8a8f98]">{box.label}</span>
            </div>
            <span className="text-[13px] font-medium text-[#f7f8f8]" style={{ fontVariantNumeric: "tabular-nums" }}>&euro;{box.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabInvoices() {
  const invoices = [
    { id: "INV-2026-012", client: "Acme BV", amount: "3.500,00", status: "Paid", sc: C.green, date: "27 Mar" },
    { id: "INV-2026-011", client: "TechStart NL", amount: "2.100,00", status: "Paid", sc: C.green, date: "23 Mar" },
    { id: "INV-2026-013", client: "Design Co", amount: "1.750,00", status: "Sent", sc: C.orange, date: "30 Mar" },
    { id: "INV-2026-014", client: "Startup Labs", amount: "4.200,00", status: "Draft", sc: C.faint, date: "1 Apr" },
  ];
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[14px] font-medium text-[#f7f8f8]">Invoices</h2>
        <button className="text-[12px] font-medium px-4 py-2 rounded-md text-white" style={{ background: C.accent, border: "none", cursor: "pointer" }}>New invoice</button>
      </div>
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.borderSubtle}` }}>
        {invoices.map((inv, i) => (
          <div key={inv.id} className="flex items-center justify-between px-4 py-3" style={{ borderTop: i > 0 ? `1px solid ${C.borderSubtle}` : "none" }}>
            <div className="flex items-center gap-4">
              <span className="text-[12px] text-[#5e6ad2]" style={{ fontVariantNumeric: "tabular-nums" }}>{inv.id}</span>
              <span className="text-[13px] text-[#8a8f98]">{inv.client}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${inv.sc}15`, color: inv.sc }}>{inv.status}</span>
              <span className="text-[13px] font-medium text-[#f7f8f8] w-[80px] text-right" style={{ fontVariantNumeric: "tabular-nums" }}>&euro;{inv.amount}</span>
              <span className="text-[11px] text-[#3a3e47] w-[44px]">{inv.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabReceipts() {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div className="p-5">
      <h2 className="text-[14px] font-medium text-[#f7f8f8] mb-4">Receipts</h2>
      <div className="flex flex-col items-center justify-center py-12 rounded-lg transition-colors"
        style={{ border: `2px dashed ${dragOver ? C.accent : "rgba(255,255,255,0.08)"}`, background: dragOver ? "rgba(94,106,210,0.04)" : C.surface }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mb-3" style={{ color: "#3a3e47" }}><path d="M12 16V4m0 0l-4 4m4-4l4 4M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <p className="text-[13px] text-[#8a8f98]">Drop receipts here or click to upload</p>
        <p className="text-[11px] text-[#3a3e47] mt-1">Wijs auto-matches to transactions</p>
      </div>
      <div className="mt-3 space-y-2">
        {[{ name: "receipt_wework_mar.pdf", match: "WeWork Amsterdam" }, { name: "adobe_invoice_mar.pdf", match: "Adobe Creative Cloud" }].map(r => (
          <div key={r.name} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: C.surface, border: `1px solid ${C.borderSubtle}` }}>
            <div><div className="text-[12px] text-[#8a8f98]">{r.name}</div><div className="text-[10px] text-[#3a3e47]">Matched to {r.match}</div></div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${C.green}15`, color: C.green }}>Matched</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabBanks() {
  const banks = [
    { name: "ING Zakelijk", iban: "NL91 INGB 0001 2345 67", balance: "8.420,50", color: "#ff6200" },
    { name: "Bunq Business", iban: "NL44 BUNQ 2034 5678 90", balance: "3.105,20", color: "#30c381" },
  ];
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[14px] font-medium text-[#f7f8f8]">Connected banks</h2>
        <button className="text-[12px] font-medium px-4 py-2 rounded-md text-white" style={{ background: C.accent, border: "none", cursor: "pointer" }}>Connect bank</button>
      </div>
      <div className="space-y-2">
        {banks.map(b => (
          <div key={b.iban} className="flex items-center justify-between px-4 py-4 rounded-lg" style={{ background: C.surface, border: `1px solid ${C.borderSubtle}` }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ background: b.color }} />
              <div>
                <div className="text-[13px] text-[#f7f8f8] font-medium">{b.name}</div>
                <div className="text-[11px] text-[#3a3e47]" style={{ fontVariantNumeric: "tabular-nums" }}>{b.iban}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[14px] font-medium text-[#f7f8f8]" style={{ fontVariantNumeric: "tabular-nums" }}>&euro;{b.balance}</div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${C.green}15`, color: C.green }}>Synced</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabSettings() {
  return (
    <div className="p-5">
      <h2 className="text-[14px] font-medium text-[#f7f8f8] mb-4">Settings</h2>
      <div className="space-y-2">
        {[{ l: "Language", v: "English" }, { l: "Currency", v: "EUR (\u20AC)" }, { l: "BTW regime", v: "Standard (21%/9%)" }, { l: "KVK nummer", v: "90123456" }, { l: "BTW-id", v: "NL004567890B01" }].map(s => (
          <div key={s.l} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: C.surface, border: `1px solid ${C.borderSubtle}` }}>
            <span className="text-[13px] text-[#8a8f98]">{s.l}</span>
            <span className="text-[13px] text-[#f7f8f8]" style={{ fontVariantNumeric: "tabular-nums" }}>{s.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  INTRO TEXT — Linear style: bold white + muted gray continuation
// ══════════════════════════════════════════════════════════════════
function IntroText() {
  const ref = useFadeIn<HTMLDivElement>();
  return (
    <section ref={ref} className="pt-[128px] pb-[64px]"
      style={{ paddingLeft: "max(32px, calc((100vw - 1436px) / 2 + 46px))", paddingRight: "max(32px, calc((100vw - 1436px) / 2 + 46px))" }}>
      <p className="text-[24px] leading-[1.45] max-w-[900px]">
        <span className="font-medium text-[#f7f8f8]">A new kind of financial tool.</span>{" "}
        <span className="text-[#8a8f98]">Purpose-built for freelancers and expats in the Netherlands. Designed to replace your boekhouder, not just assist them.</span>
      </p>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
//  THREE CARDS — Linear style: illustration placeholder + title + desc
// ══════════════════════════════════════════════════════════════════
function ThreeCards() {
  const ref = useFadeIn<HTMLDivElement>();
  const cards = [
    { title: "Built for expats", desc: "Full English and Dutch. Every tax term explained. Switch languages anytime.", fig: "0.2" },
    { title: "Powered by AI", desc: "Wijs categorizes transactions, finds deductions, and answers your tax questions.", fig: "0.3" },
    { title: "Designed for speed", desc: "Connect your bank in seconds. BTW pre-filled in minutes. File in one click.", fig: "0.4" },
  ];
  return (
    <section id="features" ref={ref} className="pb-[96px]"
      style={{ paddingLeft: "max(32px, calc((100vw - 1436px) / 2 + 46px))", paddingRight: "max(32px, calc((100vw - 1436px) / 2 + 46px))" }}>
      <div className="grid md:grid-cols-3 gap-6 max-w-[1344px]">
        {cards.map(c => (
          <div key={c.title} className="rounded-xl p-6" style={{ background: C.surface, border: `1px solid ${C.borderSubtle}` }}>
            <div className="text-[11px] text-[#3a3e47] uppercase tracking-wider mb-4">FIG {c.fig}</div>
            {/* Illustration placeholder — geometric shapes like Linear */}
            <div className="h-[200px] mb-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.borderSubtle}` }}>
              <div className="w-16 h-16 rounded-xl" style={{ border: `1px solid rgba(255,255,255,0.08)` }} />
            </div>
            <h3 className="text-[16px] font-medium text-[#f7f8f8] mb-2">{c.title}</h3>
            <p className="text-[14px] text-[#8a8f98] leading-[1.5]">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
//  DIVIDER — full-width 1px line like Linear
// ══════════════════════════════════════════════════════════════════
function Divider() {
  return <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.06)" }} />;
}

// ══════════════════════════════════════════════════════════════════
//  NUMBERED SECTIONS — Linear style: heading left / desc right, number below, content full-width
// ══════════════════════════════════════════════════════════════════
function NumberedSection({ num, label, heading, desc, children, id }: {
  num: string; label: string; heading: string; desc: string; children: React.ReactNode; id?: string;
}) {
  const ref = useFadeIn<HTMLDivElement>();
  return (
    <section id={id} ref={ref} className="py-[96px]"
      style={{ paddingLeft: "max(32px, calc((100vw - 1436px) / 2 + 46px))", paddingRight: "max(32px, calc((100vw - 1436px) / 2 + 46px))" }}>
      <div className="max-w-[1344px]">
        {/* Header row: heading left, description right */}
        <div className="grid md:grid-cols-2 gap-8 mb-2">
          <h2 className="text-[32px] font-medium leading-[1.2] tracking-[-0.02em] text-[#f7f8f8]">{heading}</h2>
          <p className="text-[16px] text-[#8a8f98] leading-[1.6]">{desc}</p>
        </div>

        {/* Section number + label */}
        <div className="flex items-center gap-3 mb-8 text-[14px] text-[#8a8f98]">
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{num}</span>
          <span>{label} &rarr;</span>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </section>
  );
}

// Section 1: Categorization (Intake equivalent)
function SectionIntake() {
  const [visible, setVisible] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);
  const txs = [
    { name: "Adobe Creative Cloud", to: "Software", color: C.accent, amt: "-\u20AC60,49" },
    { name: "Client - Acme BV", to: "Revenue", color: C.green, amt: "+\u20AC3.500,00" },
    { name: "WeWork Amsterdam", to: "Office", color: C.orange, amt: "-\u20AC290,00" },
    { name: "NS Business Card", to: "Travel", color: C.accent, amt: "-\u20AC89,00" },
    { name: "Bol.com - Monitor", to: "Equipment", color: C.red, amt: "-\u20AC349,00" },
  ];
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let i = 0;
        const interval = setInterval(() => { i++; setVisible(i); if (i >= txs.length) clearInterval(interval); }, 500);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <NumberedSection num="1.0" label="Categorize" heading="Make transaction categorization self-driving"
      desc="Turn raw bank transactions into organized, tax-ready categories. Wijs uses AI to tag every transaction: business or personal, deductible or not, correct BTW rate applied.">
      <div ref={ref} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.borderSubtle}` }}>
        <div className="px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-[#3a3e47]" style={{ background: C.surface, borderBottom: `1px solid ${C.borderSubtle}` }}>
          Auto-categorization
        </div>
        {txs.map((tx, i) => (
          <div key={tx.name} className="flex items-center justify-between px-5 py-3 transition-all duration-500"
            style={{ borderTop: `1px solid ${C.borderSubtle}`, background: i < visible ? "rgba(255,255,255,0.02)" : "transparent" }}>
            <span className="text-[13px] text-[#8a8f98]">{tx.name}</span>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full transition-all duration-500"
                style={{ background: i < visible ? `${tx.color}15` : "rgba(255,255,255,0.04)", color: i < visible ? tx.color : "#3a3e47" }}>
                {i < visible ? tx.to : "Uncategorized"}
              </span>
              <span className="text-[13px] font-medium text-[#8a8f98] w-[90px] text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{tx.amt}</span>
            </div>
          </div>
        ))}
      </div>
    </NumberedSection>
  );
}

// Section 2: BTW
function SectionBTW() {
  const [filled, setFilled] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let i = 0;
        const interval = setInterval(() => { i++; setFilled(i); if (i >= BTW_BOXES.length) clearInterval(interval); }, 350);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <NumberedSection num="2.0" label="File" heading="Your quarterly BTW. Pre-filled, ready to submit."
      desc="Wijs calculates every rubriek from your real transaction data. Review the numbers, click submit. No more staring at empty Belastingdienst forms.">
      <div ref={ref} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.borderSubtle}` }}>
        <div className="px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-[#3a3e47]" style={{ background: C.surface, borderBottom: `1px solid ${C.borderSubtle}` }}>
          BTW aangifte Q1 2026
        </div>
        {BTW_BOXES.map((box, i) => (
          <div key={box.box} className="flex items-center justify-between px-5 py-3 transition-all duration-500"
            style={{ borderTop: `1px solid ${C.borderSubtle}`, background: box.box === "5g" && i < filled ? "rgba(94,106,210,0.04)" : "transparent" }}>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium w-6" style={{ color: C.accent, fontVariantNumeric: "tabular-nums" }}>{box.box}</span>
              <span className="text-[13px] text-[#8a8f98]">{box.label}</span>
            </div>
            <span className="text-[13px] font-medium transition-all duration-500" style={{ fontVariantNumeric: "tabular-nums", color: i < filled ? C.text : "#3a3e47" }}>
              {i < filled ? `\u20AC${box.amount}` : "\u20AC--,--"}
            </span>
          </div>
        ))}
      </div>
    </NumberedSection>
  );
}

// Section 3: Ask Wijs AI
const WIJS_CONVERSATION: Array<{ role: "user" | "wijs"; text: string }> = [
  { role: "wijs", text: "Yes. Your WeWork membership (\u20AC290/mo) qualifies as a business expense. 100% deductible including BTW. That's \u20AC3.480/year." },
  { role: "user", text: "What about my home office?" },
  { role: "wijs", text: "With 15% home office use, you can deduct \u20AC217,50/mo from your \u20AC1.450 rent, plus proportional utilities and internet." },
];

function SectionWijs() {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let i = 0;
        const interval = setInterval(() => { i++; setCount(i); if (i >= WIJS_CONVERSATION.length) clearInterval(interval); }, 1500);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const msgs: Array<{ role: "user" | "wijs"; text: string }> = [
    { role: "user", text: "Can I deduct my WeWork membership?" },
    ...WIJS_CONVERSATION.slice(0, count),
  ];

  return (
    <NumberedSection num="3.0" label="Ask Wijs" heading="Your AI financial advisor. Always available."
      desc="Ask Wijs anything about your Dutch taxes, deductions, BTW, or business finances. Answers grounded in your actual transaction data.">
      <div ref={ref} className="rounded-xl p-5 space-y-3" style={{ background: C.surface, border: `1px solid ${C.borderSubtle}` }}>
        {msgs.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "wijs" && <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5" style={{ background: C.accent }}>W</div>}
            <div className="text-[13px] leading-relaxed px-4 py-3 rounded-xl max-w-[85%]"
              style={{ background: msg.role === "user" ? "rgba(94,106,210,0.12)" : "rgba(255,255,255,0.04)", color: msg.role === "user" ? "#c4c9f5" : C.muted }}>
              {msg.text}
            </div>
          </div>
        ))}
        {count > 0 && count < WIJS_CONVERSATION.length && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5" style={{ background: C.accent }}>W</div>
            <div className="text-[13px] text-[#3a3e47] px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3a3e47] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#3a3e47] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#3a3e47] animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}
      </div>
    </NumberedSection>
  );
}

// Section 4: Receipts
function SectionReceipts() {
  const [dropped, setDropped] = useState(false);
  return (
    <NumberedSection num="4.0" label="Receipts" heading="Snap a photo. Wijs does the rest."
      desc="Upload or drag-drop any receipt. Wijs reads it with OCR, extracts the amount and BTW, and matches it to the right transaction.">
      <div className="space-y-3">
        <div className="flex flex-col items-center justify-center py-14 rounded-xl transition-all cursor-pointer"
          style={{ border: `2px dashed rgba(255,255,255,0.08)`, background: C.surface }}
          onClick={() => setDropped(true)}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mb-3" style={{ color: "#3a3e47" }}>
            <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-[13px] text-[#8a8f98]">Drop receipt here</p>
          <p className="text-[11px] text-[#3a3e47] mt-1">PDF, JPG, or PNG</p>
        </div>
        {dropped && (
          <div className="flex items-center justify-between px-5 py-3 rounded-lg" style={{ background: C.surface, border: `1px solid ${C.borderSubtle}` }}>
            <div>
              <div className="text-[12px] text-[#8a8f98]">receipt_wework_mar.pdf</div>
              <div className="text-[10px] text-[#3a3e47]">Matched to WeWork Amsterdam - &euro;290,00</div>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${C.green}15`, color: C.green }}>Matched</span>
          </div>
        )}
      </div>
    </NumberedSection>
  );
}

// Section 5: Banks
function SectionBanks() {
  const banks = [
    { name: "ING", color: "#ff6200", connected: true },
    { name: "ABN AMRO", color: "#004c3f", connected: false },
    { name: "Rabobank", color: "#0068b4", connected: false },
    { name: "Bunq", color: "#30c381", connected: true },
    { name: "Revolut", color: "#0075eb", connected: false },
    { name: "N26", color: "#48d2a0", connected: false },
  ];
  const [state, setState] = useState(banks.map(b => b.connected));

  return (
    <NumberedSection id="security" num="5.0" label="Connect" heading="Connect all your Dutch banks in seconds."
      desc="PSD2 Open Banking. Read-only access. askwijs can never move your money. Connect ING, ABN AMRO, Rabobank, Bunq, Revolut, N26, and more.">
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.borderSubtle}` }}>
        {banks.map((b, i) => (
          <div key={b.name} className="flex items-center justify-between px-5 py-3" style={{ borderTop: i > 0 ? `1px solid ${C.borderSubtle}` : "none" }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ background: b.color }} />
              <span className="text-[13px] text-[#8a8f98] font-medium">{b.name}</span>
            </div>
            {state[i] ? (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${C.green}15`, color: C.green }}>Connected</span>
            ) : (
              <button className="text-[10px] font-medium px-3 py-1 rounded-md transition-colors"
                style={{ background: "rgba(255,255,255,0.04)", color: "#8a8f98", border: `1px solid rgba(255,255,255,0.08)`, cursor: "pointer" }}
                onClick={() => setState(prev => { const n = [...prev]; n[i] = true; return n; })}>
                Connect
              </button>
            )}
          </div>
        ))}
      </div>
    </NumberedSection>
  );
}

// ══════════════════════════════════════════════════════════════════
//  PRICING
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
    <section id="pricing" ref={ref} className="py-[128px]"
      style={{ paddingLeft: "max(32px, calc((100vw - 1436px) / 2 + 46px))", paddingRight: "max(32px, calc((100vw - 1436px) / 2 + 46px))" }}>
      <div className="max-w-[560px] mx-auto text-center">
        <h2 className="text-[32px] font-medium leading-[1.2] tracking-[-0.02em] text-[#f7f8f8] mb-3">Simple pricing. No surprises.</h2>
        <p className="text-[16px] text-[#8a8f98] mb-12">One plan. Everything included. Cancel anytime.</p>

        <div className="rounded-xl p-8 text-left relative overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.borderSubtle}` }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)` }} />
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-[48px] font-medium text-[#f7f8f8]" style={{ fontVariantNumeric: "tabular-nums" }}>&euro;19,99</span>
              <span className="text-[16px] text-[#3a3e47]">/month</span>
            </div>
            <p className="text-[13px] text-[#3a3e47] mt-2">excl. BTW &middot; first month free</p>
          </div>
          <div className="space-y-3 mb-8">
            {features.map(f => (
              <div key={f} className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5"><path d="M3 8l3.5 3.5L13 5" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="text-[14px] text-[#8a8f98]">{f}</span>
              </div>
            ))}
          </div>
          <Link to="/signup" className="block w-full text-center text-white text-[14px] font-medium py-3 rounded-lg transition-all hover:-translate-y-px"
            style={{ background: C.accent }}>Start free trial</Link>
          <p className="text-center text-[12px] text-[#3a3e47] mt-3">No credit card required</p>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
//  CTA — Linear style: centered heading, 2 buttons
// ══════════════════════════════════════════════════════════════════
function CTA() {
  const ref = useFadeIn<HTMLDivElement>();
  return (
    <section ref={ref} className="py-[128px] text-center"
      style={{ paddingLeft: "max(32px, calc((100vw - 1436px) / 2 + 46px))", paddingRight: "max(32px, calc((100vw - 1436px) / 2 + 46px))" }}>
      <h2 className="text-[48px] font-medium leading-[1.15] tracking-[-0.03em] text-[#f7f8f8] mb-8">
        Built for freelancers.{"\n"}<span className="block">Available today.</span>
      </h2>
      <div className="flex items-center justify-center gap-3">
        <Link to="/signup" className="text-[14px] font-medium text-white px-5 py-2.5 rounded-[8px] transition-all hover:-translate-y-px"
          style={{ background: C.accent }}>Get started</Link>
        <a href="mailto:hello@askwijs.ai" className="text-[14px] font-medium px-5 py-2.5 rounded-[8px] transition-all hover:bg-[rgba(255,255,255,0.06)]"
          style={{ background: "rgba(255,255,255,0.04)", color: C.text, border: `1px solid ${C.borderSubtle}` }}>Contact us</a>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
//  FOOTER — Linear style: 5-column link grid
// ══════════════════════════════════════════════════════════════════
function Footer() {
  const cols = [
    { title: "Product", links: ["Categorize", "BTW Filing", "Ask Wijs", "Receipts", "Banks", "Pricing", "Security"] },
    { title: "Features", links: ["AI Categorization", "BTW Aangifte", "Receipt OCR", "Bank Sync", "Tax Forecast", "Invoicing"] },
    { title: "Company", links: ["About", "Blog", "Careers", "Privacy", "Terms"] },
    { title: "Resources", links: ["Documentation", "API", "Status", "Changelog"] },
    { title: "Connect", links: ["Contact", "X (Twitter)", "LinkedIn", "GitHub"] },
  ];
  return (
    <footer className="py-[64px]" style={{
      borderTop: `1px solid ${C.borderSubtle}`,
      paddingLeft: "max(32px, calc((100vw - 1436px) / 2 + 46px))",
      paddingRight: "max(32px, calc((100vw - 1436px) / 2 + 46px))",
    }}>
      <div className="max-w-[1344px]">
        <div className="flex flex-col md:flex-row gap-12 mb-12">
          {/* Logo */}
          <div className="md:w-[200px] shrink-0">
            <Link to="/" className="text-[16px] font-semibold text-[#f7f8f8] no-underline tracking-tight">
              ask<span style={{ color: C.accent }}>wijs</span>
            </Link>
          </div>
          {/* Columns */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 flex-1">
            {cols.map(col => (
              <div key={col.title}>
                <div className="text-[13px] font-medium text-[#f7f8f8] mb-4">{col.title}</div>
                <div className="space-y-2.5">
                  {col.links.map(l => (
                    <a key={l} href="#" className="block text-[13px] text-[#62666d] hover:text-[#8a8f98] transition-colors">{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom */}
        <div className="flex items-center gap-6 text-[13px] text-[#3a3e47]" style={{ borderTop: `1px solid ${C.borderSubtle}`, paddingTop: "24px" }}>
          <span>Privacy</span>
          <span>Terms</span>
          <span>&copy; 2026 askwijs</span>
        </div>
      </div>
    </footer>
  );
}
