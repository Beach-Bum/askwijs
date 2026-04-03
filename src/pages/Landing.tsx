import { useState, useEffect, useRef, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/* ================================================================
   askwijs Landing Page
   Layout: Exact copy of linear.app/homepage structure
   ================================================================ */

// ── Palette (DESIGN.md — Warm Premium Dark) ─────────────────────
const C = {
  bg: "#0B0F1A",
  surface: "#111827",
  surfaceHover: "#1F2937",
  border: "rgba(255,255,255,0.08)",
  borderSubtle: "rgba(255,255,255,0.04)",
  text: "#F9FAFB",
  muted: "#9CA3AF",
  faint: "#6B7280",
  dim: "#4B5563",
  accent: "#2563EB",
  accentHover: "#3B82F6",
  accentPale: "rgba(37, 99, 235, 0.12)",
  green: "#059669",
  greenPale: "rgba(5, 150, 105, 0.12)",
  orange: "#D97706",
  orangePale: "rgba(217, 119, 6, 0.12)",
  red: "#DC2626",
  redPale: "rgba(220, 38, 38, 0.12)",
};

// ── Fade-in on scroll ───────────────────────────────────────────
function useFadeIn<T extends HTMLElement>(): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Respect prefers-reduced-motion — show content immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      return;
    }
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
    <div className="min-h-screen text-[#F9FAFB] overflow-x-hidden" style={{ background: C.bg }}>
      <Nav />
      <main>
        <Hero />
        <DashboardDemo />
        <IntroText />
        <SocialProof />
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
        <Disclaimer />
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
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // Close mobile menu on route change / resize
  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[72px] transition-all duration-300"
        style={{
          paddingLeft: "max(32px, calc((100vw - 1436px) / 2 + 46px))",
          paddingRight: "max(32px, calc((100vw - 1436px) / 2 + 46px))",
          background: scrolled || mobileOpen ? "rgba(11,15,26,0.95)" : "linear-gradient(180deg, rgba(11,15,26,0.8) 0%, transparent 100%)",
          backdropFilter: scrolled || mobileOpen ? "blur(20px) saturate(1.4)" : "none",
          borderBottom: scrolled ? `1px solid ${C.borderSubtle}` : "1px solid transparent",
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          opacity: visible ? 1 : 0,
        }}>
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img src="/logo-white.svg" alt="askwijs" className="h-6 w-auto" />
          <span className="text-[16px] font-semibold text-[#F9FAFB] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            ask<span style={{ color: C.accent }}>wijs</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="#features">Product</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#security">Banks</NavLink>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden md:inline text-[14px] text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors">Log in</Link>
          <Link to="/signup" className="hidden md:inline text-[14px] font-medium text-white px-4 py-2 rounded-[8px] transition-all hover:brightness-110"
            style={{ background: C.accent }}>Sign up</Link>
          {/* Mobile hamburger */}
          <button className="md:hidden flex flex-col gap-[5px] p-2 -mr-2" onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu" aria-expanded={mobileOpen}>
            <span className="block w-5 h-[1.5px] bg-[#F9FAFB] transition-all duration-200"
              style={{ transform: mobileOpen ? "rotate(45deg) translate(2px, 2px)" : "none" }} />
            <span className="block w-5 h-[1.5px] bg-[#F9FAFB] transition-all duration-200"
              style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span className="block w-5 h-[1.5px] bg-[#F9FAFB] transition-all duration-200"
              style={{ transform: mobileOpen ? "rotate(-45deg) translate(2px, -2px)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ background: "rgba(11,15,26,0.95)", backdropFilter: "blur(20px)", paddingTop: 72 }}>
          <div className="flex flex-col items-start gap-1 px-8 py-6">
            <a href="#features" onClick={() => setMobileOpen(false)} className="text-[16px] text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors py-3 w-full">Product</a>
            <a href="#pricing" onClick={() => setMobileOpen(false)} className="text-[16px] text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors py-3 w-full">Pricing</a>
            <a href="#security" onClick={() => setMobileOpen(false)} className="text-[16px] text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors py-3 w-full">Banks</a>
            <div className="w-full h-px my-3" style={{ background: C.border }} />
            <Link to="/login" onClick={() => setMobileOpen(false)} className="text-[16px] text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors py-3 w-full">Log in</Link>
            <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-[14px] font-medium text-white text-center py-3 rounded-[8px] w-full mt-2 transition-all"
              style={{ background: C.accent }}>Sign up</Link>
          </div>
        </div>
      )}
    </>
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
        {/* Heading — emotional hook */}
        <h1 className="text-[40px] sm:text-[56px] leading-[1.12] tracking-[-0.02em] text-[#F9FAFB] mb-4 max-w-[800px]" style={{ fontFamily: "'Lora', serif", fontWeight: 600 }}>
          Stop dreading{"\n"}
          <span className="block">April 30.</span>
        </h1>
        <p className="text-[18px] sm:text-[22px] font-medium text-[#9CA3AF] leading-[1.4] mb-8 max-w-[640px]">
          Your Dutch taxes, fully automated. Connect your bank, and askwijs handles BTW (Dutch VAT), categorization, and filing.
        </p>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
          <Link to="/signup" className="text-[14px] font-medium text-white px-6 py-3 rounded-[8px] transition-all hover:-translate-y-px hover:brightness-110"
            style={{ background: C.accent }}>Start free trial</Link>
          <span className="text-[13px] text-[#4B5563]">No credit card required &middot; 30 days free</span>
        </div>

        {/* Social proof bar */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-[13px]">
          <div>
            <span className="text-[#F9FAFB] font-medium">PSD2 Open Banking</span>
            <span className="text-[#4B5563] ml-1.5">read-only access</span>
          </div>
          <div className="h-3 w-px bg-[rgba(255,255,255,0.08)]" />
          <div>
            <span className="text-[#F9FAFB] font-medium">EU-hosted</span>
            <span className="text-[#4B5563] ml-1.5">GDPR compliant</span>
          </div>
          <div className="h-3 w-px bg-[rgba(255,255,255,0.08)]" />
          <div>
            <span className="text-[#F9FAFB] font-medium">30 days free</span>
            <span className="text-[#4B5563] ml-1.5">no credit card required</span>
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
    else if (lower.includes("revenue") || lower.includes("income")) response = "Q1 revenue: \u20AC5.600 across 2 clients. 18% above Q4. You may exceed the KOR threshold (small business VAT exemption) by August.";
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
          <div className="flex" style={{ background: C.bg }}>
            {/* Sidebar — like Linear's nav */}
            <div className="hidden md:flex flex-col w-[232px] shrink-0 py-2" style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between px-3 py-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold text-white" style={{ background: C.accent }}>A</div>
                  <span className="text-[14px] font-medium text-[#F9FAFB]">askwijs</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[rgba(255,255,255,0.06)] cursor-pointer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  </div>
                  <div className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[rgba(255,255,255,0.06)] cursor-pointer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><path d="M12 5v14m-7-7h14"/></svg>
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
                <div className="px-2 mb-1 text-[11px] font-medium text-[#4B5563] uppercase tracking-wider">Tools</div>
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
                <span className="text-[13px] font-medium text-[#F9FAFB]">{activeTab}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#4B5563] px-2 py-1 rounded" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>Q1 2026</span>
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
                    className="flex-1 text-[13px] text-[#F9FAFB] placeholder:text-[#4B5563] outline-none bg-transparent" />
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
                          style={{ background: msg.role === "user" ? "rgba(37,99,235,0.15)" : "rgba(255,255,255,0.04)", color: msg.role === "user" ? "#93B4F6" : C.muted }}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0 mt-0.5" style={{ background: C.accent }}>W</div>
                        <div className="text-[12px] text-[#6B7280] px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
                          <span className="inline-flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6B7280] animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6B7280] animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6B7280] animate-bounce" style={{ animationDelay: "300ms" }} />
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
        <h2 className="text-[14px] font-medium text-[#F9FAFB]">Good morning</h2>
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
            <div className="text-[10px] font-medium uppercase tracking-wider text-[#4B5563] mb-2">{s.label}</div>
            <div className="text-[18px] font-medium text-[#F9FAFB]" style={{ fontVariantNumeric: "tabular-nums" }}>
              <CountUp target={s.target} prefix={"\u20AC"} />
            </div>
            <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mt-2" style={{ background: `${s.bc}15`, color: s.bc }}>{s.badge}</span>
          </div>
        ))}
      </div>
      <div className="rounded-lg" style={{ border: `1px solid ${C.borderSubtle}` }}>
        <div className="px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-[#4B5563]" style={{ borderBottom: `1px solid ${C.borderSubtle}` }}>Recent transactions</div>
        {TRANSACTIONS.slice(0, 5).map((tx, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: i < 4 ? `1px solid ${C.borderSubtle}` : "none" }}>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#4B5563] w-[44px]" style={{ fontVariantNumeric: "tabular-nums" }}>{tx.date}</span>
              <span className="text-[13px] text-[#9CA3AF]">{tx.name}</span>
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
        <h2 className="text-[14px] font-medium text-[#F9FAFB]">Transactions</h2>
        <span className="text-[11px] text-[#4B5563]">Q1 2026</span>
      </div>
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.borderSubtle}` }}>
        <div className="grid grid-cols-[50px_1fr_90px_100px] gap-2 px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-[#4B5563]" style={{ background: C.surface }}>
          <span>Date</span><span>Description</span><span>Category</span><span className="text-right">Amount</span>
        </div>
        {TRANSACTIONS.map((tx, i) => (
          <div key={i} className="grid grid-cols-[50px_1fr_90px_100px] gap-2 px-4 py-2.5 items-center" style={{ borderTop: `1px solid ${C.borderSubtle}` }}>
            <span className="text-[11px] text-[#4B5563]" style={{ fontVariantNumeric: "tabular-nums" }}>{tx.date}</span>
            <span className="text-[13px] text-[#9CA3AF]">{tx.name}</span>
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
          <h2 className="text-[14px] font-medium text-[#F9FAFB]">BTW aangifte Q1 2026</h2>
          <p className="text-[12px] text-[#4a4e57] mt-1">Pre-filled from your transactions.</p>
        </div>
        <button className="text-[12px] font-medium px-4 py-2 rounded-md text-white" style={{ background: C.accent, border: "none", cursor: "pointer" }}>Submit to Belastingdienst</button>
      </div>
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.borderSubtle}` }}>
        {BTW_BOXES.map((box, i) => (
          <div key={box.box} className="flex items-center justify-between px-4 py-3" style={{ borderTop: i > 0 ? `1px solid ${C.borderSubtle}` : "none", background: box.box === "5g" ? "rgba(37,99,235,0.04)" : "transparent" }}>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium w-6" style={{ color: C.accent, fontVariantNumeric: "tabular-nums" }}>{box.box}</span>
              <span className="text-[13px] text-[#9CA3AF]">{box.label}</span>
            </div>
            <span className="text-[13px] font-medium text-[#F9FAFB]" style={{ fontVariantNumeric: "tabular-nums" }}>&euro;{box.amount}</span>
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
        <h2 className="text-[14px] font-medium text-[#F9FAFB]">Invoices</h2>
        <button className="text-[12px] font-medium px-4 py-2 rounded-md text-white" style={{ background: C.accent, border: "none", cursor: "pointer" }}>New invoice</button>
      </div>
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.borderSubtle}` }}>
        {invoices.map((inv, i) => (
          <div key={inv.id} className="flex items-center justify-between px-4 py-3" style={{ borderTop: i > 0 ? `1px solid ${C.borderSubtle}` : "none" }}>
            <div className="flex items-center gap-4">
              <span className="text-[12px] text-[#2563EB]" style={{ fontVariantNumeric: "tabular-nums" }}>{inv.id}</span>
              <span className="text-[13px] text-[#9CA3AF]">{inv.client}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${inv.sc}15`, color: inv.sc }}>{inv.status}</span>
              <span className="text-[13px] font-medium text-[#F9FAFB] w-[80px] text-right" style={{ fontVariantNumeric: "tabular-nums" }}>&euro;{inv.amount}</span>
              <span className="text-[11px] text-[#4B5563] w-[44px]">{inv.date}</span>
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
      <h2 className="text-[14px] font-medium text-[#F9FAFB] mb-4">Receipts</h2>
      <div className="flex flex-col items-center justify-center py-12 rounded-lg transition-colors"
        style={{ border: `2px dashed ${dragOver ? C.accent : "rgba(255,255,255,0.08)"}`, background: dragOver ? "rgba(37,99,235,0.04)" : C.surface }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mb-3" style={{ color: C.dim }}><path d="M12 16V4m0 0l-4 4m4-4l4 4M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <p className="text-[13px] text-[#9CA3AF]">Drop receipts here or click to upload</p>
        <p className="text-[11px] text-[#4B5563] mt-1">Wijs auto-matches to transactions</p>
      </div>
      <div className="mt-3 space-y-2">
        {[{ name: "receipt_wework_mar.pdf", match: "WeWork Amsterdam" }, { name: "adobe_invoice_mar.pdf", match: "Adobe Creative Cloud" }].map(r => (
          <div key={r.name} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: C.surface, border: `1px solid ${C.borderSubtle}` }}>
            <div><div className="text-[12px] text-[#9CA3AF]">{r.name}</div><div className="text-[10px] text-[#4B5563]">Matched to {r.match}</div></div>
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
        <h2 className="text-[14px] font-medium text-[#F9FAFB]">Connected banks</h2>
        <button className="text-[12px] font-medium px-4 py-2 rounded-md text-white" style={{ background: C.accent, border: "none", cursor: "pointer" }}>Connect bank</button>
      </div>
      <div className="space-y-2">
        {banks.map(b => (
          <div key={b.iban} className="flex items-center justify-between px-4 py-4 rounded-lg" style={{ background: C.surface, border: `1px solid ${C.borderSubtle}` }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ background: b.color }} />
              <div>
                <div className="text-[13px] text-[#F9FAFB] font-medium">{b.name}</div>
                <div className="text-[11px] text-[#4B5563]" style={{ fontVariantNumeric: "tabular-nums" }}>{b.iban}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[14px] font-medium text-[#F9FAFB]" style={{ fontVariantNumeric: "tabular-nums" }}>&euro;{b.balance}</div>
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
      <h2 className="text-[14px] font-medium text-[#F9FAFB] mb-4">Settings</h2>
      <div className="space-y-2">
        {[{ l: "Language", v: "English" }, { l: "Currency", v: "EUR (\u20AC)" }, { l: "BTW regime", v: "Standard (21%/9%)" }, { l: "KVK nummer", v: "90123456" }, { l: "BTW-id", v: "NL004567890B01" }].map(s => (
          <div key={s.l} className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: C.surface, border: `1px solid ${C.borderSubtle}` }}>
            <span className="text-[13px] text-[#9CA3AF]">{s.l}</span>
            <span className="text-[13px] text-[#F9FAFB]" style={{ fontVariantNumeric: "tabular-nums" }}>{s.v}</span>
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
        <span className="text-[#F9FAFB]" style={{ fontFamily: "'Lora', serif", fontWeight: 600 }}>A new kind of financial tool.</span>{" "}
        <span className="text-[#9CA3AF]">Purpose-built for freelancers and expats in the Netherlands. Handles the work your boekhouder (bookkeeper) charges for. Automatically.</span>
      </p>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
//  SOCIAL PROOF — testimonials + trust signals
// ══════════════════════════════════════════════════════════════════
function SocialProof() {
  const ref = useFadeIn<HTMLDivElement>();
  const signals = [
    {
      title: "PSD2 Open Banking",
      desc: "Read-only bank access via Tink. askwijs can never move your money or see your credentials.",
    },
    {
      title: "EU Data, GDPR First",
      desc: "All data stored in the EU (AWS eu-west-1). Full GDPR rights: access, export, and delete anytime.",
    },
    {
      title: "AI You Can Trust",
      desc: "Transaction categorization powered by Anthropic Claude. Your financial data is never used for model training.",
    },
  ];
  return (
    <section ref={ref} className="pb-[96px]"
      style={{ paddingLeft: "max(32px, calc((100vw - 1436px) / 2 + 46px))", paddingRight: "max(32px, calc((100vw - 1436px) / 2 + 46px))" }}>
      <div className="max-w-[1344px]">
        <div className="grid md:grid-cols-3 gap-6">
          {signals.map(s => (
            <div key={s.title} className="rounded-xl p-6" style={{ background: C.surface, border: `1px solid ${C.borderSubtle}` }}>
              <h3 className="text-[15px] font-medium text-[#F9FAFB] mb-2">{s.title}</h3>
              <p className="text-[14px] text-[#9CA3AF] leading-[1.6]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
//  THREE CARDS — Linear style: illustration placeholder + title + desc
// ══════════════════════════════════════════════════════════════════
function ThreeCards() {
  const ref = useFadeIn<HTMLDivElement>();
  const cards = [
    { title: "Built for expats", desc: "Full English and Dutch. Every tax term explained. Switch languages anytime." },
    { title: "Powered by AI", desc: "Wijs categorizes transactions, finds deductions, and answers your tax questions." },
    { title: "Designed for speed", desc: "Connect your bank in seconds. BTW pre-filled in minutes. File in one click." },
  ];
  return (
    <section id="features" ref={ref} className="pb-[96px]"
      style={{ paddingLeft: "max(32px, calc((100vw - 1436px) / 2 + 46px))", paddingRight: "max(32px, calc((100vw - 1436px) / 2 + 46px))" }}>
      <div className="grid md:grid-cols-3 gap-6 max-w-[1344px]">
        {cards.map(c => (
          <div key={c.title} className="rounded-xl p-6" style={{ background: C.surface, border: `1px solid ${C.borderSubtle}` }}>
            {/* Illustration placeholder */}
            <div className="h-[200px] mb-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.borderSubtle}` }}>
              <div className="w-16 h-16 rounded-xl" style={{ border: `1px solid rgba(255,255,255,0.08)` }} />
            </div>
            <h3 className="text-[16px] font-medium text-[#F9FAFB] mb-2">{c.title}</h3>
            <p className="text-[14px] text-[#9CA3AF] leading-[1.5]">{c.desc}</p>
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
          <h2 className="text-[32px] leading-[1.2] tracking-[-0.02em] text-[#F9FAFB]" style={{ fontFamily: "'Lora', serif", fontWeight: 600 }}>{heading}</h2>
          <p className="text-[16px] text-[#9CA3AF] leading-[1.6]">{desc}</p>
        </div>

        {/* Section number + label */}
        <div className="flex items-center gap-3 mb-8 text-[14px] text-[#9CA3AF]">
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
        <div className="px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-[#4B5563]" style={{ background: C.surface, borderBottom: `1px solid ${C.borderSubtle}` }}>
          Auto-categorization
        </div>
        {txs.map((tx, i) => (
          <div key={tx.name} className="flex items-center justify-between px-5 py-3 transition-all duration-500"
            style={{ borderTop: `1px solid ${C.borderSubtle}`, background: i < visible ? "rgba(255,255,255,0.02)" : "transparent" }}>
            <span className="text-[13px] text-[#9CA3AF]">{tx.name}</span>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full transition-all duration-500"
                style={{ background: i < visible ? `${tx.color}15` : "rgba(255,255,255,0.04)", color: i < visible ? tx.color : "#3a3e47" }}>
                {i < visible ? tx.to : "Uncategorized"}
              </span>
              <span className="text-[13px] font-medium text-[#9CA3AF] w-[90px] text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{tx.amt}</span>
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
        <div className="px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-[#4B5563]" style={{ background: C.surface, borderBottom: `1px solid ${C.borderSubtle}` }}>
          BTW aangifte Q1 2026
        </div>
        {BTW_BOXES.map((box, i) => (
          <div key={box.box} className="flex items-center justify-between px-5 py-3 transition-all duration-500"
            style={{ borderTop: `1px solid ${C.borderSubtle}`, background: box.box === "5g" && i < filled ? "rgba(37,99,235,0.04)" : "transparent" }}>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium w-6" style={{ color: C.accent, fontVariantNumeric: "tabular-nums" }}>{box.box}</span>
              <span className="text-[13px] text-[#9CA3AF]">{box.label}</span>
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
              style={{ background: msg.role === "user" ? "rgba(37,99,235,0.12)" : "rgba(255,255,255,0.04)", color: msg.role === "user" ? "#93B4F6" : C.muted }}>
              {msg.text}
            </div>
          </div>
        ))}
        {count > 0 && count < WIJS_CONVERSATION.length && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5" style={{ background: C.accent }}>W</div>
            <div className="text-[13px] text-[#4B5563] px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4B5563] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#4B5563] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#4B5563] animate-bounce" style={{ animationDelay: "300ms" }} />
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
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mb-3" style={{ color: C.dim }}>
            <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-[13px] text-[#9CA3AF]">Drop receipt here</p>
          <p className="text-[11px] text-[#4B5563] mt-1">PDF, JPG, or PNG</p>
        </div>
        {dropped && (
          <div className="flex items-center justify-between px-5 py-3 rounded-lg" style={{ background: C.surface, border: `1px solid ${C.borderSubtle}` }}>
            <div>
              <div className="text-[12px] text-[#9CA3AF]">receipt_wework_mar.pdf</div>
              <div className="text-[10px] text-[#4B5563]">Matched to WeWork Amsterdam - &euro;290,00</div>
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
              <span className="text-[13px] text-[#9CA3AF] font-medium">{b.name}</span>
            </div>
            {state[i] ? (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${C.green}15`, color: C.green }}>Connected</span>
            ) : (
              <button className="text-[10px] font-medium px-3 py-1 rounded-md transition-colors"
                style={{ background: "rgba(255,255,255,0.04)", color: C.muted, border: `1px solid rgba(255,255,255,0.08)`, cursor: "pointer" }}
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
  const starterFeatures = [
    "1 bank connection (PSD2)",
    "AI transaction categorization",
    "Live BTW dashboard",
    "Ask Wijs AI advisor (10/mo)",
    "Full English and Dutch",
  ];
  const proFeatures = [
    "Unlimited bank connections",
    "AI categorization + auto-rules",
    "Live BTW dashboard and tax forecast",
    "One-click BTW aangifte filing",
    "Receipt scanning with OCR",
    "Unlimited Ask Wijs AI advisor",
    "WhatsApp/Telegram notifications",
    "Priority support",
  ];

  function Check() {
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5"><path d="M3 8l3.5 3.5L13 5" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  }

  return (
    <section id="pricing" ref={ref} className="py-[128px]"
      style={{ paddingLeft: "max(32px, calc((100vw - 1436px) / 2 + 46px))", paddingRight: "max(32px, calc((100vw - 1436px) / 2 + 46px))" }}>
      <div className="max-w-[960px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[32px] leading-[1.2] tracking-[-0.02em] text-[#F9FAFB] mb-3" style={{ fontFamily: "'Lora', serif", fontWeight: 600 }}>Simple pricing. No surprises.</h2>
          <p className="text-[16px] text-[#9CA3AF]">Start free. Upgrade when you need more.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Starter */}
          <div className="rounded-xl p-8 text-left" style={{ background: C.surface, border: `1px solid ${C.borderSubtle}` }}>
            <div className="text-[11px] font-medium uppercase tracking-wider text-[#4B5563] mb-4">Starter</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-[40px] font-medium text-[#F9FAFB]" style={{ fontVariantNumeric: "tabular-nums" }}>&euro;9,99</span>
              <span className="text-[14px] text-[#4B5563]">/month</span>
            </div>
            <p className="text-[13px] text-[#4B5563] mb-8">excl. 21% BTW &middot; 30 days free</p>
            <div className="space-y-3 mb-8">
              {starterFeatures.map(f => (
                <div key={f} className="flex items-start gap-3">
                  <Check />
                  <span className="text-[14px] text-[#9CA3AF]">{f}</span>
                </div>
              ))}
            </div>
            <Link to="/signup" className="block w-full text-center text-[14px] font-medium py-3 rounded-lg transition-all hover:bg-[rgba(255,255,255,0.12)]"
              style={{ background: "rgba(255,255,255,0.06)", color: C.text, border: `1px solid ${C.border}` }}>Start free trial</Link>
            <p className="text-center text-[12px] text-[#4B5563] mt-3">No credit card required</p>
          </div>

          {/* Pro — highlighted */}
          <div className="rounded-xl p-8 text-left relative overflow-hidden" style={{ background: C.surface, border: `1px solid rgba(37,99,235,0.3)` }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)` }} />
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#4B5563]">Pro</span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${C.accent}20`, color: C.accent }}>Most popular</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-[40px] font-medium text-[#F9FAFB]" style={{ fontVariantNumeric: "tabular-nums" }}>&euro;24,99</span>
              <span className="text-[14px] text-[#4B5563]">/month</span>
            </div>
            <p className="text-[13px] text-[#4B5563] mb-8">excl. 21% BTW &middot; 30 days free</p>
            <div className="space-y-3 mb-8">
              {proFeatures.map(f => (
                <div key={f} className="flex items-start gap-3">
                  <Check />
                  <span className="text-[14px] text-[#9CA3AF]">{f}</span>
                </div>
              ))}
            </div>
            <Link to="/signup" className="block w-full text-center text-white text-[14px] font-medium py-3 rounded-lg transition-all hover:-translate-y-px"
              style={{ background: C.accent }}>Start free trial</Link>
            <p className="text-center text-[12px] text-[#4B5563] mt-3">No credit card required</p>
          </div>
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
      <h2 className="text-[32px] sm:text-[48px] leading-[1.15] tracking-[-0.02em] text-[#F9FAFB] mb-4" style={{ fontFamily: "'Lora', serif", fontWeight: 600 }}>
        Stop dreading tax season.{"\n"}<span className="block">Start today.</span>
      </h2>
      <p className="text-[16px] text-[#9CA3AF] mb-8 max-w-[480px] mx-auto">Start your 30-day free trial. No credit card required.</p>
      <div className="flex items-center justify-center gap-3">
        <Link to="/signup" className="text-[14px] font-medium text-white px-5 py-2.5 rounded-[8px] transition-all hover:-translate-y-px"
          style={{ background: C.accent }}>Start free trial</Link>
        <a href="mailto:hello@askwijs.ai" className="text-[14px] font-medium px-5 py-2.5 rounded-[8px] transition-all hover:bg-[rgba(255,255,255,0.06)]"
          style={{ background: "rgba(255,255,255,0.04)", color: C.text, border: `1px solid ${C.borderSubtle}` }}>Contact us</a>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
//  DISCLAIMER
// ══════════════════════════════════════════════════════════════════
function Disclaimer() {
  return (
    <div className="text-center pb-12"
      style={{ paddingLeft: "max(32px, calc((100vw - 1436px) / 2 + 46px))", paddingRight: "max(32px, calc((100vw - 1436px) / 2 + 46px))" }}>
      <p className="text-[12px] text-[#4B5563] max-w-[600px] mx-auto leading-[1.6]">
        askwijs automates financial administration. It is not a licensed tax advisor. We recommend consulting a professional for complex tax situations.
      </p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  FOOTER — clean link grid (only pages that exist)
// ══════════════════════════════════════════════════════════════════
function Footer() {
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
            <Link to="/" className="flex items-center gap-2 no-underline">
              <img src="/logo-white.svg" alt="askwijs" className="h-5 w-auto" />
              <span className="text-[16px] font-semibold text-[#F9FAFB] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                ask<span style={{ color: C.accent }}>wijs</span>
              </span>
            </Link>
          </div>
          {/* Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1">
            <div>
              <div className="text-[13px] font-medium text-[#F9FAFB] mb-4">Product</div>
              <div className="space-y-2.5">
                <a href="#features" className="block text-[13px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors">Features</a>
                <a href="#pricing" className="block text-[13px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors">Pricing</a>
                <a href="#security" className="block text-[13px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors">Banks</a>
              </div>
            </div>
            <div>
              <div className="text-[13px] font-medium text-[#F9FAFB] mb-4">Company</div>
              <div className="space-y-2.5">
                <Link to="/privacy" className="block text-[13px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors">Privacy</Link>
                <Link to="/terms" className="block text-[13px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors">Terms</Link>
              </div>
            </div>
            <div>
              <div className="text-[13px] font-medium text-[#F9FAFB] mb-4">Connect</div>
              <div className="space-y-2.5">
                <a href="mailto:hello@askwijs.ai" className="block text-[13px] text-[#6B7280] hover:text-[#9CA3AF] transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div className="flex items-center gap-6 text-[13px] text-[#4B5563]" style={{ borderTop: `1px solid ${C.borderSubtle}`, paddingTop: "24px" }}>
          <Link to="/privacy" className="hover:text-[#9CA3AF] transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-[#9CA3AF] transition-colors">Terms</Link>
          <span>&copy; 2026 askwijs</span>
        </div>
      </div>
    </footer>
  );
}
