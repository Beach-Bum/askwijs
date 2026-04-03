import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Receipt,
  FileText,
  Calendar,
  MessageCircle,
  Settings,
  LogOut,
  Building2,
  FileCheck,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { ChatPanel, injectChatKeyframes } from "./ChatPanel";

const nav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard?tab=transactions", icon: ArrowLeftRight, label: "Transactions" },
  { to: "/dashboard?tab=btw", icon: FileCheck, label: "BTW Aangifte" },
  { to: "/dashboard?tab=invoices", icon: FileText, label: "Invoices" },
  { to: "/dashboard?tab=receipts", icon: Receipt, label: "Receipts" },
  { to: "/dashboard?tab=deadlines", icon: Calendar, label: "Deadlines" },
  { to: "/dashboard?tab=banks", icon: Building2, label: "Bank Accounts" },
  { to: "/dashboard?tab=chat", icon: MessageCircle, label: "Ask Wijs" },
];

function WLogomark({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <rect width="32" height="32" rx="8" fill="#2563EB" />
      <path
        d="M7 10h2.4l2.8 9.6L15 10h2l2.8 9.6L22.6 10H25l-4.2 13h-2.2L16 14.2 13.4 23h-2.2L7 10z"
        fill="#fff"
      />
    </svg>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";
  const [lang, setLang] = useState<"en" | "nl">("en");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    injectChatKeyframes();
  }, []);

  const sidebarContent = (
    <>
      <div className="px-5 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <WLogomark className="w-7 h-7" />
          <span className="font-display text-xl text-[#F9FAFB]">
            ask<span className="text-[#2563EB]">wijs</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-[#9CA3AF] hover:text-white"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {nav.map((item) => {
          const itemTab = new URLSearchParams(item.to.split("?")[1] || "").get("tab") || "overview";
          const active = currentTab === itemTab;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-[rgba(37,99,235,0.15)] text-[#93c5fd]"
                  : "text-[#94a3b8] hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 space-y-1">
        <button
          onClick={() => setLang(lang === "en" ? "nl" : "en")}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#94a3b8] hover:text-white hover:bg-white/5 w-full"
        >
          <Globe className="w-4 h-4" />
          {lang === "en" ? "English" : "Nederlands"}
          <span className="ml-auto text-xs text-[#4B5563] uppercase">{lang === "en" ? "NL" : "EN"}</span>
        </button>
        <Link
          to="/dashboard?tab=settings"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            currentTab === "settings"
              ? "bg-[rgba(37,99,235,0.15)] text-[#93c5fd]"
              : "text-[#94a3b8] hover:text-white hover:bg-white/5"
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#94a3b8] hover:text-white hover:bg-white/5 w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0B0F1A] border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-white"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <WLogomark className="w-6 h-6" />
          <span className="font-display text-lg text-white">
            ask<span className="text-[#2563EB]">wijs</span>
          </span>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="w-[260px] h-full bg-[#0B0F1A] text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[220px] bg-[#0B0F1A] text-white flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Main canvas */}
      <main className="flex-1 bg-[#0B0F1A] overflow-auto pt-14 lg:pt-0">
        {children}
      </main>

      {/* Chat FAB */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed z-50 flex items-center justify-center rounded-full transition-transform hover:scale-105"
          style={{
            bottom: 24,
            right: 24,
            width: 48,
            height: 48,
            background: "#2563EB",
            boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
            animation: "chatFabPulse 2s ease-in-out infinite",
          }}
          aria-label="Open Ask Wijs chat"
        >
          <svg viewBox="0 0 340 260" fill="#fff" width="22" height="22">
            <path d="M272.47,219.31c-4.9,11.42-14.21,18.58-25.93,21.46-18.47,4.54-38.83-3.63-46.11-21.8l-28.26-70.49c-6.07,28.88-12.79,55.26-32.05,76.56-8.43,8.06-17.51,14.51-29.49,16.42-16.54,2.64-35.69-4.83-42.22-21.47L2.36,51.81C-2.36,39.8.4,26.33,7.03,16.19,13.37,6.49,23.57,1.44,34.86.24c18.33-1.94,34.98,7.85,41.73,25.07l60.36,153.95c10.21-19.06,16.81-76.13,11.04-91.84l-13.29-36.21c-5.28-14.38-1.04-30.59,9.96-41.1C151.66,3.43,160.93.37,170.69.06c16.74-.53,32,8.96,38.18,24.72l63.01,160.61c4.38,11.15,5.57,22.34.6,33.92Z" />
            <path d="M274.83,132.91c-3.75-9.17,13.14-7.33,19-27.63,2.6-9.01,3.09-18.52,1.06-27.57-16.02-.15-29.21-8.92-34.6-23.35-4.95-13.23-3.27-27.5,4.57-39.09,5.81-8.59,14.51-13.01,24.57-14.39,18.84-2.58,35.73,6.66,43.65,23.96,15.7,34.3.41,77.08-26.52,100.8-8.34,7.34-27.84,16.77-31.73,7.27Z" />
          </svg>
        </button>
      )}

      {/* Chat Panel */}
      <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
