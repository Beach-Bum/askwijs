import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export function Landing() {
  const { user, loading } = useAuth();
  if (!loading && user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-[#0b0e17] text-white overflow-x-hidden" style={{ fontFamily: "var(--font-body)" }}>
      <Nav />
      <HeroSection />
      <BanksStrip />
      <PillarsSection />
      <HowItWorks />
      <CtaBanner />
      <SecuritySection />
      <PricingSection />
      <WaitlistSection />
      <Footer />
    </div>
  );
}

/* --- NAV --- */
function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-14 h-[68px] bg-[rgba(11,14,23,0.85)] backdrop-blur-xl border-b border-white/[0.08]">
      <Link to="/" className="font-display text-2xl text-white no-underline tracking-tight">
        ask<span className="text-blue-400 font-normal">wijs</span>
      </Link>
      <div className="flex items-center gap-9">
        <a href="#how" className="hidden md:inline text-sm font-medium text-slate-500 hover:text-white transition-colors">How it works</a>
        <a href="#security" className="hidden md:inline text-sm font-medium text-slate-500 hover:text-white transition-colors">Security</a>
        <Link to="/login" className="hidden md:inline text-sm font-medium text-slate-500 hover:text-white transition-colors">Log in</Link>
        <Link to="/signup" className="text-sm font-semibold bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 hover:-translate-y-px transition-all">
          Start free trial
        </Link>
      </div>
    </nav>
  );
}

/* --- HERO --- */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden text-center">
      <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 60%, rgba(16,185,129,0.08) 0%, transparent 50%), radial-gradient(ellipse 40% 50% at 10% 80%, rgba(37,99,235,0.06) 0%, transparent 50%)" }} />
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "80px 80px", maskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, black, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, black, transparent 80%)" }} />

      <div className="relative z-10 max-w-[860px]">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-400/25 text-blue-300 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-9">
          <span className="w-[7px] h-[7px] rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          For expats &amp; ZZP&apos;ers &middot; AI agent &middot; English + Dutch
        </div>

        <h1 className="font-display text-[clamp(44px,7vw,82px)] leading-[1.06] tracking-tight text-white mb-7">
          Your Dutch tax.<br /><span className="text-blue-400">Fully automated.</span>
        </h1>

        <p className="text-[clamp(17px,2.2vw,21px)] text-slate-400 max-w-[580px] mx-auto mb-12 leading-relaxed font-normal">
          Built for expats and ZZP&apos;ers in the Netherlands. askwijs categorizes every transaction, tracks your live BTW position, and files your returns — automatically. Fully in English, or Dutch.
        </p>

        <div className="flex items-center justify-center gap-3.5 flex-wrap mb-4">
          <Link to="/signup" className="inline-flex items-center gap-2 bg-blue-600 text-white text-base font-semibold px-8 py-4 rounded-[10px] hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,99,235,0.35)] transition-all">
            Start free trial &rarr;
          </Link>
          <a href="#how" className="inline-flex items-center gap-2 bg-transparent text-slate-400 text-base font-medium px-7 py-4 rounded-[10px] border border-white/[0.12] hover:border-white/30 hover:text-white transition-all">
            See how it works
          </a>
        </div>
        <p className="text-sm text-slate-600 mb-16">1 month free &middot; then &euro;19.99/mo &middot; no credit card needed</p>

        <DashboardPreview />
      </div>
    </section>
  );
}

