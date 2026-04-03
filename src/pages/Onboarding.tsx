import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Building2, Landmark, ArrowRight, Check, AlertCircle } from "lucide-react";

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

interface FormErrors {
  name?: string;
  companyName?: string;
  kvkNumber?: string;
}

function validateForm(form: { name: string; companyName: string; kvkNumber: string }): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.companyName.trim()) errors.companyName = "Company name is required";
  if (form.kvkNumber && !/^\d{8}$/.test(form.kvkNumber)) errors.kvkNumber = "KvK number must be 8 digits";
  return errors;
}

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", companyName: "", kvkNumber: "", btwId: "", phone: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBankConnect = async (bankId: string) => {
    setSelectedBank(bankId);
    setConnecting(true);
    setApiError(null);
    try {
      const data = await api.post<{ redirectUrl?: string }>("/banking/connect", { bankId });
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (err) {
      setApiError("Failed to connect to bank. Please try again.");
      setConnecting(false);
    }
  };

  const handleSkipBank = () => navigate("/subscribe");

  const handleSaveProfile = async () => {
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);
    setApiError(null);
    try {
      await api.post("/user/profile", {
        name: form.name,
        companyName: form.companyName,
        kvkNumber: form.kvkNumber,
        btwId: form.btwId,
        phone: form.phone,
      });
      setStep(2);
    } catch (err) {
      setApiError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#2563eb]";
  const errorInputClass = "w-full bg-white/5 border border-red-500/50 rounded-lg px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-red-500";

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

          {apiError && (
            <div className="mb-6 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {apiError}
            </div>
          )}

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
                    <input value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: undefined }); }} className={errors.name ? errorInputClass : inputClass} placeholder="Jan de Vries" />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Company name</label>
                    <input value={form.companyName} onChange={(e) => { setForm({ ...form, companyName: e.target.value }); setErrors({ ...errors, companyName: undefined }); }} className={errors.companyName ? errorInputClass : inputClass} placeholder="De Vries Consulting" />
                    {errors.companyName && <p className="text-red-400 text-xs mt-1">{errors.companyName}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">KvK number</label>
                    <input value={form.kvkNumber} onChange={(e) => { setForm({ ...form, kvkNumber: e.target.value }); setErrors({ ...errors, kvkNumber: undefined }); }} className={errors.kvkNumber ? errorInputClass : inputClass} placeholder="12345678" />
                    {errors.kvkNumber && <p className="text-red-400 text-xs mt-1">{errors.kvkNumber}</p>}
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
                <button onClick={handleSaveProfile} disabled={saving} className="w-full bg-[#2563eb] text-white py-3 rounded-lg font-medium hover:bg-[#1d4ed8] transition-colors mt-4 disabled:opacity-50">
                  {saving ? "Saving..." : "Continue"}
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
