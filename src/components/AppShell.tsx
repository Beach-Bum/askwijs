import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
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
} from "lucide-react";

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

export function AppShell({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";
  const [lang, setLang] = useState<"en" | "nl">("en");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#0a0f1a] text-white flex flex-col shrink-0">
        <div className="px-5 py-6">
          <span className="font-display text-xl">
            ask<span className="text-[#3b82f6]">wijs</span>
          </span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {nav.map((item) => {
            const itemTab = new URLSearchParams(item.to.split("?")[1] || "").get("tab") || "overview";
            const active = currentTab === itemTab;
            return (
              <Link
                key={item.to}
                to={item.to}
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
          {/* Language switcher */}
          <button
            onClick={() => setLang(lang === "en" ? "nl" : "en")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#94a3b8] hover:text-white hover:bg-white/5 w-full"
          >
            <Globe className="w-4 h-4" />
            {lang === "en" ? "English" : "Nederlands"}
            <span className="ml-auto text-xs text-slate-600 uppercase">{lang === "en" ? "NL" : "EN"}</span>
          </button>
          <Link
            to="/dashboard?tab=settings"
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
      </aside>

      {/* Main canvas */}
      <main className="flex-1 bg-[#f8fafc] overflow-auto">
        {children}
      </main>
    </div>
  );
}