/* --- DASHBOARD PREVIEW --- */
function DashboardPreview() {
  const stats = [
    { label: "Net income Q1", val: "\u20AC9,840", badge: "\u2191 +18% vs Q4", color: "green" as const },
    { label: "BTW Position", val: "\u20AC1,890", badge: "Due 31 Jan", color: "amber" as const },
    { label: "Deductions found", val: "\u20AC4,210", badge: "Auto-detected", color: "blue" as const },
    { label: "Tax forecast", val: "\u20AC6,340", badge: "Income tax", color: "red" as const },
  ];

  const txs = [
    { name: "Adobe Creative Cloud", cat: "Software", amt: "-\u20AC61", pos: false },
    { name: "Client \u2014 Acme BV", cat: "Revenue", amt: "+\u20AC3,500", pos: true },
    { name: "NS Treinreizen", cat: "Travel", amt: "-\u20AC44", pos: false },
    { name: "WeWork Amsterdam", cat: "Office", amt: "-\u20AC290", pos: false },
  ];

  const dls = [
    { name: "Q4 BTW aangifte", date: "\u2713 Filed", color: "text-emerald-400", dot: "bg-emerald-400" },
    { name: "Q1 BTW aangifte", date: "31 Jan", color: "text-amber-400", dot: "bg-amber-400" },
    { name: "Income tax return", date: "1 May", color: "text-blue-400", dot: "bg-blue-400" },
  ];

  const badgeColor = { green: "bg-emerald-500/15 text-emerald-400", amber: "bg-amber-500/15 text-amber-400", blue: "bg-blue-600/15 text-blue-300", red: "bg-red-500/15 text-red-400" };

  return (
    <div className="relative z-10 w-full max-w-[900px] mx-auto">
      <div className="absolute -inset-15 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(37,99,235,0.15), transparent)" }} />
      <div className="bg-[#0f1623] border border-white/10 rounded-[20px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)]">
        <div className="bg-[#0a0f1a] border-b border-white/[0.06] px-5 py-3.5 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          <div className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-md px-3.5 py-1 ml-2.5 font-mono text-xs text-slate-600">app.askwijs.ai/dashboard</div>
        </div>

        <div className="grid md:grid-cols-[200px_1fr]">
          <div className="hidden md:block bg-[#080c14] border-r border-white/[0.05] p-5 min-h-[400px]">
            <div className="font-display text-lg text-white mb-6 px-2">ask<span className="text-blue-400 font-normal">wijs</span></div>
            {["Dashboard", "Transactions", "BTW Aangifte", "Ask Wijs", "Invoices", "Deadlines"].map((item, i) => (
              <div key={item} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] ${i === 0 ? "bg-blue-600/15 text-blue-300" : "text-slate-600"}`}>
                <span className="w-2 h-2 rounded-full bg-current opacity-50" />{item}
              </div>
            ))}
          </div>

          <div className="p-6 bg-[#0d1220]">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-white">Good morning, Ned &#128075;</h2>
              <p className="text-xs text-slate-600 mt-1">Wijs filed your Q4 BTW aangifte this morning. Everything is on track.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-[#0f1623] border border-white/[0.06] rounded-xl p-3.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-700">{s.label}</div>
                  <div className="text-xl font-bold text-white mt-1 tabular-nums">{s.val}</div>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${badgeColor[s.color]}`}>{s.badge}</span>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-[#0f1623] border border-white/[0.06] rounded-xl p-3.5">
                <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-2.5">Recent transactions</div>
                {txs.map((tx) => (
                  <div key={tx.name} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0 text-[11px]">
                    <span className="text-slate-400">{tx.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-400">{tx.cat}</span>
                    <span className={`text-[11px] font-semibold tabular-nums ${tx.pos ? "text-emerald-400" : "text-red-400"}`}>{tx.amt}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[#0f1623] border border-white/[0.06] rounded-xl p-3.5">
                <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-2.5">Upcoming deadlines</div>
                {dls.map((d) => (
                  <div key={d.name} className="flex items-center gap-2.5 py-2 border-b border-white/[0.04] last:border-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${d.dot}`} />
                    <span className="text-xs text-slate-400 flex-1">{d.name}</span>
                    <span className={`text-[11px] font-mono ${d.color}`}>{d.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- BANKS STRIP --- */
function BanksStrip() {
  const banks = [
    { name: "ING", color: "#ff6200" },
    { name: "ABN AMRO", color: "#004c3f" },
    { name: "Rabobank", color: "#0068b4" },
    { name: "bunq", color: "#30c381" },
    { name: "Revolut", color: "#0075eb" },
    { name: "N26", color: "#48d2a0" },
    { name: "SNS", color: "#e5007d" },
  ];

  return (
    <div className="py-16 px-6 bg-[#080c14]">
      <div className="max-w-[900px] mx-auto text-center">
        <div className="text-xs text-slate-700 font-semibold tracking-widest uppercase mb-7">Connects to all major Dutch banks</div>
        <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
          {banks.map((b) => (
            <div key={b.name} className="bg-white/[0.04] border border-white/[0.07] rounded-[12px] px-6 py-3.5 flex items-center gap-2.5 hover:bg-white/[0.08] transition-colors group">
              <div className="w-2.5 h-2.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: b.color }} />
              <span className="text-sm font-semibold text-slate-500 group-hover:text-slate-300 transition-colors tracking-wide">{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- PILLARS --- */
function PillarsSection() {
  const pillars = [
    { num: "01", icon: "\uD83C\uDFE6", title: "Connect", desc: "Link all your bank accounts in two clicks via PSD2 Open Banking. askwijs syncs every transaction automatically \u2014 daily, or in real-time.", tag: "PSD2 compliant", tagColor: "bg-blue-600/15 text-blue-300" },
    { num: "02", icon: "\uD83D\uDD04", title: "Categorize", desc: "Every transaction auto-tagged: business or personal, deductible or not, mixed-use percentage calculated. Wijs learns from your corrections.", tag: "AI-powered", tagColor: "bg-emerald-500/15 text-emerald-400" },
    { num: "03", icon: "\uD83D\uDCCA", title: "Dashboard", desc: "Your live BTW position, income tax forecast, deductions found, and cash flow \u2014 all in one place. Your complete financial picture, always current.", tag: "Real-time", tagColor: "bg-blue-600/15 text-blue-300" },
    { num: "04", icon: "\uD83E\uDD16", title: "File", desc: "Wijs prepares and submits your quarterly BTW aangifte and annual income tax return \u2014 pre-filled from your real transaction data. You approve, Wijs files.", tag: "Auto-filing", tagColor: "bg-emerald-500/15 text-emerald-400" },
    { num: "05", icon: "\uD83D\uDCAC", title: "Advise", desc: "Ask Wijs anything \u2014 and get answers based on your actual numbers. Can I afford to take August off? Wijs knows your runway.", tag: "English & Dutch", tagColor: "bg-blue-600/15 text-blue-300" },
    { num: "06", icon: "\uD83C\uDF0D", title: "Bilingual", desc: "The only Dutch tax platform built for expats. All Dutch tax terms explained in plain English. Switch languages mid-conversation. No assumptions.", tag: "EN \u00B7 NL", tagColor: "bg-emerald-500/15 text-emerald-400" },
  ];

  return (
    <section className="py-28 px-6 bg-[#080c14]">
      <div className="max-w-[1060px] mx-auto">
        <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-blue-400 mb-3.5">What askwijs does</div>
        <h2 className="font-display text-[clamp(32px,4.5vw,54px)] leading-[1.12] tracking-tight text-white mb-4">
          Five pillars.<br /><span className="text-blue-400">One platform.</span>
        </h2>
        <p className="text-lg text-slate-400 max-w-[560px] leading-relaxed">Everything an expat freelancer in the Netherlands needs — connected, automated, and fully in English.</p>
        <div className="grid md:grid-cols-3 gap-px mt-16 border border-white/[0.07] rounded-[20px] overflow-hidden">
          {pillars.map((p) => (
            <div key={p.num} className="bg-[#0d1220] p-8 md:p-9 border-r border-b border-white/[0.06] last:border-r-0 hover:bg-[#111827] transition-colors">
              <div className="font-mono text-[11px] text-[#1e3a5f] font-medium mb-4">{p.num}</div>
              <div className="text-[28px] mb-3.5">{p.icon}</div>
              <h3 className="text-[17px] font-semibold text-white mb-2.5">{p.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
              <span className={`inline-block mt-4 text-[11px] font-semibold px-2.5 py-0.5 rounded-full tracking-wide ${p.tagColor}`}>{p.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- HOW IT WORKS --- */
function HowItWorks() {
  const steps = [
    { title: "Connect your bank", desc: "Link ING, ABN AMRO, Rabobank or any Dutch bank via PSD2. Takes 2 clicks." },
    { title: "Wijs categorizes", desc: "Every transaction auto-tagged. Last 90 days done in seconds." },
    { title: "See your picture", desc: "Live BTW position, deductions found, income tax forecast \u2014 instantly." },
    { title: "Wijs handles the rest", desc: "Returns filed, deadlines tracked, advice on tap. You focus on your work." },
  ];

  return (
    <section id="how" className="py-28 px-6 bg-slate-50 text-slate-900">
      <div className="max-w-[1060px] mx-auto">
        <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-blue-600 mb-3.5">How it works</div>
        <h2 className="font-display text-[clamp(32px,4.5vw,54px)] leading-[1.12] tracking-tight text-slate-900 mb-4">
          Up and running<br /><span className="text-blue-600">in 5 minutes.</span>
        </h2>
        <p className="text-lg text-slate-500 max-w-[560px] leading-relaxed">No accountant, no spreadsheets, no Dutch language skills required. Connect and go.</p>
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="hidden md:block absolute top-9 left-[12.5%] right-[12.5%] h-0.5 border-t-2 border-dashed border-slate-200 z-0" />
          {steps.map((s, i) => (
            <div key={i} className="text-center relative z-10">
              <div className="w-[72px] h-[72px] rounded-full bg-white border-2 border-blue-600 flex items-center justify-center mx-auto mb-5 font-display text-[26px] text-blue-600">{i + 1}</div>
              <h3 className="text-[15px] font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- CTA BANNER --- */
function CtaBanner() {
  return (
    <section className="py-20 px-6 bg-[#0b0e17] text-center">
      <div className="max-w-[700px] mx-auto">
        <h2 className="font-display text-[clamp(28px,4vw,44px)] leading-[1.12] tracking-tight text-white mb-4">
          Ready to stop worrying<br />about <span className="text-blue-400">Dutch taxes?</span>
        </h2>
        <p className="text-lg text-slate-400 mb-8">Join hundreds of expats and freelancers who let Wijs handle their Dutch taxes — in English.</p>
        <Link to="/signup" className="inline-flex items-center gap-2 bg-blue-600 text-white text-base font-semibold px-8 py-4 rounded-[10px] hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,99,235,0.35)] transition-all">
          Start free trial &rarr;
        </Link>
        <p className="text-sm text-slate-600 mt-3">No credit card &middot; Cancel anytime</p>
      </div>
    </section>
  );
}

/* --- SECURITY --- */
function SecuritySection() {
  const items = [
    { icon: "\uD83D\uDD12", title: "Read-only access", desc: "askwijs can never move your money. Read-only bank access, always." },
    { icon: "\uD83D\uDEE1\uFE0F", title: "PSD2 regulated", desc: "Open Banking under EU PSD2 directive. Banks are legally required to support it." },
    { icon: "\uD83D\uDD10", title: "AES-256 encryption", desc: "All data encrypted at rest and in transit. Zero access for any third party." },
    { icon: "\uD83C\uDDEA\uD83C\uDDFA", title: "GDPR compliant", desc: "Data stored in EU. You own your data. Delete everything anytime." },
  ];

  return (
    <section id="security" className="py-16 px-6 bg-white">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-2 text-[11px] font-bold tracking-[0.15em] uppercase text-blue-600">Security</div>
        <h2 className="text-center font-display text-[clamp(28px,3.5vw,42px)] text-slate-900 tracking-tight mb-3">
          Bank-level security.<br /><span className="text-blue-600">Always.</span>
        </h2>
        <p className="text-center text-slate-500 text-[17px] max-w-[500px] mx-auto mb-10">Your financial data is as sensitive as it gets. We treat it that way.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {items.map((s) => (
            <div key={s.title} className="text-center">
              <div className="text-[28px] mb-2.5">{s.icon}</div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">{s.title}</h4>
              <p className="text-[13px] text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- PRICING --- */
function PricingSection() {
  const features = [
    "Unlimited bank connections (PSD2)",
    "AI transaction categorization",
    "Live BTW dashboard & tax forecast",
    "Automatic BTW aangifte filing",
    "Receipt scanning (OCR)",
    "Ask Wijs \u2014 your AI financial advisor",
    "WhatsApp & Telegram notifications",
    "English & Dutch bilingual support",
  ];

  return (
    <section className="py-28 px-6 bg-[#0b0e17]">
      <div className="max-w-[1060px] mx-auto">
        <div className="text-center mb-16">
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-blue-400 mb-3.5">Pricing</div>
          <h2 className="font-display text-[clamp(32px,4.5vw,54px)] leading-[1.12] tracking-tight text-white mb-4">
            Simple pricing.<br /><span className="text-blue-400">No surprises.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-[500px] mx-auto leading-relaxed">One plan. Everything included. Cancel anytime.</p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-[#0d1220] border border-white/[0.08] rounded-[20px] p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-500" />
            <div className="text-center mb-8">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-400 bg-blue-600/10 border border-blue-400/25 px-3 py-1 rounded-full mb-4">askwijs Pro</span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-white tabular-nums">&euro;19.99</span>
                <span className="text-slate-500 text-lg">/month</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">excl. BTW &middot; first month free</p>
            </div>

            <div className="space-y-3 mb-8">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-0.5 shrink-0">&#10003;</span>
                  <span className="text-sm text-slate-300">{f}</span>
                </div>
              ))}
            </div>

            <Link to="/signup" className="block w-full text-center bg-blue-600 text-white py-4 rounded-[10px] text-base font-semibold hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,99,235,0.35)] transition-all">
              Start free trial &rarr;
            </Link>
            <p className="text-center text-xs text-slate-600 mt-3">No credit card required &middot; Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- WAITLIST --- */
function WaitlistSection() {
  return (
    <section className="relative py-28 px-6 bg-[#0b0e17] text-center overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(37,99,235,0.14), transparent)" }} />
      <div className="relative max-w-[620px] mx-auto">
        <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-blue-400 mb-3.5">Early access</div>
        <h2 className="font-display text-[clamp(32px,4.5vw,54px)] leading-[1.12] tracking-tight text-white mb-4">Be first to connect.</h2>
        <p className="text-lg text-slate-400 leading-relaxed">Join the waitlist and get early access when we launch. Free during beta — no credit card, no accountant, no Dutch required.</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-10 mb-3.5 justify-center">
          <input type="email" placeholder="your@email.com" className="flex-1 bg-white/[0.06] border border-white/[0.12] rounded-[10px] px-5 py-4 text-base text-white outline-none placeholder:text-slate-700 focus:border-blue-500 transition-colors" />
          <Link to="/signup" className="bg-blue-600 text-white text-base font-semibold px-8 py-4 rounded-[10px] hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,99,235,0.35)] transition-all whitespace-nowrap inline-flex items-center justify-center">
            Get early access &rarr;
          </Link>
        </div>
        <p className="text-[13px] text-[#1e3a5f]">No spam. Unsubscribe anytime. Free during beta.</p>
        <div className="flex items-center justify-center gap-4 mt-12 flex-wrap">
          <div className="flex">{["\uD83C\uDDF3\uD83C\uDDF1", "\uD83C\uDDEC\uD83C\uDDE7", "\uD83C\uDDE9\uD83C\uDDEA", "\uD83C\uDDFA\uD83C\uDDF8", "\uD83C\uDDEB\uD83C\uDDF7"].map((f, i) => (
            <span key={i} className="text-[22px]" style={{ marginLeft: i > 0 ? "-4px" : "0" }}>{f}</span>
          ))}</div>
          <p className="text-sm text-slate-600"><strong className="text-slate-400">340+ ZZP&apos;ers and expats</strong> already on the waitlist</p>
        </div>
      </div>
    </section>
  );
}

/* --- FOOTER --- */
function Footer() {
  return (
    <footer className="bg-[#06080f] border-t border-white/[0.05] py-10 px-6 md:px-14">
      <div className="max-w-[1060px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="font-display text-xl text-white no-underline">ask<span className="text-blue-400 font-normal">wijs</span></Link>
        <div className="flex gap-7">
          {["Features", "Security", "Privacy", "Contact"].map((l) => (
            <a key={l} href="#" className="text-[13px] text-slate-700 hover:text-slate-500 transition-colors">{l}</a>
          ))}
        </div>
        <p className="text-[13px] text-[#1e3a5f]">&copy; 2026 askwijs &middot; Built for ZZP&apos;ers &amp; expats &#127475;&#127473;</p>
      </div>
    </footer>
  );
}
