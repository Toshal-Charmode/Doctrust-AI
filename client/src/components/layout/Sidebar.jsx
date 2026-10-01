import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Files,
  UploadCloud,
  GitCompare,
  MessageSquareText,
  Settings,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/documents',
    label: 'Documents',
    icon: Files,
  },
  {
    to: '/upload',
    label: 'Upload Documents',
    icon: UploadCloud,
    highlight: true,
  },
  {
    to: '/validation',
    label: 'Validation Center',
    icon: GitCompare,
  },
  {
    to: '/chat',
    label: 'AI Knowledge Chat',
    icon: MessageSquareText,
  },
  {
    to: '/settings',
    label: 'Settings & API',
    icon: Settings,
  },
];

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-[#F0EBE1] bg-white/70 backdrop-blur-md min-h-[calc(100vh-4rem)] p-4 justify-between">
      <div className="space-y-6">
        {/* Quick Upload CTA with Warm Coral & Peach Gradient */}
        <NavLink
          to="/upload"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#FF9D9D] via-[#FFC5AA] to-[#FF9D9D] hover:opacity-90 text-slate-900 font-bold text-xs tracking-wide shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
        >
          <UploadCloud className="w-4 h-4 text-slate-800" />
          <span>Upload Documents</span>
        </NavLink>

        {/* Navigation list */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Platform Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#FFC5AA]/25 text-[#c25050] border border-[#FFC5AA]/50 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-[#FAF9F6]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Procurement AI Trust Card with Soft Pastel Mint & Lemon Glow */}
      <div className="rounded-2xl border border-[#d8e8a8] bg-gradient-to-br from-[#EEF8CD]/60 to-[#BBF1D2]/40 p-4 space-y-2.5 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-white text-emerald-700 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-xs font-bold text-slate-800">
            3-Way Match Active
          </span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
          Cross-validates purchase orders, invoices, and delivery receipts in real time.
        </p>
        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 font-medium border-t border-[#d8e8a8]/60">
          <span>Engine: Gemini 2.5</span>
          <span className="flex items-center gap-1 text-emerald-700 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
