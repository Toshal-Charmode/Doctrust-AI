import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Trash2,
  FileCheck2,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export function TrustSecurityBadge() {
  return (
    <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Security Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-semibold shadow-xs mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Backed by ISO 27001-certified security</span>
        </div>

        {/* Heading & Subtext */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight mb-3">
          Your documents are private, protected, and always yours.
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto mb-6 leading-relaxed">
          We use banking-grade encryption at rest and in transit. Your files are never scanned for advertising, sold, or used for AI model training.
        </p>

        {/* Explore Trust Center Link */}
        <div className="mb-10">
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            <span>Explore Trust Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Minimal Trust Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-gray-200/70">
            <Lock className="w-4 h-4 text-blue-600 mb-2" />
            <div className="text-xs font-bold text-[#111827]">256-bit TLS / AES</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Military-grade in-transit encryption</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-gray-200/70">
            <Trash2 className="w-4 h-4 text-rose-600 mb-2" />
            <div className="text-xs font-bold text-[#111827]">Auto-Purge in 2h</div>
            <div className="text-[11px] text-gray-500 mt-0.5">All uploaded files permanently wiped</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-gray-200/70">
            <FileCheck2 className="w-4 h-4 text-emerald-600 mb-2" />
            <div className="text-xs font-bold text-[#111827]">GDPR & CCPA</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Full compliance with EU & US privacy</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-gray-200/70">
            <ShieldCheck className="w-4 h-4 text-purple-600 mb-2" />
            <div className="text-xs font-bold text-[#111827]">Zero-Knowledge</div>
            <div className="text-[11px] text-gray-500 mt-0.5">No human sees your file contents</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustSecurityBadge;
