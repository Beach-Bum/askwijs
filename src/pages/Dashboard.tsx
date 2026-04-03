import { useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Calendar, Camera, Send,
  CheckCircle2, MessageCircle, FileText, Receipt, Building2, Plus,
  Upload, ExternalLink, Shield, Globe, User, CreditCard, Bell,
  FileCheck, Info, Copy, Check, Lightbulb, FileDown, Sparkles,
} from "lucide-react";

/* ================================================================ */
/*  MOCK DATA                                                        */
/* ================================================================ */
const mockStats = { nettoIncome: 34250, btwOwed: 2847.50, deductionsFound: 6120, pendingReview: 12 };

const mockDeadlines = [
  { label: "Q1 BTW aangifte", date: "April 30, 2026", urgent: true },
  { label: "Income tax (IB)", date: "May 1, 2026", urgent: false },
  { label: "Q2 BTW aangifte", date: "July 31, 2026", urgent: false },
];

const mockTransactions = [
  { id: "1", date: "Mar 28", counterparty: "Bol.com", amount: -89.99, category: "office_supplies", status: "auto_approved", btw: 21 },
  { id: "2", date: "Mar 27", counterparty: "Client: Acme BV", amount: 4500, category: "revenue", status: "auto_approved", btw: 21 },
  { id: "3", date: "Mar 26", counterparty: "Albert Heijn", amount: -32.45, category: "personal", status: "pending_review", btw: 9 },
  { id: "4", date: "Mar 25", counterparty: "WeWork Amsterdam", amount: -299, category: "rent_workspace", status: "auto_approved", btw: 21 },
  { id: "5", date: "Mar 24", counterparty: "NS Reizen", amount: -45.60, category: "transport", status: "pending_review", btw: 0 },
  { id: "6", date: "Mar 23", counterparty: "KPN", amount: -29.99, category: "telecommunications", status: "auto_approved", btw: 21 },
];

const initMessages = [
  { role: "assistant" as const, text: "Goedemorgen! I see 12 new transactions from your ING account. 8 were auto-categorized. Want me to walk you through the 4 that need review?" },
];

const eur = (n: number) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

/* ================================================================ */
/*  DESIGN TOKENS                                                    */
/* ================================================================ */
const CARD = "bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-[14px] p-5";
const CARD_HEADER = "text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B7280] mb-3";
const TABULAR = { fontVariantNumeric: "tabular-nums" } as const;
const SERIF = { fontFamily: "'Lora', serif", fontWeight: 600 } as const;

/* ================================================================ */
/*  CATEGORY BADGE COLORS                                            */
/* ================================================================ */
function categoryBadge(cat: string) {
  switch (cat) {
    case "revenue":
      return { bg: "rgba(5,150,105,0.12)", text: "#059669" };
    case "office_supplies":
    case "rent_workspace":
    case "telecommunications":
      return { bg: "rgba(37,99,235,0.12)", text: "#2563EB" };
    case "transport":
      return { bg: "rgba(217,119,6,0.12)", text: "#D97706" };
    case "personal":
    default:
      return { bg: "rgba(75,85,99,0.25)", text: "#9CA3AF" };
  }
}

