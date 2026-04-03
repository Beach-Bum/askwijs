import { Link } from "react-router-dom";

export function Terms() {
  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <nav className="flex items-center justify-between h-[72px] px-8">
        <Link to="/" className="text-[16px] font-semibold tracking-tight">
          ask<span className="text-[#5e6ad2]">wijs</span>
        </Link>
        <Link to="/" className="text-[14px] text-[#8a8f98] hover:text-white transition-colors">&larr; Back</Link>
      </nav>

      <main className="max-w-[720px] mx-auto px-6 py-16">
        <h1 className="text-[36px] font-medium tracking-[-0.02em] mb-8">Terms of Service</h1>
        <div className="space-y-8 text-[15px] text-[#8a8f98] leading-[1.7]">
          <section>
            <h2 className="text-[18px] font-medium text-[#f7f8f8] mb-3">Service</h2>
            <p>askwijs ("the Service") is an AI-powered financial administration platform that helps Dutch freelancers (ZZP'ers) and expats manage their taxes, BTW filings, and bookkeeping. The Service is provided by askwijs B.V., registered in the Netherlands.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium text-[#f7f8f8] mb-3">Account</h2>
            <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. You must be at least 18 years old to use the Service.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium text-[#f7f8f8] mb-3">Subscription and billing</h2>
            <p>askwijs offers a 30-day free trial. After the trial, a monthly subscription fee applies. All prices are listed excluding BTW. Subscriptions are billed monthly via Stripe. You can cancel at any time — your access continues until the end of the current billing period.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium text-[#f7f8f8] mb-3">Not financial advice</h2>
            <p>askwijs provides automated tax calculations and AI-assisted categorization. This is not a substitute for professional tax advice. While we aim for accuracy, you are ultimately responsible for the correctness of your tax filings. We recommend consulting a certified tax advisor for complex situations.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium text-[#f7f8f8] mb-3">Data and privacy</h2>
            <p>Your use of the Service is also governed by our <Link to="/privacy" className="text-[#5e6ad2] hover:underline">Privacy Policy</Link>. Bank connections are read-only via PSD2 Open Banking. We can never initiate payments or move your money.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium text-[#f7f8f8] mb-3">Limitation of liability</h2>
            <p>askwijs is provided "as is". We are not liable for errors in automated tax calculations, missed deadlines, or any financial loss arising from use of the Service. Our total liability is limited to the amount you paid for the Service in the 12 months prior to the claim.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-medium text-[#f7f8f8] mb-3">Governing law</h2>
            <p>These terms are governed by the laws of the Netherlands. Any disputes will be resolved in the courts of Amsterdam.</p>
          </section>

          <p className="text-[13px] text-[#3a3e47]">Last updated: April 2026</p>
        </div>
      </main>
    </div>
  );
}
