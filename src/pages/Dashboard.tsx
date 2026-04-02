import { useState, useRef } from "react";
import { TrendingUp, TrendingDown, Calendar, Camera, Send, AlertTriangle, CheckCircle2, MessageCircle } from "lucide-react";

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

export function Dashboard() {
  const [chatMessages, setChatMessages] = useState(initMessages);
  const [chatInput, setChatInput] = useState("");
  const cameraRef = useRef<HTMLInputElement>(null);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: "assistant", text: chatInput }]);
    setChatInput("");
    setTimeout(() => setChatMessages(prev => [...prev, { role: "assistant", text: "I am looking into that for you..." }]), 1000);
  };

  const onReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) alert("Receipt captured: " + file.name);
  };

  const eur = (n: number) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
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
          <div className="divide-y divide-slate-50">
            {mockTransactions.map(tx => (
              <div key={tx.id} className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{tx.counterparty}</p>
                  <p className="text-xs text-slate-400">{tx.date} &middot; {tx.category.replace("_", " ")} &middot; {tx.btw}% BTW</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={"text-sm font-mono font-medium " + (tx.amount >= 0 ? "text-emerald-600" : "text-slate-900")}>
                    {tx.amount >= 0 ? "+" : ""}{eur(tx.amount)}
                  </p>
                  <span className={"inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium " + (tx.status === "auto_approved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                    {tx.status === "auto_approved" ? "Auto" : "Review"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
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
      <p className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">{value}</p>
    </div>
  );
}
