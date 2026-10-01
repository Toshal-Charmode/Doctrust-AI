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
  CheckCircle,
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
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-slate-800/80 bg-slate-950/60 min-h-[calc(100vh-4rem)] p-4 justify-between">
      <div className="space-y-6">
        {/* Quick Upload CTA */}
        <NavLink
          to="/upload"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs tracking-wide shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Documents</span>
        </NavLink>

        {/* Navigation list */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Platform Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600/10 text-cyan-400 border border-cyan-500/20 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
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

      {/* Bottom Procurement AI Trust Card */}
      <div className="rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950 p-3.5 space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-blue-500/10 text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-300">
            3-Way Match Active
          </span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Cross-validates purchase orders, invoices, and delivery receipts in real time.
        </p>
        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
          <span>Engine: Gemini 2.5</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
