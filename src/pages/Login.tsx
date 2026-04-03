import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// ── Design system tokens (DESIGN.md — Warm Premium Dark) ───────
const C = {
  bg: "#0B0F1A",
  surface: "#111827",
  surfaceElevated: "#1F2937",
  border: "rgba(255,255,255,0.08)",
  text: "#F9FAFB",
  muted: "#9CA3AF",
  faint: "#6B7280",
  dim: "#4B5563",
  accent: "#2563EB",
  accentHover: "#3B82F6",
  red: "#DC2626",
  redPale: "rgba(220, 38, 38, 0.12)",
};

export function Login({ isSignUp = false }: { isSignUp?: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        navigate("/onboarding");
      } else {
        await signIn(email, password);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.bg }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 no-underline mb-2">
            <img src="/logo-white.svg" alt="askwijs" className="h-5 w-auto" />
            <span className="text-[18px] font-semibold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}>
              ask<span style={{ color: C.accent }}>wijs</span>
            </span>
          </Link>
          <p className="text-[14px] mt-2" style={{ color: C.muted }}>
            {isSignUp ? "Create your account — 30 days free" : "Welcome back"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-[13px] px-4 py-3 rounded-lg" style={{ background: C.redPale, border: `1px solid rgba(220,38,38,0.2)`, color: C.red }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: C.faint }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg px-4 py-3 text-[14px] outline-none transition-colors"
              style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, color: C.text }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: C.faint }}>Password</label>
              {!isSignUp && (
                <Link to="/forgot-password" className="text-[11px] transition-colors hover:underline" style={{ color: C.accent }}>Forgot password?</Link>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg px-4 py-3 text-[14px] outline-none transition-colors"
              style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, color: C.text }}
              placeholder="Min. 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-[14px] font-medium transition-colors disabled:opacity-50"
            style={{ background: C.accent, color: "#fff" }}
            onMouseEnter={(e) => { if (!loading) (e.target as HTMLButtonElement).style.background = C.accentHover; }}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = C.accent}
          >
            {loading ? "..." : isSignUp ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-[13px] mt-6" style={{ color: C.dim }}>
          {isSignUp ? (
            <>Already have an account? <Link to="/login" className="hover:underline" style={{ color: C.accent }}>Sign in</Link></>
          ) : (
            <>New here? <Link to="/signup" className="hover:underline" style={{ color: C.accent }}>Start free trial</Link></>
          )}
        </p>
      </div>
    </div>
  );
}
