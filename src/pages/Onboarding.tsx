import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { AlertCircle, ArrowRight, Shield, Check } from "lucide-react";

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

/* ------------------------------------------------------------------ */
/*  Tiny inline SVG components                                        */
/* ------------------------------------------------------------------ */

function WLogomark() {
  return (
    <svg viewBox="0 0 339.41 242" fill="#fff" xmlns="http://www.w3.org/2000/svg" style={{ height: 28, width: "auto" }}>
      <path d="M272.47,219.31c-4.9,11.42-14.21,18.58-25.93,21.46-18.47,4.54-38.83-3.63-46.11-21.8l-28.26-70.49c-6.07,28.88-12.79,55.26-32.05,76.56-8.43,8.06-17.51,14.51-29.49,16.42-16.54,2.64-35.69-4.83-42.22-21.47L2.36,51.81C-2.36,39.8.4,26.33,7.03,16.19,13.37,6.49,23.57,1.44,34.86.24c18.33-1.94,34.98,7.85,41.73,25.07l60.36,153.95c10.21-19.06,16.81-76.13,11.04-91.84l-13.29-36.21c-5.28-14.38-1.04-30.59,9.96-41.1C151.66,3.43,160.93.37,170.69.06c16.74-.53,32,8.96,38.18,24.72l63.01,160.61c4.38,11.15,5.57,22.34.6,33.92Z" />
      <path d="M274.83,132.91c-3.75-9.17,13.14-7.33,19-27.63,2.6-9.01,3.09-18.52,1.06-27.57-16.02-.15-29.21-8.92-34.6-23.35-4.95-13.23-3.27-27.5,4.57-39.09,5.81-8.59,14.51-13.01,24.57-14.39,18.84-2.58,35.73,6.66,43.65,23.96,15.7,34.3.41,77.08-26.52,100.8-8.34,7.34-27.84,16.77-31.73,7.27Z" />
    </svg>
  );
}

function BankCheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 16, height: 16, flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7" fill="#2563EB" />
      <path d="M5 8.2L7 10.2L11 6.2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Style constants                                                   */
/* ------------------------------------------------------------------ */

const INPUT_BASE =
  "w-full bg-[#1F2937] border border-[rgba(255,255,255,0.08)] rounded-md px-4 py-3 text-[#F9FAFB] placeholder:text-[#4B5563] focus:border-[rgba(37,99,235,0.5)] focus:outline-none transition-colors text-sm";

const INPUT_ERROR =
  "w-full bg-[#1F2937] border border-red-500/50 rounded-md px-4 py-3 text-[#F9FAFB] placeholder:text-[#4B5563] focus:border-red-500 focus:outline-none transition-colors text-sm";

