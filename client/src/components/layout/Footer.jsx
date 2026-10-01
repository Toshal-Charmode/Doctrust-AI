import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/40 text-slate-500 text-xs py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-400">DocuTrust AI</span>
          <span className="text-slate-600">—</span>
          <span>Turn documents into decisions.</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <span>Intelligent Document Processing Hackathon MVP</span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="text-slate-500">Google Gemini & PostgreSQL Powered</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