/* ================================================================ */
/*  DASHBOARD SHELL                                                  */
/* ================================================================ */
export function Dashboard() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "overview";

  return (
    <div className="relative min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1280px] mx-auto">
        {tab === "overview" && <OverviewTab />}
        {tab === "transactions" && <TransactionsTab />}
        {tab === "btw" && <BtwAangifteTab />}
        {tab === "invoices" && <InvoicesTab />}
        {tab === "receipts" && <ReceiptsTab />}
        {tab === "deadlines" && <DeadlinesTab />}
        {tab === "banks" && <BankAccountsTab />}
        {tab === "chat" && <ChatTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}

/* ================================================================ */
/*  OVERVIEW TAB  (Command Center)                                   */
/* ================================================================ */
function OverviewTab() {
  const cameraRef = useRef<HTMLInputElement>(null);
  const onReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) alert("Receipt captured: " + file.name);
  };

  /* Current date string */
  const today = new Date();
  const dateStr = today.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  /* Drag-and-drop handlers */
  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); }, []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) alert("Dropped: " + Array.from(files).map(f => f.name).join(", "));
  }, []);

  /* BTW bar chart data */
  const quarters = [
    { label: "Q1", value: 2847, projected: false },
    { label: "Q2", value: 2200, projected: true },
    { label: "Q3", value: 1800, projected: true },
    { label: "Q4", value: 2400, projected: true },
  ];
  const maxBar = Math.max(...quarters.map(q => q.value));

  return (
    <>
      {/* ── Top bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl text-[#F9FAFB]" style={SERIF}>Goedemorgen</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">{dateStr}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative text-[#6B7280] hover:text-[#F9FAFB] transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#DC2626]" />
          </button>
          <button
            onClick={() => cameraRef.current?.click()}
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#3B82F6] text-white px-4 py-2 rounded-[10px] text-sm font-medium transition-colors"
          >
            <Camera className="w-4 h-4" /> Scan receipt
          </button>
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onReceipt} />
        </div>
      </div>

      {/* ── 6-Panel Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">

        {/* Panel 1: BTW Position */}
        <div className={CARD}>
          <p className={CARD_HEADER}>BTW Position</p>
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-3xl font-semibold text-[#2563EB]" style={TABULAR}>
                {eur(mockStats.btwOwed)}
              </p>
              <p className="text-sm text-[#9CA3AF] mt-1">Q1 BTW owed</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[rgba(217,119,6,0.12)] text-[#D97706]">
              Due April 30
            </span>
          </div>
          {/* Mini bar chart */}
          <div className="flex items-end gap-3 h-16 mt-2">
            {quarters.map((q) => (
              <div key={q.label} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative" style={{ height: `${(q.value / maxBar) * 100}%`, minHeight: 8 }}>
                  <div
                    className="absolute inset-0 rounded-sm"
                    style={{
                      backgroundColor: q.projected ? "transparent" : "#2563EB",
                      border: q.projected ? "1.5px dashed rgba(37,99,235,0.4)" : "none",
                      opacity: q.projected ? 0.5 : 1,
                    }}
                  />
                </div>
                <span className="text-[10px] text-[#4B5563]">{q.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Quick Stats */}
        <div className={CARD}>
          <p className={CARD_HEADER}>Quick Stats</p>
          <div className="grid grid-cols-2 gap-3">
            <MiniStat label="Netto Income" value={eur(mockStats.nettoIncome)} color="#059669" bg="rgba(5,150,105,0.12)" />
            <MiniStat label="Deductions" value={eur(mockStats.deductionsFound)} color="#2563EB" bg="rgba(37,99,235,0.12)" />
            <MiniStat label="Pending Review" value={String(mockStats.pendingReview)} color="#D97706" bg="rgba(217,119,6,0.12)" />
            <MiniStat label="AI Accuracy" value="98%" color="#059669" bg="rgba(5,150,105,0.12)" />
          </div>
        </div>

        {/* Panel 3: Recent Transactions */}
        <div className={CARD + " overflow-hidden"}>
          <p className={CARD_HEADER}>Recent Transactions</p>
          <div className="-mx-5">
            {/* Table header */}
            <div className="px-5 pb-2 grid grid-cols-[56px_1fr_auto_90px] gap-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#4B5563]">
              <span>Date</span>
              <span>Counterparty</span>
              <span>Category</span>
              <span className="text-right">Amount</span>
            </div>
            {/* Rows */}
            {mockTransactions.map((tx) => {
              const badge = categoryBadge(tx.category);
              return (
                <div
                  key={tx.id}
                  className="px-5 py-2.5 grid grid-cols-[56px_1fr_auto_90px] gap-3 items-center border-t border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                >
                  <span className="text-xs text-[#6B7280]" style={TABULAR}>{tx.date}</span>
                  <span className="text-sm text-[#F9FAFB] truncate">{tx.counterparty}</span>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md whitespace-nowrap"
                    style={{ backgroundColor: badge.bg, color: badge.text }}
                  >
                    {tx.category.replace(/_/g, " ")}
                  </span>
                  <span
                    className={"text-sm text-right font-medium " + (tx.amount >= 0 ? "text-[#059669]" : "text-[#F9FAFB]")}
                    style={TABULAR}
                  >
                    {tx.amount >= 0 ? "+" : ""}{eur(tx.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel 4: Upcoming Deadlines */}
        <div className={CARD}>
          <p className={CARD_HEADER}>Upcoming Deadlines</p>
          <div className="space-y-3">
            {mockDeadlines.map((d, i) => {
              const urgency = i === 0
                ? { bg: "rgba(220,38,38,0.12)", text: "#DC2626", label: "Urgent" }
                : i === 1
                  ? { bg: "rgba(217,119,6,0.12)", text: "#D97706", label: "28 days" }
                  : { bg: "rgba(5,150,105,0.12)", text: "#059669", label: "On track" };
              return (
                <div key={d.label} className="flex items-center gap-3 p-3 rounded-[10px] bg-[#1F2937]">
                  <Calendar className="w-4 h-4 text-[#6B7280] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F9FAFB] truncate">{d.label}</p>
                    <p className="text-xs text-[#6B7280]">{d.date}</p>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0"
                    style={{ backgroundColor: urgency.bg, color: urgency.text }}
                  >
                    {urgency.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel 5: AI Insights */}
        <div className={CARD}>
          <p className={CARD_HEADER}>AI Insights</p>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <p className="text-sm text-[#F9FAFB]">Wijs spotted 3 potential deductions</p>
          </div>
          <div className="space-y-2">
            {[
              { label: "Home office deduction", amount: "~\u00A0\u20AC380" },
              { label: "Phone plan split", amount: "~\u00A0\u20AC145" },
              { label: "Travel expenses", amount: "~\u00A0\u20AC92" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-[10px] bg-[#1F2937]">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-[#D97706]" />
                  <span className="text-sm text-[#9CA3AF]">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-[#059669]" style={TABULAR}>{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 6: Quick Actions / Receipt Drop Zone */}
        <div className={CARD}>
          <p className={CARD_HEADER}>Quick Actions</p>

          {/* Drop zone (desktop) / Buttons (mobile) */}
          <div
            className="hidden sm:flex flex-col items-center justify-center border-2 border-dashed border-[rgba(255,255,255,0.08)] hover:border-[rgba(37,99,235,0.4)] rounded-[10px] p-6 mb-4 transition-colors cursor-pointer"
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={() => cameraRef.current?.click()}
          >
            <Upload className="w-6 h-6 text-[#4B5563] mb-2" />
            <p className="text-sm text-[#6B7280]">Drop receipts here</p>
            <p className="text-[10px] text-[#4B5563] mt-1">JPG, PNG, PDF</p>
          </div>

          <div className="sm:hidden flex gap-2 mb-4">
            <button
              onClick={() => cameraRef.current?.click()}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#3B82F6] text-white px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors"
            >
              <Camera className="w-4 h-4" /> Scan Receipt
            </button>
            <button
              onClick={() => cameraRef.current?.click()}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1F2937] hover:bg-[rgba(255,255,255,0.08)] text-[#9CA3AF] px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors border border-[rgba(255,255,255,0.08)]"
            >
              <Upload className="w-4 h-4" /> Upload
            </button>
          </div>

          {/* Secondary buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button className="flex flex-col items-center gap-1.5 p-3 rounded-[10px] bg-[#1F2937] hover:bg-[rgba(255,255,255,0.08)] transition-colors">
              <FileCheck className="w-4 h-4 text-[#2563EB]" />
              <span className="text-[11px] text-[#9CA3AF]">File BTW</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 p-3 rounded-[10px] bg-[#1F2937] hover:bg-[rgba(255,255,255,0.08)] transition-colors">
              <FileDown className="w-4 h-4 text-[#2563EB]" />
              <span className="text-[11px] text-[#9CA3AF]">Export CSV</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 p-3 rounded-[10px] bg-[#1F2937] hover:bg-[rgba(255,255,255,0.08)] transition-colors">
              <MessageCircle className="w-4 h-4 text-[#2563EB]" />
              <span className="text-[11px] text-[#9CA3AF]">Ask Wijs</span>
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

/* ================================================================ */
/*  MINI STAT (for Quick Stats 2x2 grid)                             */
/* ================================================================ */
function MiniStat({ label, value, color, bg }: { label: string; value: string; color: string; bg: string }) {
  return (
    <div className="p-3 rounded-[10px] bg-[#1F2937]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#6B7280] mb-1.5">{label}</p>
      <p className="text-lg font-semibold" style={{ ...TABULAR, color }}>{value}</p>
    </div>
  );
}

/* ================================================================ */
/*  BTW AANGIFTE TAB                                                 */
/* ================================================================ */
function BtwAangifteTab() {
  const [filed, setFiled] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const btwBoxes = [
    { box: "1a", label: "Leveringen/diensten belast met hoog tarief", revenue: 4500, btw: 945 },
    { box: "1b", label: "Leveringen/diensten belast met laag tarief", revenue: 0, btw: 0 },
    { box: "1c", label: "Leveringen/diensten belast met overige tarieven", revenue: 0, btw: 0 },
    { box: "1d", label: "Prive-gebruik", revenue: 0, btw: 0 },
    { box: "1e", label: "Leveringen/diensten belast met 0% of niet bij u belast", revenue: 0, btw: 0 },
    { box: "2a", label: "Leveringen/diensten waarbij de BTW naar u is verlegd", revenue: 0, btw: 0 },
    { box: "3",  label: "Leveringen naar landen buiten de EU", revenue: 0, btw: 0 },
    { box: "4a", label: "Leveringen naar landen binnen de EU", revenue: 0, btw: 0 },
    { box: "4b", label: "Diensten naar landen binnen de EU", revenue: 0, btw: 0 },
    { box: "5a", label: "Verschuldigde omzetbelasting (subtotaal)", revenue: null, btw: 945 },
    { box: "5b", label: "Voorbelasting (BTW die u heeft betaald)", revenue: null, btw: 97.52 },
    { box: "5c", label: "Subtotaal", revenue: null, btw: 0 },
    { box: "5d", label: "Vermindering volgens kleineondernemersregeling", revenue: null, btw: 0 },
    { box: "5e", label: "Schatting vorige tijdvakken", revenue: null, btw: 0 },
    { box: "5f", label: "Totaal", revenue: null, btw: 0 },
  ];

  const totalOwed = 945 - 97.52;

  const copyValue = (box: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(box);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#F9FAFB]">BTW Aangifte</h1>
          <p className="text-sm text-[#6B7280]">Q1 2026 (January - March) &middot; Deadline: April 30, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#D97706] bg-[rgba(217,119,6,0.12)] px-3 py-1.5 rounded-full">28 days remaining</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className={CARD}>
          <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider mb-1">BTW Collected</p>
          <p className="text-2xl font-semibold text-[#F9FAFB]" style={TABULAR}>{eur(945)}</p>
        </div>
        <div className={CARD}>
          <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider mb-1">BTW Paid (voorbelasting)</p>
          <p className="text-2xl font-semibold text-[#F9FAFB]" style={TABULAR}>{eur(97.52)}</p>
        </div>
        <div className="bg-[rgba(37,99,235,0.08)] border border-[rgba(37,99,235,0.2)] rounded-[14px] p-5">
          <p className="text-[11px] font-medium text-[#2563EB] uppercase tracking-wider mb-1">Amount to pay</p>
          <p className="text-2xl font-semibold text-[#2563EB]" style={TABULAR}>{eur(totalOwed)}</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-[rgba(37,99,235,0.08)] border border-[rgba(37,99,235,0.15)] rounded-[10px] p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[#F9FAFB]">How filing works</p>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Wijs calculates your BTW boxes automatically from your categorized transactions. You can review the values below,
            then either copy them into <span className="text-[#2563EB] font-medium">Mijn Belastingdienst</span> or let Wijs file directly via SBR/Digipoort (coming soon).
          </p>
        </div>
      </div>

      {/* BTW boxes table */}
      <div className="bg-[#111827] rounded-[14px] border border-[rgba(255,255,255,0.08)] overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <h2 className="font-semibold text-[#F9FAFB]">BTW Boxes (Rubrieken)</h2>
          <span className="text-xs text-[#4B5563]">Auto-calculated from {mockTransactions.length} transactions</span>
        </div>
        <div className="divide-y divide-[rgba(255,255,255,0.04)]">
          <div className="px-5 py-2.5 grid grid-cols-[60px_1fr_120px_120px_40px] gap-4 text-[11px] font-medium text-[#4B5563] uppercase tracking-wider">
            <span>Box</span>
            <span>Description</span>
            <span className="text-right">Revenue</span>
            <span className="text-right">BTW</span>
            <span></span>
          </div>
          {btwBoxes.map((row) => (
            <div key={row.box} className={`px-5 py-3 grid grid-cols-[60px_1fr_120px_120px_40px] gap-4 items-center ${row.box === "5a" || row.box === "5f" ? "bg-[#1F2937] font-semibold" : ""}`}>
              <span className="text-sm font-medium text-[#2563EB]">{row.box}</span>
              <span className="text-sm text-[#9CA3AF]">{row.label}</span>
              <span className="text-sm text-right text-[#F9FAFB]" style={TABULAR}>{row.revenue !== null ? eur(row.revenue) : ""}</span>
              <span className="text-sm text-right text-[#F9FAFB]" style={TABULAR}>{eur(row.btw)}</span>
              <button onClick={() => copyValue(row.box, row.btw.toFixed(2))} className="text-[#4B5563] hover:text-[#9CA3AF] transition-colors">
                {copied === row.box ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a href="https://mijn.belastingdienst.nl" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#1F2937] border border-[rgba(255,255,255,0.08)] text-[#9CA3AF] px-5 py-3 rounded-[10px] text-sm font-medium hover:bg-[rgba(255,255,255,0.06)] transition-colors">
          <ExternalLink className="w-4 h-4" /> Open Mijn Belastingdienst
        </a>
        <button
          onClick={() => setFiled(true)}
          disabled={filed}
          className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[10px] text-sm font-semibold transition-all ${filed ? "bg-[rgba(5,150,105,0.12)] text-[#059669] border border-[rgba(5,150,105,0.2)]" : "bg-[#2563EB] text-white hover:bg-[#3B82F6]"}`}
        >
          {filed ? <><CheckCircle2 className="w-4 h-4" /> Marked as filed</> : <><FileCheck className="w-4 h-4" /> File via SBR (coming soon)</>}
        </button>
      </div>
    </>
  );
}

/* ================================================================ */
/*  INVOICES TAB                                                     */
/* ================================================================ */
function InvoicesTab() {
  const mockInvoices = [
    { id: "INV-2026-001", client: "Acme BV", amount: 4500, btw: 945, status: "paid", date: "Mar 15, 2026" },
    { id: "INV-2026-002", client: "TechCorp NL", amount: 2800, btw: 588, status: "sent", date: "Mar 22, 2026" },
    { id: "INV-2026-003", client: "Design Studio", amount: 1200, btw: 252, status: "draft", date: "Mar 28, 2026" },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#F9FAFB]">Invoices</h1>
          <p className="text-sm text-[#6B7280]">Create and manage invoices for your clients.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-[10px] text-sm font-medium hover:bg-[#3B82F6]">
          <Plus className="w-4 h-4" /> New invoice
        </button>
      </div>

      <div className="bg-[#111827] rounded-[14px] border border-[rgba(255,255,255,0.08)] overflow-hidden">
        <div className="divide-y divide-[rgba(255,255,255,0.04)]">
          <div className="px-5 py-3 grid grid-cols-[1fr_1fr_100px_100px_100px] gap-4 text-[11px] font-medium text-[#4B5563] uppercase tracking-wider">
            <span>Invoice</span><span>Client</span><span className="text-right">Amount</span><span className="text-right">BTW</span><span className="text-right">Status</span>
          </div>
          {mockInvoices.map((inv) => (
            <div key={inv.id} className="px-5 py-4 grid grid-cols-[1fr_1fr_100px_100px_100px] gap-4 items-center hover:bg-[rgba(255,255,255,0.02)]">
              <div>
                <p className="text-sm font-medium text-[#F9FAFB]">{inv.id}</p>
                <p className="text-xs text-[#4B5563]">{inv.date}</p>
              </div>
              <span className="text-sm text-[#9CA3AF]">{inv.client}</span>
              <span className="text-sm text-right text-[#F9FAFB]" style={TABULAR}>{eur(inv.amount)}</span>
              <span className="text-sm text-right text-[#6B7280]" style={TABULAR}>{eur(inv.btw)}</span>
              <div className="text-right">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  inv.status === "paid" ? "bg-[rgba(5,150,105,0.12)] text-[#059669]" :
                  inv.status === "sent" ? "bg-[rgba(37,99,235,0.12)] text-[#2563EB]" :
                  "bg-[rgba(75,85,99,0.25)] text-[#9CA3AF]"
                }`}>{inv.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ================================================================ */
/*  RECEIPTS TAB                                                     */
/* ================================================================ */
function ReceiptsTab() {
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [receipts] = useState([
    { id: "1", vendor: "Bol.com", amount: 89.99, date: "Mar 28", matched: true },
    { id: "2", vendor: "Coolblue", amount: 159.00, date: "Mar 20", matched: false },
  ]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#F9FAFB]">Receipts</h1>
          <p className="text-sm text-[#6B7280]">Scan or upload receipts to match with transactions.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => cameraRef.current?.click()} className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-[10px] text-sm font-medium hover:bg-[#3B82F6]">
            <Camera className="w-4 h-4" /> Scan
          </button>
          <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 bg-[#1F2937] border border-[rgba(255,255,255,0.08)] text-[#9CA3AF] px-4 py-2 rounded-[10px] text-sm hover:bg-[rgba(255,255,255,0.06)]">
            <Upload className="w-4 h-4" /> Upload
          </button>
        </div>
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" />
        <input ref={fileRef} type="file" accept="image/*,.pdf" multiple className="hidden" />
      </div>

      {/* Drop zone */}
      <div className="bg-[#111827] rounded-[14px] border-2 border-dashed border-[rgba(255,255,255,0.08)] p-12 text-center mb-6 hover:border-[rgba(37,99,235,0.4)] transition-colors">
        <Upload className="w-10 h-10 text-[#4B5563] mx-auto mb-3" />
        <p className="text-sm font-medium text-[#9CA3AF]">Drop receipts here or click to upload</p>
        <p className="text-xs text-[#4B5563] mt-1">Supports JPG, PNG, PDF &middot; Wijs will auto-extract vendor, amount, and BTW</p>
      </div>

      {/* Receipt list */}
      <div className="bg-[#111827] rounded-[14px] border border-[rgba(255,255,255,0.08)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.08)]">
          <h2 className="font-semibold text-[#F9FAFB]">Uploaded receipts</h2>
        </div>
        <div className="divide-y divide-[rgba(255,255,255,0.04)]">
          {receipts.map((r) => (
            <div key={r.id} className="px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-[10px] bg-[#1F2937] flex items-center justify-center">
                <Receipt className="w-5 h-5 text-[#6B7280]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#F9FAFB]">{r.vendor}</p>
                <p className="text-xs text-[#6B7280]">{r.date} &middot; {eur(r.amount)}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${r.matched ? "bg-[rgba(5,150,105,0.12)] text-[#059669]" : "bg-[rgba(217,119,6,0.12)] text-[#D97706]"}`}>
                {r.matched ? "Matched" : "Unmatched"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ================================================================ */
/*  BANK ACCOUNTS TAB                                                */
/* ================================================================ */
function BankAccountsTab() {
  const connectedBanks = [
    { name: "ING", iban: "NL91 INGB 0001 2345 67", status: "active", lastSync: "2 hours ago", color: "#ff6200" },
  ];

  const availableBanks = [
    { name: "ABN AMRO", color: "#004c3f" },
    { name: "Rabobank", color: "#0068b4" },
    { name: "bunq", color: "#30c381" },
    { name: "Revolut", color: "#0075eb" },
    { name: "N26", color: "#48d2a0" },
    { name: "SNS", color: "#e5007d" },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#F9FAFB]">Bank Accounts</h1>
        <p className="text-sm text-[#6B7280]">Connect and manage your bank accounts via PSD2 Open Banking.</p>
      </div>

      {/* Security notice */}
      <div className="bg-[rgba(5,150,105,0.08)] border border-[rgba(5,150,105,0.15)] rounded-[10px] p-4 mb-6 flex items-start gap-3">
        <Shield className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[#F9FAFB]">Read-only &middot; Bank-level security</p>
          <p className="text-sm text-[#9CA3AF] mt-0.5">askwijs can never move your money. We use PSD2 Open Banking (EU regulated) with AES-256 encryption.</p>
        </div>
      </div>

      {/* Connected banks */}
      <div className="bg-[#111827] rounded-[14px] border border-[rgba(255,255,255,0.08)] overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.08)]">
          <h2 className="font-semibold text-[#F9FAFB]">Connected accounts</h2>
        </div>
        {connectedBanks.length === 0 ? (
          <div className="p-8 text-center text-[#4B5563] text-sm">No accounts connected yet.</div>
        ) : (
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {connectedBanks.map((bank) => (
              <div key={bank.iban} className="px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: bank.color + "15" }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: bank.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#F9FAFB]">{bank.name}</p>
                  <p className="text-xs text-[#6B7280]" style={TABULAR}>{bank.iban}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-[#059669] bg-[rgba(5,150,105,0.12)] px-2 py-1 rounded-full">Active</span>
                  <p className="text-[11px] text-[#4B5563] mt-1">Synced {bank.lastSync}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add new bank */}
      <div className="bg-[#111827] rounded-[14px] border border-[rgba(255,255,255,0.08)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.08)]">
          <h2 className="font-semibold text-[#F9FAFB]">Connect another bank</h2>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {availableBanks.map((bank) => (
            <button
              key={bank.name}
              className="flex items-center gap-3 p-4 rounded-[10px] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(37,99,235,0.3)] hover:bg-[rgba(37,99,235,0.06)] transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: bank.color + "15" }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: bank.color }} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#F9FAFB] group-hover:text-[#2563EB]">{bank.name}</p>
                <p className="text-[11px] text-[#4B5563]">Connect via PSD2</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ================================================================ */
/*  SETTINGS TAB                                                     */
/* ================================================================ */
function SettingsTab() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#F9FAFB]">Settings</h1>
        <p className="text-sm text-[#6B7280]">Manage your account, business details, and preferences.</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Profile */}
        <div className={CARD}>
          <h3 className="font-semibold text-[#F9FAFB] flex items-center gap-2 mb-4"><User className="w-4 h-4 text-[#6B7280]" /> Profile</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1 block">Full name</label>
              <input className="w-full border border-[rgba(255,255,255,0.08)] bg-[#1F2937] rounded-[10px] px-3 py-2 text-sm text-[#F9FAFB] outline-none focus:border-[#2563EB]" defaultValue="Ned Karlovich" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1 block">Email</label>
              <input className="w-full border border-[rgba(255,255,255,0.08)] bg-[#1F2937] rounded-[10px] px-3 py-2 text-sm text-[#F9FAFB] outline-none focus:border-[#2563EB]" defaultValue="ned@example.com" />
            </div>
          </div>
        </div>

        {/* Business details */}
        <div className={CARD}>
          <h3 className="font-semibold text-[#F9FAFB] flex items-center gap-2 mb-4"><Building2 className="w-4 h-4 text-[#6B7280]" /> Business details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1 block">Company name</label>
              <input className="w-full border border-[rgba(255,255,255,0.08)] bg-[#1F2937] rounded-[10px] px-3 py-2 text-sm text-[#F9FAFB] outline-none focus:border-[#2563EB] placeholder:text-[#4B5563]" placeholder="Your company" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1 block">KvK number</label>
              <input className="w-full border border-[rgba(255,255,255,0.08)] bg-[#1F2937] rounded-[10px] px-3 py-2 text-sm text-[#F9FAFB] outline-none focus:border-[#2563EB] placeholder:text-[#4B5563]" placeholder="12345678" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1 block">BTW-id</label>
              <input className="w-full border border-[rgba(255,255,255,0.08)] bg-[#1F2937] rounded-[10px] px-3 py-2 text-sm text-[#F9FAFB] outline-none focus:border-[#2563EB] placeholder:text-[#4B5563]" placeholder="NL000000000B01" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1 block">IBAN</label>
              <input className="w-full border border-[rgba(255,255,255,0.08)] bg-[#1F2937] rounded-[10px] px-3 py-2 text-sm text-[#F9FAFB] outline-none focus:border-[#2563EB] placeholder:text-[#4B5563]" placeholder="NL00 BANK 0000 0000 00" />
            </div>
          </div>
        </div>

        {/* Language */}
        <div className={CARD}>
          <h3 className="font-semibold text-[#F9FAFB] flex items-center gap-2 mb-4"><Globe className="w-4 h-4 text-[#6B7280]" /> Language</h3>
          <div className="flex gap-3">
            <button className="flex-1 p-3 rounded-[10px] border-2 border-[#2563EB] bg-[rgba(37,99,235,0.08)] text-center">
              <p className="text-sm font-semibold text-[#2563EB]">English</p>
              <p className="text-xs text-[#3B82F6]">Dashboard &amp; notifications</p>
            </button>
            <button className="flex-1 p-3 rounded-[10px] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] text-center transition-colors">
              <p className="text-sm font-semibold text-[#9CA3AF]">Nederlands</p>
              <p className="text-xs text-[#4B5563]">Dashboard &amp; meldingen</p>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className={CARD}>
          <h3 className="font-semibold text-[#F9FAFB] flex items-center gap-2 mb-4"><Bell className="w-4 h-4 text-[#6B7280]" /> Notifications</h3>
          <div className="space-y-3">
            {[
              { label: "Email notifications", desc: "Deadline reminders and weekly summaries" },
              { label: "WhatsApp updates", desc: "Get transaction alerts via WhatsApp" },
              { label: "Telegram updates", desc: "Get transaction alerts via Telegram" },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between p-3 rounded-[10px] border border-[rgba(255,255,255,0.08)]">
                <div>
                  <p className="text-sm font-medium text-[#F9FAFB]">{n.label}</p>
                  <p className="text-xs text-[#4B5563]">{n.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={n.label === "Email notifications"} />
                  <div className="w-9 h-5 bg-[#1F2937] peer-checked:bg-[#2563EB] rounded-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription */}
        <div className={CARD}>
          <h3 className="font-semibold text-[#F9FAFB] flex items-center gap-2 mb-4"><CreditCard className="w-4 h-4 text-[#6B7280]" /> Subscription</h3>
          <div className="flex items-center justify-between p-4 rounded-[10px] bg-[rgba(37,99,235,0.08)] border border-[rgba(37,99,235,0.15)]">
            <div>
              <p className="text-sm font-semibold text-[#F9FAFB]">askwijs Pro</p>
              <p className="text-xs text-[#6B7280]">Free trial &middot; 28 days remaining</p>
            </div>
            <p className="text-lg font-semibold text-[#F9FAFB]" style={TABULAR}>&euro;19.99<span className="text-sm font-normal text-[#6B7280]">/mo</span></p>
          </div>
        </div>

        <button className="w-full bg-[#2563EB] text-white py-3 rounded-[10px] text-sm font-semibold hover:bg-[#3B82F6] transition-colors">
          Save changes
        </button>
      </div>
    </>
  );
}

/* ================================================================ */
/*  TRANSACTIONS TAB                                                 */
/* ================================================================ */
function TransactionsTab() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#F9FAFB]">Transactions</h1>
        <p className="text-sm text-[#6B7280]">All synced transactions from your connected bank accounts.</p>
      </div>
      <div className="bg-[#111827] rounded-[14px] border border-[rgba(255,255,255,0.08)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <h2 className="font-semibold text-[#F9FAFB]">All transactions</h2>
          <span className="text-xs text-[#4B5563]">{mockTransactions.length} transactions</span>
        </div>
        <TransactionList transactions={mockTransactions} />
      </div>
    </>
  );
}

/* ================================================================ */
/*  DEADLINES TAB                                                    */
/* ================================================================ */
function DeadlinesTab() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#F9FAFB]">Deadlines</h1>
        <p className="text-sm text-[#6B7280]">Upcoming tax filing deadlines and important dates.</p>
      </div>
      <div className={CARD + " max-w-xl"}>
        <div className="space-y-4">
          {mockDeadlines.map(d => (
            <div key={d.label} className="flex items-center gap-4 p-4 rounded-[10px] border border-[rgba(255,255,255,0.08)]">
              <div className={"w-3 h-3 rounded-full shrink-0 " + (d.urgent ? "bg-[#D97706]" : "bg-[#4B5563]")} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#F9FAFB]">{d.label}</p>
                <p className="text-xs text-[#6B7280]">{d.date}</p>
              </div>
              {d.urgent && <span className="text-xs font-medium text-[#D97706] bg-[rgba(217,119,6,0.12)] px-2 py-1 rounded-full">Urgent</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ================================================================ */
/*  CHAT TAB                                                         */
/* ================================================================ */
function ChatTab() {
  const [chatMessages, setChatMessages] = useState(initMessages);
  const [chatInput, setChatInput] = useState("");

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: "assistant" as const, text: chatInput }]);
    setChatInput("");
    setTimeout(() => setChatMessages(prev => [...prev, { role: "assistant" as const, text: "I am looking into that for you..." }]), 1000);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#F9FAFB]">Ask Wijs</h1>
        <p className="text-sm text-[#6B7280]">Ask anything about your Dutch taxes, deductions, or financial situation.</p>
      </div>
      <div className="bg-[#111827] rounded-[14px] border border-[rgba(255,255,255,0.08)] overflow-hidden max-w-2xl">
        <div className="p-6 space-y-4 min-h-[300px] max-h-[500px] overflow-y-auto">
          {chatMessages.map((msg, i) => (
            <div key={i} className="flex gap-3">
              {msg.role === "assistant" && <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs font-bold shrink-0">W</div>}
              <div className="text-sm leading-relaxed max-w-[85%] px-4 py-3 rounded-[10px] bg-[#1F2937] text-[#F9FAFB]">{msg.text}</div>
            </div>
          ))}
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-center gap-2 bg-[#1F2937] rounded-[10px] px-4 py-3 border border-[rgba(255,255,255,0.08)]">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="Ask about your taxes, deductions, BTW..." className="flex-1 bg-transparent text-sm text-[#F9FAFB] outline-none placeholder:text-[#4B5563]" />
            <button onClick={sendChat} className="text-[#2563EB] hover:text-[#3B82F6]"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================================================================ */
/*  SHARED COMPONENTS                                                */
/* ================================================================ */
function TransactionList({ transactions }: { transactions: typeof mockTransactions }) {
  return (
    <div className="divide-y divide-[rgba(255,255,255,0.04)]">
      {transactions.map(tx => {
        const badge = categoryBadge(tx.category);
        return (
          <div key={tx.id} className="px-5 py-3 flex items-center gap-4 hover:bg-[rgba(255,255,255,0.02)]">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#F9FAFB] truncate">{tx.counterparty}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-[#6B7280]">{tx.date}</span>
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                  style={{ backgroundColor: badge.bg, color: badge.text }}
                >
                  {tx.category.replace(/_/g, " ")}
                </span>
                <span className="text-xs text-[#4B5563]">{tx.btw}% BTW</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className={"text-sm font-medium " + (tx.amount >= 0 ? "text-[#059669]" : "text-[#F9FAFB]")} style={TABULAR}>
                {tx.amount >= 0 ? "+" : ""}{eur(tx.amount)}
              </p>
              <span
                className={"inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium " + (tx.status === "auto_approved" ? "bg-[rgba(5,150,105,0.12)] text-[#059669]" : "bg-[rgba(217,119,6,0.12)] text-[#D97706]")}
              >
                {tx.status === "auto_approved" ? "Auto" : "Review"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
