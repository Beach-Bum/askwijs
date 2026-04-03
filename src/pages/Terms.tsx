import { Link } from "react-router-dom";

export function Terms() {
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
        <h1 className="text-[36px] tracking-[-0.02em] mb-8" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>Terms of Service</h1>
        <div className="space-y-8 text-[15px] text-[#9CA3AF] leading-[1.7]">
          <section>
            <h2 className="text-[18px] font-medium text-[#F9FAFB] mb-3">Service</h2>
            <p>askwijs ("the Service") is an AI-powered financial administration platform that helps Dutch freelancers (ZZP'ers) and expats manage their taxes, BTW filings, and bookkeeping. The Service is provided by askwijs B.V., registered in the Netherlands.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium text-[#F9FAFB] mb-3">Account</h2>
            <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. You must be at least 18 years old to use the Service.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium text-[#F9FAFB] mb-3">Subscription and billing</h2>
            <p>askwijs offers a 30-day free trial. After the trial, a monthly subscription fee applies. All prices are listed excluding BTW. Subscriptions are billed monthly via Stripe. You can cancel at any time — your access continues until the end of the current billing period.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium text-[#F9FAFB] mb-3">Not financial advice</h2>
            <p>askwijs provides automated tax calculations and AI-assisted categorization. This is not a substitute for professional tax advice. While we aim for accuracy, you are ultimately responsible for the correctness of your tax filings. We recommend consulting a certified tax advisor for complex situations.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium text-[#F9FAFB] mb-3">Data and privacy</h2>
            <p>Your use of the Service is also governed by our <Link to="/privacy" className="text-[#2563EB] hover:underline">Privacy Policy</Link>. Bank connections are read-only via PSD2 Open Banking. We can never initiate payments or move your money.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium text-[#F9FAFB] mb-3">Limitation of liability</h2>
            <p>askwijs is provided "as is". We are not liable for errors in automated tax calculations, missed deadlines, or any financial loss arising from use of the Service. Our total liability is limited to the amount you paid for the Service in the 12 months prior to the claim.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium text-[#F9FAFB] mb-3">Governing law</h2>
            <p>These terms are governed by the laws of the Netherlands. Any disputes will be resolved in the courts of Amsterdam.</p>
          </section>

          <p className="text-[13px] text-[#4B5563]">Last updated: April 2026</p>
        </div>
      </main>
    </div>
  );
}
