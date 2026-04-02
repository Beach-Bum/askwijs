import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  TrendingUp, TrendingDown, Calendar, Camera, Send, AlertTriangle,
  CheckCircle2, MessageCircle, FileText, Receipt, Building2, Plus,
  Upload, ExternalLink, Shield, Globe, User, CreditCard, Bell,
  FileCheck, Info, Copy, Check,
} from "lucide-react";

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

export function Dashboard() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "overview";

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
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
  );
}

/* ================================================================ */
/*  OVERVIEW TAB                                                     */
/* ================================================================ */
function OverviewTab() {
  const cameraRef = useRef<HTMLInputElement>(null);
  const onReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) alert("Receipt captured: " + file.name);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back. Here is your financial overview.</p>
        </div>
        <button onClick={() => cameraRef.current?.click()} className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm hover:bg-slate-50">
          <Camera className="w-4 h-4" /> Scan receipt
        </button>
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onReceipt} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat label="NETTO INCOME" value={eur(mockStats.nettoIncome)} icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-50" />
        <Stat label="BTW OWED (Q1)" value={eur(mockStats.btwOwed)} icon={TrendingDown} color="text-[#2563eb]" bg="bg-blue-50" />
        <Stat label="DEDUCTIONS FOUND" value={eur(mockStats.deductionsFound)} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" />
        <Stat label="PENDING REVIEW" value={String(mockStats.pendingReview)} icon={AlertTriangle} color="text-amber-600" bg="bg-amber-50" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent transactions</h2>
            <span className="text-xs text-slate-400">Synced via PSD2</span>
          </div>
          <TransactionList transactions={mockTransactions.slice(0, 4)} />
        </div>
        <div className="space-y-6">
          <DeadlineCard />
          <ChatCard />
        </div>
      </div>
    </>
  );
}

