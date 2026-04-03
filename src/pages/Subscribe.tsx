import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// ── Design system tokens (DESIGN.md — Warm Premium Dark) ───────
const C = {
  bg: "#0B0F1A",
  surface: "#111827",
  border: "rgba(255,255,255,0.08)",
  borderSubtle: "rgba(255,255,255,0.04)",
  text: "#F9FAFB",
  muted: "#9CA3AF",
  faint: "#6B7280",
  dim: "#4B5563",
  accent: "#2563EB",
  accentHover: "#3B82F6",
  green: "#059669",
};

function Check() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5"><path d="M3 8l3.5 3.5L13 5" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function Subscribe() {
  const [loading, setLoading] = useState<"starter" | "pro" | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubscribe = async (tier: "starter" | "pro") => {
    setLoading(tier);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, email: user?.email, tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(null);
    }
  };

  const handleSkip = () => navigate("/dashboard");

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
    "Automatic BTW aangifte filing",
    "Receipt scanning with OCR",
    "Unlimited Ask Wijs AI advisor",
    "WhatsApp/Telegram notifications",
    "Priority support",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: C.bg }}>
      <div className="w-full max-w-[720px]">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 no-underline mb-4">
            <img src="/logo-white.svg" alt="askwijs" className="h-5 w-auto" />
            <span className="text-[18px] font-semibold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}>
              ask<span style={{ color: C.accent }}>wijs</span>
            </span>
          </Link>
          <h1 className="text-[28px] leading-[1.2] tracking-[-0.02em] mb-2" style={{ fontFamily: "'Lora', serif", fontWeight: 600, color: C.text }}>Choose your plan</h1>
          <p className="text-[15px]" style={{ color: C.muted }}>Start free for 30 days. Cancel anytime.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Starter */}
          <div className="rounded-xl p-6 text-left" style={{ background: C.surface, border: `1px solid ${C.borderSubtle}` }}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-4" style={{ color: C.dim }}>Starter</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-[36px] font-medium" style={{ color: C.text, fontVariantNumeric: "tabular-nums" }}>&euro;9,99</span>
              <span className="text-[14px]" style={{ color: C.dim }}>/month</span>
            </div>
            <p className="text-[12px] mb-6" style={{ color: C.dim }}>excl. BTW &middot; 30 days free</p>
            <div className="space-y-3 mb-6">
              {starterFeatures.map(f => (
                <div key={f} className="flex items-start gap-3">
                  <Check />
                  <span className="text-[13px]" style={{ color: C.muted }}>{f}</span>
                </div>
              ))}
            </div>
            <button onClick={() => handleSubscribe("starter")} disabled={loading !== null}
              className="w-full text-center text-[14px] font-medium py-3 rounded-lg transition-all hover:bg-[rgba(255,255,255,0.10)] disabled:opacity-50"
              style={{ background: "rgba(255,255,255,0.06)", color: C.text, border: `1px solid ${C.border}` }}>
              {loading === "starter" ? "Redirecting..." : "Get started"}
            </button>
          </div>

          {/* Pro */}
          <div className="rounded-xl p-6 text-left relative overflow-hidden" style={{ background: C.surface, border: "1px solid rgba(37,99,235,0.3)" }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)` }} />
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: C.dim }}>Pro</span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(37,99,235,0.12)", color: C.accent }}>Most popular</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-[36px] font-medium" style={{ color: C.text, fontVariantNumeric: "tabular-nums" }}>&euro;24,99</span>
              <span className="text-[14px]" style={{ color: C.dim }}>/month</span>
            </div>
            <p className="text-[12px] mb-6" style={{ color: C.dim }}>excl. BTW &middot; 30 days free</p>
            <div className="space-y-3 mb-6">
              {proFeatures.map(f => (
                <div key={f} className="flex items-start gap-3">
                  <Check />
                  <span className="text-[13px]" style={{ color: C.muted }}>{f}</span>
                </div>
              ))}
            </div>
            <button onClick={() => handleSubscribe("pro")} disabled={loading !== null}
              className="w-full text-center text-white text-[14px] font-medium py-3 rounded-lg transition-all hover:-translate-y-px disabled:opacity-50"
              style={{ background: C.accent }}>
              {loading === "pro" ? "Redirecting..." : "Start free trial"}
            </button>
            <p className="text-center text-[11px] mt-2" style={{ color: C.dim }}>No credit card required</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <button onClick={handleSkip} className="text-[13px] transition-colors hover:underline" style={{ color: C.dim }}>
            Skip — explore the dashboard first
          </button>
        </div>
      </div>
    </div>
  );
}
