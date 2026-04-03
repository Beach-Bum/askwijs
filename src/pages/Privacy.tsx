import { Link } from "react-router-dom";

export function Privacy() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#F9FAFB]">
      <nav className="flex items-center justify-between h-[72px] px-8">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img src="/logo-white.svg" alt="askwijs" className="h-5 w-auto" />
          <span className="text-[16px] font-semibold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            ask<span className="text-[#2563EB]">wijs</span>
          </span>
        </Link>
        <Link to="/" className="text-[14px] text-[#9CA3AF] hover:text-white transition-colors">&larr; Back</Link>
      </nav>

      <main className="max-w-[720px] mx-auto px-6 py-16">
        <h1 className="text-[36px] tracking-[-0.02em] mb-8" style={{ fontFamily: "'Lora', serif", fontWeight: 600 }}>Privacy Policy</h1>
        <div className="space-y-8 text-[15px] text-[#9CA3AF] leading-[1.7]">
          <section>
            <h2 className="text-[18px] font-medium text-[#F9FAFB] mb-3">What we collect</h2>
            <p>When you create an account, we store your email address, name, and business details (KvK number, BTW-id) that you provide during onboarding. When you connect your bank via Tink PSD2, we receive read-only access to your transaction data. We never store your bank credentials.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium text-[#F9FAFB] mb-3">How we use it</h2>
            <p>Your transaction data is used solely to categorize transactions, calculate BTW positions, and generate tax filings. We use Anthropic Claude to categorize transactions — your data is sent to their API for processing but is not used for model training. We do not sell, share, or monetize your financial data.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium text-[#F9FAFB] mb-3">Data storage</h2>
            <p>All data is stored in the EU (AWS eu-west-1 via Supabase). Passwords are handled by Supabase Auth and are never stored in plaintext. Payment data is processed by Stripe — we never see your full card number.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium text-[#F9FAFB] mb-3">Your rights (GDPR)</h2>
            <p>Under GDPR, you have the right to access, rectify, and delete your personal data at any time. You can export all your data or request complete account deletion by contacting privacy@askwijs.ai.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium text-[#F9FAFB] mb-3">Cookies</h2>
            <p>We use only essential cookies for authentication. No tracking cookies, no analytics scripts, no third-party ad pixels.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium text-[#F9FAFB] mb-3">Contact</h2>
            <p>For privacy questions or data requests: <a href="mailto:privacy@askwijs.ai" className="text-[#2563EB] hover:underline">privacy@askwijs.ai</a></p>
          </section>

          <p className="text-[13px] text-[#4B5563]">Last updated: April 2026</p>
        </div>
      </main>
    </div>
  );
}