/* ================================================================ */
/*  BTW AANGIFTE TAB                                                 */
/* ================================================================ */
function BtwAangifteTab() {
  const [filed, setFiled] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Pre-calculated from mock transactions
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
          <h1 className="text-2xl font-semibold text-slate-900">BTW Aangifte</h1>
          <p className="text-sm text-slate-500">Q1 2026 (January - March) &middot; Deadline: April 30, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">28 days remaining</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">BTW Collected</p>
          <p className="text-2xl font-semibold text-slate-900 tabular-nums">{eur(945)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">BTW Paid (voorbelasting)</p>
          <p className="text-2xl font-semibold text-slate-900 tabular-nums">{eur(97.52)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 border-blue-200 bg-blue-50/30">
          <p className="text-[11px] font-medium text-blue-600 uppercase tracking-wider mb-1">Amount to pay</p>
          <p className="text-2xl font-semibold text-blue-700 tabular-nums">{eur(totalOwed)}</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">How filing works</p>
          <p className="text-sm text-blue-700 mt-1">
            Wijs calculates your BTW boxes automatically from your categorized transactions. You can review the values below,
            then either copy them into <strong>Mijn Belastingdienst</strong> or let Wijs file directly via SBR/Digipoort (coming soon).
          </p>
        </div>
      </div>

      {/* BTW boxes table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">BTW Boxes (Rubrieken)</h2>
          <span className="text-xs text-slate-400">Auto-calculated from {mockTransactions.length} transactions</span>
        </div>
        <div className="divide-y divide-slate-50">
          <div className="px-5 py-2.5 grid grid-cols-[60px_1fr_120px_120px_40px] gap-4 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            <span>Box</span>
            <span>Description</span>
            <span className="text-right">Revenue</span>
            <span className="text-right">BTW</span>
            <span></span>
          </div>
          {btwBoxes.map((row) => (
            <div key={row.box} className={`px-5 py-3 grid grid-cols-[60px_1fr_120px_120px_40px] gap-4 items-center ${row.box === "5a" || row.box === "5f" ? "bg-slate-50 font-semibold" : ""}`}>
              <span className="text-sm font-medium text-blue-600">{row.box}</span>
              <span className="text-sm text-slate-700">{row.label}</span>
              <span className="text-sm text-right tabular-nums text-slate-900">{row.revenue !== null ? eur(row.revenue) : ""}</span>
              <span className="text-sm text-right tabular-nums text-slate-900">{eur(row.btw)}</span>
              <button onClick={() => copyValue(row.box, row.btw.toFixed(2))} className="text-slate-300 hover:text-slate-500 transition-colors">
                {copied === row.box ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a href="https://mijn.belastingdienst.nl" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
          <ExternalLink className="w-4 h-4" /> Open Mijn Belastingdienst
        </a>
        <button
          onClick={() => setFiled(true)}
          disabled={filed}
          className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${filed ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"}`}
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
          <h1 className="text-2xl font-semibold text-slate-900">Invoices</h1>
          <p className="text-sm text-slate-500">Create and manage invoices for your clients.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#2563eb] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1d4ed8]">
          <Plus className="w-4 h-4" /> New invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-50">
          <div className="px-5 py-3 grid grid-cols-[1fr_1fr_100px_100px_100px] gap-4 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            <span>Invoice</span><span>Client</span><span className="text-right">Amount</span><span className="text-right">BTW</span><span className="text-right">Status</span>
          </div>
          {mockInvoices.map((inv) => (
            <div key={inv.id} className="px-5 py-4 grid grid-cols-[1fr_1fr_100px_100px_100px] gap-4 items-center hover:bg-slate-50/50">
              <div>
                <p className="text-sm font-medium text-slate-900">{inv.id}</p>
                <p className="text-xs text-slate-400">{inv.date}</p>
              </div>
              <span className="text-sm text-slate-700">{inv.client}</span>
              <span className="text-sm text-right tabular-nums text-slate-900">{eur(inv.amount)}</span>
              <span className="text-sm text-right tabular-nums text-slate-500">{eur(inv.btw)}</span>
              <div className="text-right">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  inv.status === "paid" ? "bg-emerald-50 text-emerald-700" :
                  inv.status === "sent" ? "bg-blue-50 text-blue-700" :
                  "bg-slate-100 text-slate-600"
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
          <h1 className="text-2xl font-semibold text-slate-900">Receipts</h1>
          <p className="text-sm text-slate-500">Scan or upload receipts to match with transactions.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => cameraRef.current?.click()} className="inline-flex items-center gap-2 bg-[#2563eb] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1d4ed8]">
            <Camera className="w-4 h-4" /> Scan
          </button>
          <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm hover:bg-slate-50">
            <Upload className="w-4 h-4" /> Upload
          </button>
        </div>
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" />
        <input ref={fileRef} type="file" accept="image/*,.pdf" multiple className="hidden" />
      </div>

      {/* Drop zone */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center mb-6 hover:border-blue-300 transition-colors">
        <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-700">Drop receipts here or click to upload</p>
        <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, PDF &middot; Wijs will auto-extract vendor, amount, and BTW</p>
      </div>

      {/* Receipt list */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Uploaded receipts</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {receipts.map((r) => (
            <div key={r.id} className="px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{r.vendor}</p>
                <p className="text-xs text-slate-400">{r.date} &middot; {eur(r.amount)}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${r.matched ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
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
        <h1 className="text-2xl font-semibold text-slate-900">Bank Accounts</h1>
        <p className="text-sm text-slate-500">Connect and manage your bank accounts via PSD2 Open Banking.</p>
      </div>

      {/* Security notice */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-emerald-900">Read-only &middot; Bank-level security</p>
          <p className="text-sm text-emerald-700 mt-0.5">askwijs can never move your money. We use PSD2 Open Banking (EU regulated) with AES-256 encryption.</p>
        </div>
      </div>

      {/* Connected banks */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Connected accounts</h2>
        </div>
        {connectedBanks.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No accounts connected yet.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {connectedBanks.map((bank) => (
              <div key={bank.iban} className="px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bank.color + "15" }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: bank.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{bank.name}</p>
                  <p className="text-xs text-slate-400 tabular-nums">{bank.iban}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">Active</span>
                  <p className="text-[11px] text-slate-400 mt-1">Synced {bank.lastSync}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add new bank */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Connect another bank</h2>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {availableBanks.map((bank) => (
            <button
              key={bank.name}
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: bank.color + "15" }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: bank.color }} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700">{bank.name}</p>
                <p className="text-[11px] text-slate-400">Connect via PSD2</p>
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
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Manage your account, business details, and preferences.</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4"><User className="w-4 h-4 text-slate-400" /> Profile</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Full name</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" defaultValue="Ned Karlovich" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Email</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" defaultValue="ned@example.com" />
            </div>
          </div>
        </div>

        {/* Business details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4"><Building2 className="w-4 h-4 text-slate-400" /> Business details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Company name</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Your company" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">KvK number</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="12345678" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">BTW-id</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="NL000000000B01" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">IBAN</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="NL00 BANK 0000 0000 00" />
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4"><Globe className="w-4 h-4 text-slate-400" /> Language</h3>
          <div className="flex gap-3">
            <button className="flex-1 p-3 rounded-xl border-2 border-blue-500 bg-blue-50/50 text-center">
              <p className="text-sm font-semibold text-blue-700">English</p>
              <p className="text-xs text-blue-500">Dashboard &amp; notifications</p>
            </button>
            <button className="flex-1 p-3 rounded-xl border border-slate-200 hover:border-slate-300 text-center transition-colors">
              <p className="text-sm font-semibold text-slate-700">Nederlands</p>
              <p className="text-xs text-slate-400">Dashboard &amp; meldingen</p>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4"><Bell className="w-4 h-4 text-slate-400" /> Notifications</h3>
          <div className="space-y-3">
            {[
              { label: "Email notifications", desc: "Deadline reminders and weekly summaries" },
              { label: "WhatsApp updates", desc: "Get transaction alerts via WhatsApp" },
              { label: "Telegram updates", desc: "Get transaction alerts via Telegram" },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-900">{n.label}</p>
                  <p className="text-xs text-slate-400">{n.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={n.label === "Email notifications"} />
                  <div className="w-9 h-5 bg-slate-200 peer-checked:bg-blue-600 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4"><CreditCard className="w-4 h-4 text-slate-400" /> Subscription</h3>
          <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/50 border border-blue-100">
            <div>
              <p className="text-sm font-semibold text-slate-900">askwijs Pro</p>
              <p className="text-xs text-slate-500">Free trial &middot; 28 days remaining</p>
            </div>
            <p className="text-lg font-semibold text-slate-900 tabular-nums">&euro;19.99<span className="text-sm font-normal text-slate-400">/mo</span></p>
          </div>
        </div>

        <button className="w-full bg-[#2563eb] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#1d4ed8] transition-colors">
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
        <h1 className="text-2xl font-semibold text-slate-900">Transactions</h1>
        <p className="text-sm text-slate-500">All synced transactions from your connected bank accounts.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">All transactions</h2>
          <span className="text-xs text-slate-400">{mockTransactions.length} transactions</span>
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
        <h1 className="text-2xl font-semibold text-slate-900">Deadlines</h1>
        <p className="text-sm text-slate-500">Upcoming tax filing deadlines and important dates.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl">
        <div className="space-y-4">
          {mockDeadlines.map(d => (
            <div key={d.label} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100">
              <div className={"w-3 h-3 rounded-full shrink-0 " + (d.urgent ? "bg-amber-500" : "bg-slate-300")} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{d.label}</p>
                <p className="text-xs text-slate-400">{d.date}</p>
              </div>
              {d.urgent && <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Urgent</span>}
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
        <h1 className="text-2xl font-semibold text-slate-900">Ask Wijs</h1>
        <p className="text-sm text-slate-500">Ask anything about your Dutch taxes, deductions, or financial situation.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden max-w-2xl">
        <div className="p-6 space-y-4 min-h-[300px] max-h-[500px] overflow-y-auto">
          {chatMessages.map((msg, i) => (
            <div key={i} className="flex gap-3">
              {msg.role === "assistant" && <div className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-xs font-bold shrink-0">W</div>}
              <div className="text-sm leading-relaxed max-w-[85%] px-4 py-3 rounded-xl bg-blue-50 text-slate-800">{msg.text}</div>
            </div>
          ))}
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="Ask about your taxes, deductions, BTW..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" />
            <button onClick={sendChat} className="text-[#2563eb] hover:text-[#1d4ed8]"><Send className="w-4 h-4" /></button>
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
    <div className="divide-y divide-slate-50">
      {transactions.map(tx => (
        <div key={tx.id} className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50/50">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{tx.counterparty}</p>
            <p className="text-xs text-slate-400">{tx.date} &middot; {tx.category.replace("_", " ")} &middot; {tx.btw}% BTW</p>
          </div>
          <div className="text-right shrink-0">
            <p className={"text-sm font-medium tabular-nums " + (tx.amount >= 0 ? "text-emerald-600" : "text-slate-900")}>
              {tx.amount >= 0 ? "+" : ""}{eur(tx.amount)}
            </p>
            <span className={"inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium " + (tx.status === "auto_approved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
              {tx.status === "auto_approved" ? "Auto" : "Review"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DeadlineCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-slate-400" /> Upcoming deadlines
      </h3>
      <div className="space-y-3">
        {mockDeadlines.map(d => (
          <div key={d.label} className="flex items-start gap-3">
            <div className={"w-2 h-2 rounded-full mt-1.5 shrink-0 " + (d.urgent ? "bg-amber-500" : "bg-slate-300")} />
            <div>
              <p className="text-sm font-medium text-slate-900">{d.label}</p>
              <p className="text-xs text-slate-400">{d.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatCard() {
  const [chatMessages, setChatMessages] = useState(initMessages);
  const [chatInput, setChatInput] = useState("");

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: "assistant" as const, text: chatInput }]);
    setChatInput("");
    setTimeout(() => setChatMessages(prev => [...prev, { role: "assistant" as const, text: "I am looking into that for you..." }]), 1000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-[#2563eb]" /> Ask Wijs
        </h3>
      </div>
      <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
        {chatMessages.map((msg, i) => (
          <div key={i} className="flex gap-2">
            {msg.role === "assistant" && <div className="w-7 h-7 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-xs font-bold shrink-0">W</div>}
            <div className="text-sm leading-relaxed max-w-[85%] px-3 py-2 rounded-xl bg-blue-50 text-slate-800">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
          <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="Ask about your taxes..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" />
          <button onClick={sendChat} className="text-[#2563eb] hover:text-[#1d4ed8]"><Send className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, color, bg }: { label: string; value: string; icon: any; color: string; bg: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{label}</span>
        <div className={"w-8 h-8 rounded-lg flex items-center justify-center " + bg}><Icon className={"w-4 h-4 " + color} /></div>
      </div>
      <p className="text-xl sm:text-2xl font-semibold text-slate-900 tabular-nums">{value}</p>
    </div>
  );
}
