import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Receipt,
  FileText,
  Calendar,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";

const nav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard?tab=transactions", icon: ArrowLeftRight, label: "Transactions" },
  { to: "/dashboard?tab=invoices", icon: FileText, label: "Invoices" },
  { to: "/dashboard?tab=receipts", icon: Receipt, label: "Receipts" },
  { to: "/dashboard?tab=deadlines", icon: Calendar, label: "Deadlines" },
  { to: "/dashboard?tab=chat", icon: MessageCircle, label: "Ask Wijs" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — 220px dark per DESIGN.md */}
      <aside className="w-[220px] bg-[#0a0f1a] text-white flex flex-col shrink-0">
        <div className="px-5 py-6">
          <span className="font-display text-xl">
            ask<span className="text-[#3b82f6]">wijs</span>
          </span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
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
          <Link
            to="/dashboard?tab=settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#94a3b8] hover:text-white hover:bg-white/5"
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
