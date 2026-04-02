import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Brain,
  BarChart3,
  FileCheck,
  MessageCircle,
  Shield,
  CheckCircle2,
  Clock,
} from "lucide-react";

const pillars = [
  { icon: Building2, title: "Connect", desc: "PSD2 Open Banking — ING, ABN AMRO, Rabobank, Bunq auto-linked. Read-only, you control access." },
  { icon: Brain, title: "Categorize", desc: "Every transaction auto-tagged: business vs personal, deductible %, correct BTW rate. Learns from your corrections." },
  { icon: BarChart3, title: "Dashboard", desc: "Live netto income, BTW position, tax forecast, and deadline tracker — updated as transactions come in." },
  { icon: FileCheck, title: "File", desc: "Wijs prepares your quarterly BTW aangifte and submits to Belastingdienst. You just approve." },
  { icon: MessageCircle, title: "Advise", desc: "Ask Wijs anything about YOUR finances — real answers grounded in your actual transaction data." },
];

export function Landing() {
  const { user, loading } = useAuth();
  if (!loading && user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 md:px-14 h-16 border-b border-white/5">
        <span className="font-display text-xl">ask<span className="text-[#3b82f6]">wijs</span></span>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Log in</Link>
          <Link to="/signup" className="text-sm bg-[#2563eb] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-colors">
            Start free trial
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-sm mb-8">
          <Clock className="w-4 h-4" />
          Next BTW deadline: April 30, 2026
        </div>
        <h1 className="font-display text-5xl md:text-6xl leading-tight">
          Your Dutch taxes.<br />
          <span className="text-[#3b82f6]">Fully automated.</span>
        </h1>
        <p className="text-lg text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed">
          Connect your bank. Wijs categorizes every transaction, calculates your live BTW position,
          and files your returns automatically. Built for ZZP'ers and expats in the Netherlands.
        </p>
        <div className="flex items-center justify-center gap-4 mt-10">
          <Link
            to="/signup"
            className="bg-[#2563eb] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1d4ed8] transition-colors inline-flex items-center gap-2"
          >
            Start free trial <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-sm text-slate-500">1 month free · no credit card needed</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-16 text-sm text-slate-500">
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> ING, Rabobank, ABN AMRO, Bunq</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 21%, 9%, 0% BTW rates</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> KvK & Belastingdienst ready</div>
          <div className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-500" /> Bank-grade encryption</div>
        </div>
      </section>

      {/* 5 Pillars */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="font-display text-3xl text-center mb-12">Five pillars. One platform.</h2>
        <div className="grid md:grid-cols-5 gap-4">
          {pillars.map((p) => (
            <div key={p.title} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p.icon className="w-6 h-6 text-[#3b82f6] mb-3" />
              <h3 className="font-semibold text-white mb-2">{p.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white/[0.02] border-t border-white/5 py-20">
        <div className="max-w-md mx-auto px-6 text-center">
          <h2 className="font-display text-3xl mb-2">Simple pricing</h2>
          <p className="text-slate-400 mb-8">One plan. Everything included.</p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <p className="text-sm text-[#3b82f6] font-medium mb-2">askWijs Pro</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold">€19.99</span>
              <span className="text-slate-400">/month</span>
            </div>
            <p className="text-sm text-slate-500 mt-2">excl. BTW · first month free</p>
            <ul className="text-left mt-6 space-y-3 text-sm text-slate-300">
              {[
                "Unlimited bank connections (PSD2)",
                "AI transaction categorization",
                "Live BTW dashboard & tax forecast",
                "Automatic BTW aangifte filing",
                "Receipt scanning (OCR)",
                "Ask Wijs — your AI financial advisor",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/signup"
              className="block mt-6 bg-[#2563eb] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#1d4ed8] transition-colors"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-sm text-slate-500">
          <span className="font-display text-base text-slate-400">ask<span className="text-[#3b82f6]">wijs</span></span>
          <p>© 2026 askwijs.ai · Built for ZZP'ers and expats in 🇳🇱</p>
        </div>
      </footer>
    </div>
  );
}
