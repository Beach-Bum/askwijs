import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Building2, Landmark, ArrowRight, Check } from "lucide-react";

const steps = [
  { label: "Welcome", icon: Check },
  { label: "Business", icon: Building2 },
  { label: "Bank", icon: Landmark },
];

const BANKS = [
  { id: "ING", name: "ING", color: "#ff6200" },
  { id: "ABNAMRO", name: "ABN AMRO", color: "#009286" },
  { id: "RABOBANK", name: "Rabobank", color: "#003082" },
  { id: "BUNQ", name: "bunq", color: "#39c" },
  { id: "SNS", name: "SNS", color: "#f60" },
  { id: "REVOLUT", name: "Revolut", color: "#0075eb" },
];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", companyName: "", kvkNumber: "", btwId: "", phone: "" });
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBankConnect = async (bankId: string) => {
    setSelectedBank(bankId);
    setConnecting(true);
    try {
      const res = await fetch("/api/banking/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bankId, userId: user?.id }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch {
      setConnecting(false);
    }
  };

  const handleSkipBank = () => navigate("/subscribe");

  const handleSaveProfile = async () => {
    await fetch("/api/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, userId: user?.id }),
    });
    setStep(2);
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#2563eb]";

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col">
      {/* Progress bar */}
      <div className="px-6 pt-6 pb-4">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${i <= step ? "bg-[#2563eb] text-white" : "bg-white/10 text-slate-500"}`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${i <= step ? "text-white" : "text-slate-500"}`}>{s.label}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-[#2563eb]" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-lg">

          {step === 0 && (
            <div className="text-center">
              <h1 className="font-display text-3xl sm:text-4xl mb-4">Welcome to askwijs</h1>
              <p className="text-slate-400 text-lg mb-2">Your Dutch taxes, fully automated.</p>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-10">
                Set up your profile in under 2 minutes. Connect your bank, and Wijs handles the rest.
              </p>
              <button onClick={() => setStep(1)} className="bg-[#2563eb] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#1d4ed8] transition-colors inline-flex items-center gap-2">
                Let&apos;s go <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-display text-3xl mb-2 text-center">Your business</h2>
              <p className="text-slate-400 text-sm text-center mb-8">Used for BTW filings and invoices</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Your name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Jan de Vries" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Company name</label>
                    <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className={inputClass} placeholder="De Vries Consulting" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">KvK number</label>
                    <input value={form.kvkNumber} onChange={(e) => setForm({ ...form, kvkNumber: e.target.value })} className={inputClass} placeholder="12345678" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">BTW-id (optional)</label>
                    <input value={form.btwId} onChange={(e) => setForm({ ...form, btwId: e.target.value })} className={inputClass} placeholder="NL123456789B01" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Phone (WhatsApp/Telegram alerts)</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+31 6 12345678" />
                </div>
                <button onClick={handleSaveProfile} className="w-full bg-[#2563eb] text-white py-3 rounded-lg font-medium hover:bg-[#1d4ed8] transition-colors mt-4">
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display text-3xl mb-2 text-center">Connect your bank</h2>
              <p className="text-slate-400 text-sm text-center mb-8">PSD2 Open Banking — read-only. We never store your credentials.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {BANKS.map((bank) => (
                  <button key={bank.id} onClick={() => handleBankConnect(bank.id)} disabled={connecting}
                    className={`bg-white/5 border rounded-xl p-4 text-center hover:bg-white/10 transition-colors ${selectedBank === bank.id ? "border-[#2563eb]" : "border-white/10"} disabled:opacity-50`}>
                    <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm" style={{ background: bank.color }}>
                      {bank.name[0]}
                    </div>
                    <p className="text-sm font-medium">{bank.name}</p>
                  </button>
                ))}
              </div>
              {connecting && <p className="text-center text-sm text-[#3b82f6] mt-6">Connecting to {selectedBank}...</p>}
              <button onClick={handleSkipBank} className="w-full text-slate-500 text-sm mt-8 hover:text-white transition-colors">
                Skip for now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
