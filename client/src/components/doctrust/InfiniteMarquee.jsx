import React from 'react';
import {
  UserCheck,
  ShieldAlert,
  Receipt,
  ScanLine,
  Landmark,
  FileSpreadsheet,
  Globe,
  Search,
  Scale,
  CreditCard,
  Building2,
  FileCheck,
  CheckCircle,
  Sparkles,
  Fingerprint,
} from 'lucide-react';

const ROW_1 = [
  { name: 'KYC Verification', icon: UserCheck, color: 'text-blue-600 bg-blue-50' },
  { name: 'Fraud Detection', icon: ShieldAlert, color: 'text-rose-600 bg-rose-50' },
  { name: 'Receipt Parsing', icon: Receipt, color: 'text-amber-600 bg-amber-50' },
  { name: 'OCR Extraction', icon: ScanLine, color: 'text-indigo-600 bg-indigo-50' },
  { name: 'Bank Statement Audit', icon: Landmark, color: 'text-emerald-600 bg-emerald-50' },
  { name: 'Tax Form Validation', icon: FileSpreadsheet, color: 'text-purple-600 bg-purple-50' },
  { name: 'Cross-Border ID Check', icon: Globe, color: 'text-cyan-600 bg-cyan-50' },
  { name: 'AML Screening', icon: Search, color: 'text-teal-600 bg-teal-50' },
];

const ROW_2 = [
  { name: 'Invoice 3-Way Match', icon: Scale, color: 'text-orange-600 bg-orange-50' },
  { name: 'Passport Authenticity', icon: Fingerprint, color: 'text-blue-600 bg-blue-50' },
  { name: 'Driver License Check', icon: CreditCard, color: 'text-green-600 bg-green-50' },
  { name: 'Corporate Entity Registry', icon: Building2, color: 'text-violet-600 bg-violet-50' },
  { name: 'Contract Tamper Audit', icon: FileCheck, color: 'text-indigo-600 bg-indigo-50' },
  { name: 'Medical Records Ingestion', icon: CheckCircle, color: 'text-pink-600 bg-pink-50' },
  { name: 'Proof of Address Audit', icon: Building2, color: 'text-emerald-600 bg-emerald-50' },
  { name: 'Digital Signatures PKI', icon: ScanLine, color: 'text-cyan-600 bg-cyan-50' },
];

export function InfiniteMarquee({ onOpenUpload }) {
  return (
    <section id="use-cases" className="py-20 sm:py-28 bg-[#F9FAFB] border-t border-gray-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Industry Solutions</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight mb-4">
          Explore Verification Use Cases
        </h2>

        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-normal">
          Purpose-built AI models trained on over 20 million authenticated documents across banking, fintech, healthcare, and enterprise procurement.
        </p>
      </div>

      {/* Marquee Container with pause-on-hover */}
      <div className="space-y-4 pause-hover">
        {/* Row 1: Forward scrolling */}
        <div className="flex overflow-hidden select-none mask-edges">
          <div className="animate-marquee flex items-center gap-3">
            {[...ROW_1, ...ROW_1].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={onOpenUpload}
                  className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-white border border-gray-200/80 shadow-xs hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/10 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shrink-0"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${item.color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-[#111827] whitespace-nowrap">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Reverse scrolling */}
        <div className="flex overflow-hidden select-none mask-edges">
          <div className="animate-marquee-reverse flex items-center gap-3">
            {[...ROW_2, ...ROW_2].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={onOpenUpload}
                  className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-white border border-gray-200/80 shadow-xs hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/10 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shrink-0"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${item.color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-[#111827] whitespace-nowrap">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InfiniteMarquee;
