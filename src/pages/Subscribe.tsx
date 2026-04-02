import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, Shield } from "lucide-react";

export function Subscribe() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, email: user?.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  const handleSkip = () => navigate("/dashboard");

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display text-3xl mb-2">Start your free trial</h1>
        <p className="text-slate-400 text-sm mb-8">1 month free, then EUR 19.99/month. Cancel anytime.</p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-left">
          <div className="text-center mb-6">
            <p className="text-sm text-[#3b82f6] font-medium">askWijs Pro</p>
            <div className="flex items-baseline justify-center gap-1 mt-1">
              <span className="text-4xl font-bold">EUR 0</span>
              <span className="text-slate-400">/first month</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">then EUR 19.99/mo excl. BTW</p>
          </div>

          <ul className="space-y-3 text-sm text-slate-300 mb-6">
            {[
              "Unlimited PSD2 bank connections",
              "AI transaction categorization",
              "Live BTW dashboard & tax forecast",
              "Automatic BTW filing",
              "Receipt scanning via camera",
              "WhatsApp & Telegram deadline alerts",
              "Ask Wijs AI advisor",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-[#2563eb] text-white py-3 rounded-lg font-medium hover:bg-[#1d4ed8] transition-colors disabled:opacity-50"
          >
            {loading ? "Redirecting to Stripe..." : "Start free trial"}
          </button>

          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-500">
            <Shield className="w-3 h-3" />
            Secured by Stripe. No charge for 30 days.
          </div>
        </div>

        <button onClick={handleSkip} className="text-slate-500 text-sm mt-6 hover:text-white transition-colors">
          Skip — explore the dashboard first
        </button>
      </div>
    </div>
  );
}