const LABEL =
  "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B7280] mb-2";

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function Onboarding() {
  const [form, setForm] = useState({ name: "", companyName: "", kvkNumber: "", btwId: "", phone: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  /* ---- progress calculation ---- */
  const progress = useMemo(() => {
    const fields = [
      form.name.trim(),
      form.companyName.trim(),
      form.kvkNumber.trim(),
      form.btwId.trim(),
      form.phone.trim(),
      selectedBank,
    ];
    const filled = fields.filter(Boolean).length;
    // email is always filled (from auth), so count it as +1
    return Math.round(((filled + 1) / 7) * 100);
  }, [form, selectedBank]);

  /* ---- handlers (unchanged logic) ---- */

  const handleCompleteSetup = async () => {
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
    } catch {
      setApiError("Failed to save profile. Please try again.");
      setSaving(false);
      return;
    }

    if (selectedBank) {
      setConnecting(true);
      try {
        const data = await api.post<{ redirectUrl?: string }>("/banking/connect", { bankId: selectedBank });
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
          return;
        }
      } catch {
        setApiError("Failed to connect to bank. Please try again.");
        setConnecting(false);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    navigate("/subscribe");
  };

  const handleSkipBank = async () => {
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
      navigate("/subscribe");
    } catch {
      setApiError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen text-[#F9FAFB]" style={{ background: "#0B0F1A" }}>

      {/* ---- Fixed progress bar at very top ---- */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-50"
        style={{ background: "rgba(255,255,255,0.04)" }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-r-sm transition-all duration-400 ease-out"
          style={{ width: `${progress}%`, background: "#2563EB" }}
        />
      </div>

      {/* ---- Page column ---- */}
      <main className="max-w-[560px] mx-auto px-6 pt-12 pb-20 sm:pt-12" style={{ paddingTop: 48, paddingBottom: 80 }}>

        {/* ---- Header ---- */}
        <header className="flex flex-col items-center text-center mb-10">
          <div className="mb-6 opacity-90">
            <WLogomark />
          </div>
          <h1
            className="text-[32px] leading-tight text-[#F9FAFB] mb-2"
            style={{ fontFamily: "'Lora', serif", fontWeight: 600 }}
          >
            Let's get you set up
          </h1>
          <span className="text-sm text-[#9CA3AF]">~2 minutes</span>
        </header>

        {/* ---- API error banner ---- */}
        {apiError && (
          <div className="mb-5 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-[10px] px-4 py-3 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {apiError}
          </div>
        )}

        {/* ================================================================ */}
        {/* Section 1 : You                                                  */}
        {/* ================================================================ */}
        <section
          className="rounded-[14px] p-7 mb-5"
          style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h2 className="text-[16px] font-semibold text-[#F9FAFB] mb-6 flex items-center gap-2.5">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
              style={{ background: "rgba(37,99,235,0.12)", color: "#2563EB" }}
            >
              1
            </span>
            You
          </h2>

          {/* Full name */}
          <div className="mb-5">
            <label className={LABEL}>Full name</label>
            <input
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: undefined }); }}
              className={errors.name ? INPUT_ERROR : INPUT_BASE}
              placeholder="Pieter de Vries"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
          </div>

          {/* Email (pre-filled, disabled) */}
          <div>
            <label className={LABEL}>
              Email address
              {user?.email && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-medium normal-case tracking-normal rounded px-1.5 py-0.5"
                  style={{ background: "rgba(5,150,105,0.12)", color: "#059669" }}
                >
                  <Check className="w-2.5 h-2.5" />
                  Verified
                </span>
              )}
            </label>
            <input
              value={user?.email ?? ""}
              disabled
              className={`${INPUT_BASE} opacity-50 cursor-not-allowed`}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Section 2 : Your Business                                        */}
        {/* ================================================================ */}
        <section
          className="rounded-[14px] p-7 mb-5"
          style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h2 className="text-[16px] font-semibold text-[#F9FAFB] mb-6 flex items-center gap-2.5">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
              style={{ background: "rgba(37,99,235,0.12)", color: "#2563EB" }}
            >
              2
            </span>
            Your Business
          </h2>

          {/* Company name */}
          <div className="mb-5">
            <label className={LABEL}>Company name</label>
            <input
              value={form.companyName}
              onChange={(e) => { setForm({ ...form, companyName: e.target.value }); setErrors({ ...errors, companyName: undefined }); }}
              className={errors.companyName ? INPUT_ERROR : INPUT_BASE}
              placeholder="De Vries Consultancy"
            />
            {errors.companyName && <p className="text-red-400 text-xs mt-1.5">{errors.companyName}</p>}
          </div>

          {/* KvK + BTW row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className={LABEL}>KvK Number</label>
              <input
                value={form.kvkNumber}
                onChange={(e) => { setForm({ ...form, kvkNumber: e.target.value }); setErrors({ ...errors, kvkNumber: undefined }); }}
                className={errors.kvkNumber ? INPUT_ERROR : INPUT_BASE}
                placeholder="12345678"
                maxLength={8}
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontVariantNumeric: "tabular-nums" }}
              />
              <p className="mt-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4B5563" }}>8 digits</p>
              {errors.kvkNumber && <p className="text-red-400 text-xs mt-1">{errors.kvkNumber}</p>}
            </div>
            <div>
              <label className={LABEL}>BTW-id</label>
              <input
                value={form.btwId}
                onChange={(e) => setForm({ ...form, btwId: e.target.value })}
                className={INPUT_BASE}
                placeholder="NL000000000B01"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontVariantNumeric: "tabular-nums" }}
              />
              <p className="mt-1.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4B5563" }}>NL___B01</p>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className={LABEL}>
              Phone
              <span
                className="text-[10px] font-medium normal-case tracking-normal rounded px-1.5 py-0.5"
                style={{ background: "rgba(255,255,255,0.04)", color: "#4B5563" }}
              >
                optional
              </span>
            </label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={INPUT_BASE}
              placeholder="+31 6 12345678"
              type="tel"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Section 3 : Your Bank                                            */}
        {/* ================================================================ */}
        <section
          className="rounded-[14px] p-7 mb-5"
          style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h2 className="text-[16px] font-semibold text-[#F9FAFB] mb-6 flex items-center gap-2.5">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
              style={{ background: "rgba(37,99,235,0.12)", color: "#2563EB" }}
            >
              3
            </span>
            Your Bank
          </h2>

          {/* 2-column bank grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {BANKS.map((bank) => {
              const isSelected = selectedBank === bank.id;
              return (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => setSelectedBank(bank.id)}
                  disabled={connecting}
                  className="flex items-center gap-3 rounded-md px-3.5 py-3.5 text-left transition-colors disabled:opacity-50"
                  style={{
                    background: isSelected ? "rgba(37,99,235,0.12)" : "#1F2937",
                    border: isSelected ? "1px solid #2563EB" : "1px solid rgba(255,255,255,0.08)",
                    borderLeft: `3px solid ${isSelected ? "#2563EB" : bank.color}`,
                    cursor: connecting ? "not-allowed" : "pointer",
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: bank.color }}
                  />
                  <span className="text-[13px] font-medium text-[#F9FAFB] flex-1">{bank.name}</span>
                  <span
                    className="transition-opacity"
                    style={{ opacity: isSelected ? 1 : 0 }}
                  >
                    <BankCheckIcon />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Trust note */}
          <p className="text-[13px] text-[#6B7280] leading-relaxed text-center px-2 flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5 shrink-0 text-[#6B7280]" />
            We use Tink PSD2. Read-only access. We never move your money.
          </p>

          {connecting && (
            <p className="text-center text-sm text-[#3B82F6] mt-4">
              Connecting to {BANKS.find((b) => b.id === selectedBank)?.name}...
            </p>
          )}
        </section>

        {/* ================================================================ */}
        {/* Bottom actions                                                   */}
        {/* ================================================================ */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={handleCompleteSetup}
            disabled={saving || connecting}
            className="w-full h-12 rounded-[10px] text-[15px] font-semibold text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            style={{ background: "#2563EB" }}
            onMouseEnter={(e) => { if (!saving && !connecting) (e.currentTarget.style.background = "#3B82F6"); }}
            onMouseLeave={(e) => { (e.currentTarget.style.background = "#2563EB"); }}
          >
            {saving ? "Saving..." : connecting ? "Connecting..." : "Complete setup"}
            {!saving && !connecting && <ArrowRight className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleSkipBank}
            disabled={saving}
            className="text-[13px] bg-transparent border-none transition-colors disabled:opacity-50"
            style={{ color: "#6B7280", cursor: saving ? "not-allowed" : "pointer" }}
            onMouseEnter={(e) => { if (!saving) (e.currentTarget.style.color = "#9CA3AF"); }}
            onMouseLeave={(e) => { (e.currentTarget.style.color = "#6B7280"); }}
          >
            I'll connect my bank later
          </button>
        </div>

      </main>
    </div>
  );
}
